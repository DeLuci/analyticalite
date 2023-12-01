from llama_cpp import Llama
from .prompt import create_sql_prompt
import re
import os


class LlamaModel:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LlamaModel, cls).__new__(cls)
            dir_of_script = os.path.dirname(os.path.abspath("../"))
            cls._instance.model = Llama(dir_of_script+"/analyticalite/backend/models/llama-2-7b-chat.Q8_0.gguf", n_gpu_layers=-1,
                                        n_ctx=3000)
        return cls._instance.model


def get_query(input_string: str):
    pattern = r"(?i)SELECT[\s\S]+?FROM[\s\S]+?;"

    # Use re.findall to find all matches of the pattern in the input string
    matches = re.findall(pattern, input_string)
    sql_query = ""
    if matches:
        sql_query = matches[0]
    else:
        print(input_string)
    return sql_query


def generate_query(message: str, schema: dict, label_attribute_info: dict) -> str:
    model = LlamaModel()
    prompt = create_sql_prompt(message, schema, label_attribute_info)
    response = model.create_chat_completion(max_tokens=360, temperature=0.6, top_p=0.9,
                                            messages=[{"role": "system",
                                                       "content": "You are a SQL query expert. Always provide "
                                                                  "responses in a SQL query with semi-colon at end. No explanation needed."},
                                                      {"role": "user", "content": prompt}]
                                            )

    query = get_query(response["choices"][0]['message']['content'].strip())
    return query


def generate_interpretation(question, result, error, query):
    model = LlamaModel()
    if error:
        prompt = f"Explain the following SQL error in simple terms: {error}\nSQL Query: {query}, Please make it short."
        response = model.create_chat_completion(max_tokens=500, temperature=0.6, top_p=0.9,
                                                messages=[{"role": "system",
                                                           "content": "You are an expert at explaining errors. Always "
                                                                      "provide short and clear responses."},
                                                          {"role": "user", "content": prompt}]
                                                )

        return response["choices"][0]['message']['content'].strip()

    elif result is None or len(result) == 0:
        prompt = (f"The following SQL query executed successfully but returned no results. Why might this be the "
                  f"case?\nSQL Query: {query}. Please make it short.")
        response = model.create_chat_completion(max_tokens=500, temperature=0.6, top_p=0.9,
                                                messages=[{"role": "user", "content": prompt}])

        return response["choices"][0]['message']['content'].strip()

    prompt = f"Based on the following data, answer the question: '{question}'\nData: {result}, Please make it short."
    response = model.create_chat_completion(max_tokens=500, temperature=0.6, top_p=0.9,
                                            messages=[{"role": "system",
                                                       "content": "You're an AI assistant who can interpret anything."},
                                                      {"role": "user", "content": prompt}]
                                            )

    return response["choices"][0]['message']['content'].strip()