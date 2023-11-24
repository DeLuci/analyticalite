from abc import abstractmethod

import pandas as pd


class Repository:
    @abstractmethod
    def eav_schema(self, table_name: str):
        raise NotImplementedError

    @abstractmethod
    def insert_table_info(self, table_name: str,  labels: list, attributes: list, values: list):
        raise NotImplementedError

    @abstractmethod
    def drop_table(self, table_name: str):
        raise NotImplementedError

    @abstractmethod
    def get_table_info(self, table_name: str) -> pd.DataFrame:
        raise NotImplementedError

    @abstractmethod
    def update(self, query):
        raise NotImplementedError

    def get_info(self, query: str) -> list:
        raise NotImplementedError

    def get_tables(self) -> list:
        raise NotImplementedError

    @abstractmethod
    def delete(self, query):
        raise NotImplementedError


