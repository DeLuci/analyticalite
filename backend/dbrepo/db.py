import sqlite3
from .repository import Repository
from abc import ABC


class Sqlite3Database(Repository, ABC):
    tables = ["entity", "attribute", "value"]

    def __init__(self):
        self.db = None
        self.selected_table = None

    def close_db(self):
        self.db = None

    def connection(self):
        return sqlite3.connect(self.db)

    def connect_to_database(self, database_path: str) -> Exception:
        if self.db is not None:
            return Exception("Close database before connecting to a new one")

        try:
            self.db = database_path
        except Exception as e:
            print("Error connecting to new database", e)

    def eav_schema(self, table_name: str):
        conn = self.connection()
        try:
            cur = conn.cursor()
            cur.execute(f"CREATE TABLE IF NOT EXISTS {table_name}_entity (entityID INTEGER PRIMARY KEY, label TEXT);")
            cur.execute(f"CREATE TABLE IF NOT EXISTS {table_name}_attribute (attributeID INTEGER PRIMARY KEY, attribute TEXT);")
            cur.execute(f"CREATE TABLE IF NOT EXISTS {table_name}_value (entityID INTEGER, attributeID INTEGER, value TEXT, FOREIGN KEY (entityID) REFERENCES {table_name}_entity(entityID), FOREIGN KEY (attributeID) REFERENCES {table_name}_attribute(attributeID));")
            conn.commit()
        except Exception as e:
            print("An error occured: ", e)
            raise
        finally:
            cur.close()
            conn.close()

    def insert_table_info(self, table_name: str, label: list, attributes: list, value_map):
        conn = self.connection()
        try:
            cur = conn.cursor()
            cur.executemany(f"INSERT INTO {table_name}_entity (label) VALUES (?)", label)
            cur.executemany(f"INSERT INTO {table_name}_attribute (attribute) VALUES (?)", attributes)

            label_map = {}
            attribute_map = {}

            cur.execute(f"SELECT label, entityID FROM {table_name}_entity")
            label_row = cur.fetchall()

            cur.execute(f"SELECT attribute, attributeID FROM {table_name}_attribute")
            attribute_row = cur.fetchall()

            for row in label_row:
                label_map[row[0]] = row[1]

            for row in attribute_row:
                attribute_map[row[0]] = row[1]

            # Prepare and Insert Values
            values_to_insert = []
            for (label, attribute), value in value_map.items():
                entity_id = label_map.get(label)
                attribute_id = attribute_map.get(attribute)
                if entity_id is not None and attribute_id is not None:
                    values_to_insert.append((entity_id, attribute_id, value))

            cur.executemany(f"INSERT INTO {table_name}_value VALUES (?, ?, ?)",
                            values_to_insert)

            conn.commit()
        except sqlite3.OperationalError as e:
            print(f"An error occurred: {e}")
            conn.rollback()
            raise
        finally:
            cur.close()

    def drop_table(self, table_name: str):
        conn = self.connection()
        try:
            cur = conn.cursor()
            cur.execute(f"DROP TABLE IF EXISTS {table_name}")
            conn.commit()
            cur.close()
        except Exception as e:
            print(f"Error deleting table '{table_name}':", e)

    def get_info(self, query: str) -> list:
        conn = self.connection()
        try:
            cur = conn.cursor()
            cur.execute(query)
            rows = cur.fetchall()
            cur.close()
            return rows
        except sqlite3.OperationalError as e:
            print("query failed: ", e)

    def get_tables(self) -> set:
        conn = self.connection()
        cur = conn.cursor()
        cur.execute("""SELECT name from sqlite_master WHERE type='table';""")
        rows = cur.fetchall()

        tables = set()
        for tu in rows:
            table_name = tu[0]
            for suffix in self.tables:
                if table_name.endswith(f"_{suffix}"):
                    table_name = table_name[:-len(f"_{suffix}")]
                    break
            tables.add(table_name)

        cur.close()
        conn.close()
        return tables

    def fetch_table_creation_code(self):
        table_creation_sql = {}
        conn = self.connection()
        cur = conn.cursor()
        for suffix in self.tables:
            table_name = f"{self.selected_table}_{suffix}"
            cur.execute(f"SELECT sql FROM sqlite_master WHERE type ='table' and name = '{table_name}'")
            query = cur.fetchone()

            if query is not None:
                table_creation_sql[suffix] = query[0]

        cur.close()
        conn.commit()

        return table_creation_sql

    def attribute_label_code(self):
        conn = self.connection()
        cur = conn.cursor()

        mp = {}

        table_entity = f"{self.selected_table}_{self.tables[0]}"
        cur.execute(f"SELECT label FROM {table_entity}")
        label_query = cur.fetchall()

        table_attribute = f"{self.selected_table}_{self.tables[1]}"
        cur.execute(f"SELECT attribute FROM '{table_attribute}'")
        attribute_query = cur.fetchall()

        mp["label"] = [tu[0] for tu in label_query]
        mp["attribute"] = [tu[0] for tu in attribute_query]

        conn.commit()
        cur.close()
        conn.close()
        return mp

    def set_selected_table(self, table_name):
        self.selected_table = table_name
