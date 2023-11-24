from llama_cpp import Llama
from .prompt import create_prompt


def generate_query(message: str, schema: dict, label_attribute_info: dict):
    model = Llama("/Users/lucianoarroyo/Github/analyticalite/backend/models/llama-2-7b-chat.Q5_K_M.gguf", n_gpu_layers=32, n_ctx=3000)

    response = model(max_tokens=300, temperature=0.6,
                     prompt=create_prompt(message, schema, label_attribute_info), top_p=0.9)

    return response["choices"][0]["text"].strip()
