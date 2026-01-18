def validate_json(data, required_fields):

    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return {
            "error": "Missing required fields",
            "missing_fields": missing_fields
        }, 400
