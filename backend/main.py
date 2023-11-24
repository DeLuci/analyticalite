import pandas as pd
import os
import uvicorn
import io

from fastapi import FastAPI, HTTPException, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from dbrepo.db import Sqlite3Database
from functions import utils, local_llm

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


@app.post("/connect")
async def connect_to_database(request: Request):
    data = await request.json()
    db_name = data["db_name"]
    db_path = f'./databases/{db_name}.db'

    if not os.path.exists(db_path):
        raise HTTPException(status_code=400, detail="Database is not found")

    try:
        db.connect_to_database(db_path)
        return {"message": f"Successfully connected to database: {db_name}"}
    except Exception:
        raise HTTPException(status_code=400, detail="Cannot connect to Database")


@app.post("/close")
def close_database():
    try:
        db.close_db()
        return {"message": "Successfully closed database connection"}
    except Exception:
        raise HTTPException(status_code=400, detail="Could not close database connection.")


@app.post("/new")
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
async def load_file(file: UploadFile = File(...)):
    if db.db is None:
        raise HTTPException(status_code=400, detail="No database connection")

    contents = await file.read()
    file_name = file.filename

    if file_name.endswith('.csv'):
        indentation = utils.get_label_hierarchy(contents, "csv")
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        file_name = file_name.strip(".csv")
    elif file_name.endswith('.xlsx'):
        indentation = utils.get_label_hierarchy(contents, "xlsx")
        df = pd.read_excel(io.BytesIO(contents), sheet_name="Data")
        file_name = file_name.replace(".xlsx", "")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    utils.sanitize_columns(df, indentation)
    utils.add_label_grouping(df)
    df.drop("Indentation", axis=1, inplace=True)
    df.dropna(subset=df.columns[1:], how='all', inplace=True)

    label_column = df['Label'] if 'Label' in df.columns else df['Label (Grouping)']
    labels = [(label,) for label in label_column]
    attributes = [(col,) for col in list(df.columns[1:])]

    structured_data = {}

    for index, row in df.iterrows():
        label = row['Label']
        for attribute in df.columns[1:]:
            key = (label, attribute)
            structured_data[key] = row[attribute]

    try:
        db.eav_schema(file_name)
    except Exception:
        raise HTTPException(status_code=400, detail=f"Table could not be created")

    try:
        db.insert_table_info(file_name, labels, attributes, structured_data)
    except Exception:
        raise HTTPException(status_code=400, detail=f"Table info could not be inserted")

    return {"message", "File loaded successfully"}


@app.post("/drop")
def remove_table(table_name: str):
    if db.db is None:
        raise HTTPException(status_code=400, detail="No database connection")

    try:
        db.drop_table(table_name)
        return {"message": "Successfully dropped table"}
    except Exception:
        raise HTTPException(status_code=400, detail=f"Could not drop table: {table_name}")


@app.get("/tables")
def db_tables():
    if db.db is None:
        raise HTTPException(status_code=400, detail="No database connection")

    try:
        list_of_table_names = db.get_tables()
        return {"tables": list(list_of_table_names)}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=e)


@app.post("/table")
async def selected_table(request: Request):
    if db.db is None:
        raise HTTPException(status_code=400, detail="No database connection")

    data = await request.json()
    table_name = data["table_name"]
    try:
        db.set_selected_table(table_name)
    except Exception:
        raise HTTPException(status_code=400, detail="Table not found")

    try:
        mp = db.attribute_label_code()
    except Exception:
        raise HTTPException(status_code=400, detail="Could not get table info")

    return mp


@app.get("/message")
def receive_message(input: str):
    if db.db is None:
        raise HTTPException(status_code=400, detail="No database connection")

    schema = db.fetch_table_creation_code()
    attribute_label_info = db.attribute_label_code()

    response_query = local_llm.generate_query(input, schema, attribute_label_info)
    print(response_query)
    return {"message": "here"}


@app.get("/databases")
def databases():
    directory = "./databases"

    files = os.listdir(directory)

    if len(files) > 0:
        db_files = [file.replace(".db", "") for file in files if file.endswith(".db")]
        return {"databases": db_files}

    return {"databases": []}


if __name__ == "__main__":
    uvicorn.run("server:app", host="localhost", reload=True, port=8080)
