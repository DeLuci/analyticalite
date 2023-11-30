def create_sql_prompt(question: str, schema: dict, label_attribute_info: dict):
    prompt = f"""
                Generate SQL queries based on provided Entity-Attribute-Value (EAV) schema details, labels, and attributes. Use these details to construct queries that answer specific questions.

                Example 1:
                EAV schema: 'CREATE TABLE IF NOT EXISTS financial_entity (entityID INTEGER PRIMARY KEY, label TEXT)', 'CREATE TABLE IF NOT EXISTS theme_attribute (attributeID INTEGER PRIMARY KEY, attribute TEXT)', 'CREATE TABLE IF NOT EXISTS financial_value (entityID INTEGER, attributeID INTEGER, value TEXT, FOREIGN KEY (entityID) REFERENCES financial_entity(entityID), FOREIGN KEY (attributeID) REFERENCES financial_attribute(attributeID))'
                Labels: "['Income Transactions', 'Expense Transactions', 'Credit Transactions', 'Debit Transactions']"
                Attributes: "['Transaction Amount', 'Transaction Type', 'Transaction Date', 'Account Balance']"
                Question: 'Retrieve the transaction amount for expense transactions.'
                SQL Query: "SELECT financial_value.value FROM financial_value INNER JOIN financial_entity ON financial_value.entityID = financial_entity.entityID INNER JOIN financial_attribute ON financial_value.attributeID = financial_attribute.attributeID WHERE financial_entity.label = 'Expense Transactions' AND financial_attribute.attribute = 'Transaction Amount'"

                Example 2
                EAV schema: 'CREATE TABLE IF NOT EXISTS theme_entity (entityID INTEGER PRIMARY KEY, label TEXT)', 'CREATE TABLE IF NOT EXISTS theme_attribute (attributeID INTEGER PRIMARY KEY, attribute TEXT)', 'CREATE TABLE IF NOT EXISTS theme_value (entityID INTEGER, attributeID INTEGER, value TEXT, FOREIGN KEY (entityID) REFERENCES theme_entity(entityID), FOREIGN KEY (attributeID) REFERENCES theme_attribute(attributeID))'
                Labels: "['Climate Zones', 'Urban Areas', 'Renewable Energy Sources', 'Healthcare Facilities', 'Retail Locations']"
                Attributes: "['Temperature Range', 'Population Density', 'Carbon Emissions', 'Healthcare Expenditure', 'Sales Revenue']"
                Question: 'Calculate the Total Healthcare Expenditure in Healthcare Facilities across different Climate Zones.'
                SQL Query: "SELECT SUM(CAST(v.value AS INT)) AS TotalHealthcareExpenditure FROM theme_value v JOIN theme_attribute a ON v.attributeID = a.attributeID JOIN theme_entity e ON v.entityID = e.entityID WHERE e.label = 'Healthcare Facilities' AND a.attribute = 'Healthcare Expenditure' GROUP BY e.label"

               Now, generate a SQL query for the following scenario:
               EAV Schema: {schema["entity"]}, {schema["attribute"]}, {schema["value"]}
               Labels: "{label_attribute_info["label"]}"
               Attributes: "{label_attribute_info["attribute"]}"
               Question: {question}
               """
    return prompt