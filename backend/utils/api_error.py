class ApiError(Exception):
    def __init__(self, status_code, message):
        super().__init__(message)
        self.status_code = status_code
        self.message = message

    @staticmethod
    def bad_request(message):
        return ApiError(400, message)

    @staticmethod
    def unauthorized(message="Unauthorized"):
        return ApiError(401, message)

    @staticmethod
    def forbidden(message="Forbidden"):
        return ApiError(403, message)

    @staticmethod
    def not_found(message="Resource not found"):
        return ApiError(404, message)

    @staticmethod
    def conflict(message):
        return ApiError(409, message)

    @staticmethod
    def internal(message="Internal server error"):
        return ApiError(500, message)
