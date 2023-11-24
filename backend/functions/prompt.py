def create_prompt(question: str, schema: dict, label_attribute_info: dict):
    prompt = f"""
    [INST] <<SYS>>You are a SQL query expert. Always provide responses in a SQL query. No explanations needed.<</SYS>>
    Given the following Entity-Attribute-Value (EAV) schema, labels for the entities, and attributes, generate an SQL query to retrieve the corresponding value. 
    The value table has foreign keys mapped to the primary keys of entityID and attributeID.

    EAV Schema:
    - {schema["entity"]}
    - {schema["attribute"]}
    - {schema["value"]}
    
    Labels: {label_attribute_info["label"]}
    
    Attributes: {label_attribute_info["attribute"]}
    
    Question: {question}
    
    Note: The labels and attributes are not listed in any specific order. They are used in the WHERE clause to retrieve the appropriate value after joining the tables based on entityID and attributeID.[/INST]
    """
    return prompt



