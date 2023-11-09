import pandas as pd


def tidy_excel(file_path: str):
    pass


def tidy_df(df: pd.DataFrame) -> pd.DataFrame:
    if check_header(df):
        df.rename(columns=df.iloc[0], inplace=True)
        df.drop(df.index[0], inplace=True)
    return df


def check_header(df: pd.DataFrame) -> bool:
    for col_name in df:
        if col_name.find("Unnamed"):
            return True

    return False


def percent_to_float(percent: str):
    return float(percent.strip('%')) / 100


def sanitize_columns(df):
    df.columns = df.columns.str.replace(' ', '_')
    df.columns = df.columns.str.replace(r'^(\d+)', r'num_\1', regex=True)
    df.columns = df.columns.str.replace(r'[^a-zA-Z0-9_]', '', regex=True)

