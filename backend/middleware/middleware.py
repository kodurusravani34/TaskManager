from functools import wraps
from flask import request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models import User
from utils.api_error import ApiError


def authenticate(f):
    """Middleware to verify JWT token and attach user to request."""

    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user:
                raise ApiError.unauthorized("User not found")
            request.current_user = user
        except ApiError:
            raise
        except Exception:
            raise ApiError.unauthorized("Invalid or expired token")
        return f(*args, **kwargs)

    return decorated


def authorize(*roles):
    """Middleware to check user role."""

    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = getattr(request, "current_user", None)
            if not user:
                raise ApiError.unauthorized()
            if user.role not in roles:
                raise ApiError.forbidden(
                    "You do not have permission to perform this action"
                )
            return f(*args, **kwargs)

        return decorated

    return decorator


def validate_json(schema_fields):
    """Simple JSON body validation middleware.
    schema_fields: dict of {field_name: {required, type, min_length, max_length, enum, nullable}}
    """

    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            data = request.get_json(silent=True) or {}
            errors = []

            for field, rules in schema_fields.items():
                value = data.get(field)
                required = rules.get("required", False)
                nullable = rules.get("nullable", False)
                field_type = rules.get("type", str)
                min_len = rules.get("min_length")
                max_len = rules.get("max_length")
                enum_vals = rules.get("enum")

                if required and (value is None or value == ""):
                    errors.append({"field": field, "message": f"{field} is required"})
                    continue

                if value is None:
                    if nullable:
                        continue
                    if not required:
                        continue

                if value is not None and value != "":
                    if field_type == str and not isinstance(value, str):
                        errors.append(
                            {"field": field, "message": f"{field} must be a string"}
                        )
                        continue

                    if isinstance(value, str):
                        if min_len and len(value) < min_len:
                            errors.append(
                                {
                                    "field": field,
                                    "message": f"{field} must be at least {min_len} characters",
                                }
                            )
                        if max_len and len(value) > max_len:
                            errors.append(
                                {
                                    "field": field,
                                    "message": f"{field} must be at most {max_len} characters",
                                }
                            )

                    if enum_vals and value not in enum_vals:
                        errors.append(
                            {
                                "field": field,
                                "message": f"{field} must be one of: {', '.join(enum_vals)}",
                            }
                        )

            if errors:
                return {
                    "success": False,
                    "message": "Validation failed",
                    "errors": errors,
                }, 400

            request.validated_data = data
            return f(*args, **kwargs)

        return decorated

    return decorator
