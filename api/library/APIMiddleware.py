from django.http import JsonResponse
from django.core.handlers.wsgi import WSGIRequest
import re
import json

class APIMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Email validation for users route, also matches /users/{id}
        if request.path.startswith('/users') and request.method in ['POST', 'PATCH']:
            # If it didn't pass email validation, return an error
            email_response = self.validate_email(request)
            if email_response:
                return email_response
        # Passing request to the next view
        response = self.get_response(request)

        return response

    def validate_email(self, request: WSGIRequest) -> None|JsonResponse:
        # In create email field is required
        params = json.loads(request.body)
        email = params.get('email')

        if not self.match_email_value(email):
            return JsonResponse(status=400, data={ "message": "Invalid email" })
        return None

    def match_email_value(self, email: str) -> bool:
        # For update email is optional
        if email is None:
            return True
        email_pattern = r"""(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|\\[\x01-\x08\x0B\x0C\x0E-\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0B\x0C\x0E-\x7F\x21-\x5A\x53-\x7F]|\\[\x01-\x08\x0B\x0C\x0E-\x7F])+)\])"""

        # In re.match cannot simply return match value e.g. this will not work: return re.match(pattern, value)
        return True if re.match(email_pattern, email) else False
