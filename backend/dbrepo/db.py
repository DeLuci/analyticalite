import os.path
import sqlite3

import pandas as pd

from .repository import Repository
from abc import ABC


class Sqlite3Database(Repository, ABC):

    def __init__(self):
        self.conn = None
        self.selected_table = None

    def close_connection(self):
        try:
            self.conn.close()
            self.conn = None
        except Exception as e:
            raise Exception("Error closing connection:", e)

    def connect_to_database(self, database_path: str) -> Exception:
        if self.conn is not None:
            return Exception("Disconnect from database before connecting to a new one")

        try:
            self.conn = sqlite3.connect(database_path)
        except Exception as e:
            print("Error connecting to new database", e)

    def create_table(self, row: tuple, column_names: tuple, table_name: str):
        query = f"CREATE TABLE IF NOT EXISTS {table_name} {self.get_column_types(row, column_names)}"
        try:
            cur = self.conn.cursor()
            cur.execute(query)
            cur.close()
        except sqlite3.OperationalError as e:
            raise e

    def insert_table_info(self, table_name: str, data: list):
        value_placeholder = ', '.join(['?'] * len(data[0]))
        try:
            cur = self.conn.cursor()
            cur.executemany(f"INSERT INTO {table_name} VALUES ({value_placeholder})", data)
            self.conn.commit()
            cur.close()
        except sqlite3.OperationalError as e:
            raise e

    def drop_table(self, table_name: str):
        try:
            cur = self.conn.cursor()
            cur.execute(f"DROP TABLE IF EXISTS {table_name}")
            self.conn.commit()
            cur.close()
        except Exception as e:
            print(f"Error deleting table '{table_name}':", e)

    def get_info(self, query: str) -> list:
        try:
            cur = self.conn.cursor()
            cur.execute(query)
            rows = cur.fetchall()
            cur.close()
            return rows
        except sqlite3.OperationalError as e:
            print("query failed: ", e)

    def get_tables(self) -> list:
        cur = self.conn.cursor()
        cur.execute("""SELECT name from sqlite_master WHERE type='table';""")
        rows = cur.fetchall()
        cur.close()
        return rows

    def get_table_info(self, table_name: str) -> list:
        cur = self.conn.cursor()
        cur.execute("""SELECT * from ? LIMIT 5;""", table_name)

        rows = cur.fetchall()
        cur.close()

        return rows

    def table_sql_code(self):
        cur = self.conn.cursor()
        cur.execute("""SELECT sql FROM sqlite_master WHERE type ='table' and name = ?""", self.selected_table)
        query = cur.fetchone()

        return query[0]

    def set_selected_table(self, table_name):
        self.selected_table = table_name

    def get_column_types(self, row: tuple, column_names: tuple) -> str:
        columns = []
        for name, value in zip(column_names, row):
            column_type = self.get_sqlite_type(value)
            columns.append(f"{name} {column_type}")

        return '(' + ', '.join(columns) + ')'

    @staticmethod
    def get_sqlite_type(value) -> str:
        if isinstance(value, int):
            return 'INTEGER'
        elif isinstance(value, float):
            return 'REAL'
        elif isinstance(value, str):
            return 'TEXT'
        else:
            return 'TEXT'
