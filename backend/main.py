import pandas as pd
import re
import os

import uvicorn
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dbrepo.db import Sqlite3Database
from functions.tidy import tidy_df, sanitize_columns

# Initiating App
app = FastAPI()
db = Sqlite3Database()

# CORS - Origins
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:4174",
    "http://localhost:4173",
    "http://localhost:3000",
]

# CORS - Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/connect-db")
def connect_to_database(db_name: str):
    db_path = f'./databases/{db_name}.db'

    if not os.path.exists(db_path):
        raise HTTPException(status_code=400, detail="Database is not found")

    try:
        db.connect_to_database(db_path)
        return {"message": f"Successfully connected to database: {db_name}"}
    except Exception:
        raise HTTPException(status_code=400, detail="Cannot connect to Database")


@app.post("/close-db")
def close_database():
    try:
        db.close_connection()
        return {"message": "Successfully closed database connection"}
    except Exception:
        raise HTTPException(status_code=400, detail="Could not close database connection.")


@app.post("/new-db")
def new_database(db_name: str):
    db_path = f'./databases/{db_name}.db'

    if os.path.exists(db_path):
        raise HTTPException(status_code=400, detail="Database already exits")

    try:
        with open(db_path, 'w'):
            pass
        os.chmod(db_path, 0o666)
        return {"message": "Database was successfully created!"}
    except Exception:
        raise HTTPException(status_code=400, detail="Database could not be created")


@app.post("/load")
def load_file(file_path: str, file_name: str):
    if db.conn is None:
        raise HTTPException(status_code=400, detail="No database connection")

    if file_path.endswith('.csv') or file_path.endswith('.txt'):
        df = pd.read_csv(file_path)
    elif file_path.endswith('.xlsx'):
        df = pd.read_excel(file_path)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    # df = tidy_df(df)
    sanitize_columns(df)

    data = [tuple(row) for row in df.to_records(index=False)]
    columns_names = tuple(df.columns)

    try:
        db.create_table(data[0], columns_names, file_name)
    except Exception:
        raise HTTPException(status_code=400, detail=f"Table could not be created")

    try:
        db.insert_table_info(file_name, data)
    except Exception:
        raise HTTPException(status_code=400, detail=f"Table info could not be inserted")

    return {"message", "File loaded successfully"}


@app.post("/drop-tb")
def remove_table(table_name: str):
    if db.conn is None:
        raise HTTPException(status_code=400, detail="No database connection")

    try:
        db.drop_table(table_name)
        return {"message": "Successfully dropped table"}
    except Exception:
        raise HTTPException(status_code=400, detail=f"Could not drop table: {table_name}")


@app.get("/tables")
def db_tables():
    if db.conn is None:
        raise HTTPException(status_code=400, detail="No database connection")

    try:
        list_of_table_names = db.get_tables()
        return {"tables": list_of_table_names}
    except Exception:
        raise HTTPException(status_code=400, detail="")


@app.post("/selected-table")
def selected_table(table_name: str):
    if db.conn is None:
        raise HTTPException(status_code=400, detail="No database connection")
    try:
        db.set_selected_table(table_name)
        return {"message": "Successfully selected table"}
    except Exception:
        raise HTTPException(status_code=400, detail="Table not found")


# @app.get("/receive-message")
# async def receive_message(message: str, table_name: str = Depends(db.table_sql_code())):
#     query = llm_query(message, table_name)
#     try:
#         answer = db.get_info(query)
#         return {"message", answer}
#     except Exception as e:
#         return {}


if __name__ == "__main__":
    uvicorn.run("server:app", host="localhost", reload=True, port=8080)
