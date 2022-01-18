use std::collections::HashMap;
use serde_json::{json, Value};

pub fn get_unique(fields: Vec<Value>, data: Vec<Value>) -> Value {
    let mut unique_sorted: UniqueSorted = UniqueSorted::new(fields, data);
    unique_sorted.get_value()
}

/// This represents a field, the data type and the data
struct FieldData {
    field: String,
    data_type: String,
    value_count: HashMap<String, i64>
}

impl FieldData {
    pub fn new(field_obj: Value) -> FieldData {
        FieldData {
            field: field_obj["name"].as_str().unwrap().to_string(),
            data_type: field_obj["type"].as_str().unwrap().to_string(),
            value_count: Default::default()
        }
    }

    pub fn process_value(&mut self, value: &Value) {
        let value_str: String = match value {
            Value::Null => "null".to_string(),
            Value::String(_) => value.as_str().unwrap().to_string(),
            _ => value.to_string()
        };

        self.value_count.entry(value_str)
            .and_modify(|count| *count += 1)
            .or_insert(1);
    }

    pub fn get_values(&mut self) -> Vec<Value> {
        let mut result: Vec<Value> = Vec::new();

        for (value, count) in &self.value_count {
            let mut value_obj = Value::Object(Default::default());
            value_obj["count"] = Value::from(count.clone());

            let value_str = value.clone();
            match self.data_type.as_ref() {
                "string" => {
                    value_obj["value"] = Value::from(value_str);
                },
                "duration" => {
                    value_obj["value"] = Value::from(value_str);
                },
                "int" => {
                    let i_value = value_str.parse::<i64>().unwrap();
                    value_obj["value"] = Value::from(i_value);
                }
                "float" => {
                    let f_value = value_str.parse::<f64>().unwrap();
                    value_obj["value"] = Value::from(f_value);
                }
                "boolean" => {
                    let b_value = value_str.parse::<bool>().unwrap();
                    value_obj["value"] = Value::from(b_value);
                }
                _ => {}
            }

            result.push(value_obj);
        }

        return result;
    }
}

/// main class that you interface with to get and set data
struct UniqueSorted {
    fields: HashMap<String, FieldData>
}

impl UniqueSorted {
    pub fn new(fields: Vec<Value>, data: Vec<Value>) -> UniqueSorted {
        let mut result = UniqueSorted {
            fields: UniqueSorted::process_fields(fields)
        };

        result.process_data(data);
        return result;
    }

    pub fn process_fields(fields_collection: Vec<Value>) -> HashMap<String, FieldData>{
        let mut fields: HashMap<String, FieldData> = HashMap::new();

        for field in fields_collection {
            let field = FieldData::new(field);
            fields.insert(field.field.clone(), field);
        }

        fields.insert("null".to_string(), FieldData::new(json!({"name": "null", "type": "string"})));

        fields
    }

    pub fn process_data(&mut self, data: Vec<Value>) {
        for record in data {
            for (field, field_data) in &mut self.fields {
                let value = record.get(field);

                match value {
                    None => {}
                    Some(value_obj) => {
                        field_data.process_value(value_obj);
                    }
                }
            }
        }
    }

    pub fn get_value(&mut self) -> Value {
        let mut result: Value = Value::Object(Default::default());

        for (field, field_data) in &mut self.fields {
            let values: Vec<Value> = field_data.get_values();
            result[field] = Value::from(values);
        }

        return result;
    }
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::get_unique;

    fn get_data() -> Vec<Value> {
        let mut result: Vec<Value> = Vec::new();
        result.push(json!({"id": 0, "code": "A", "value": 10, "isActive": true}));
        result.push(json!({"id": 1, "code": "B", "value": 10, "isActive": false}));
        result.push(json!({"id": 2, "code": "C", "value": 20, "isActive": true}));
        result.push(json!({"id": 3, "code": "D", "value": 20, "isActive": true}));
        result.push(json!({"id": 4, "code": "E", "value": 5, "isActive": false}));
        result
    }

    #[test]
    fn structure_test() {
        let data = get_data();
        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "value", "type": "int"}));
        fields.push(json!({"name": "isActive", "type": "boolean"}));
        fields.push(json!({"name": "code", "type": "string"}));

        let result = get_unique(fields, data);

        println!("{:?}", result);

        assert!(result != Value::Null);
    }
}