from abc import ABC
from django.http import HttpRequest, JsonResponse
from typing import List, Dict, Any

class HttpUtils(ABC):
    """
    It takes params for patch request and repository and calls
    the corresponding update method
    
    Equivalent of this function in view

        def patch(self, request, id):
        enrollment_obj = {
            "course_id": request.data.get("course_id"),
            "student_id": request.data.get("student_id"),
        }

        try:
            enrollment = self.enrollment_repository.update(id, **enrollment_obj)
            return JsonResponse(enrollment) if enrollment else JsonResponse(status=404, data={"message": f"Enrollment does not exist"})
        except Exception as e:
            return JsonResponse(status=400, data={"message": f"Error updating Enrollment: {e}"})

    Args:
        request(Request):
            request object to get params from
        id(string|int):
            id of model instance to be updated
        arg_list(list): 
            list of request body inputs to go into model object
        repository(Repository):
            corresponding repository which will have its update method called

    Returns:
        JsonResponse: status 200, 400 or 404 depending of what repository returns
    """
    @staticmethod
    def get_patch_data(request: HttpRequest, id: str, arg_list: List, repository) -> JsonResponse:
        model_obj = { param: request.data.get(param) for param in arg_list }
        model_name = repository.__class__.__name__.split("Repository")[0]

        try:
            model = repository.update(id, **model_obj)
            # Given id does not exist
            if isinstance(model, str):
                return JsonResponse(status=404, data={"message": model})
            return JsonResponse(model.to_dict()) if model else JsonResponse(status=404, data={"message": f"{model_name} does not exist"})
        except Exception as e:
            return JsonResponse(status=400, data={"message": f"Error updating {model_name.lower()}: {e}"})

    """
    Same as patch but also takes additional param optional_arg_list which is list of dict
    in format { param: default_value } so if request body doesn't have that key,
    it will fallback to default value
    """
    @staticmethod
    def get_post_data(
        request: HttpRequest,
        id: str,
        arg_list: List,
        repository,
        optional_arg_list: List[Dict[str, Any]] = [],
    ) -> JsonResponse:
        model_name = repository.__class__.__name__.split("Repository")[0]
        try:
            model_obj = { param: request.data.get(param) for param in arg_list }
        except Exception as e:
            return JsonResponse(status=400, data={"message": f"Missing key: {e}"})
        """
        Update model object with optional params
        Expected format is { param: default_value } e.g. { "status": "student" }
        """
        for optional_arg_dict in optional_arg_list:
            for optional_param, default_value in optional_arg_dict.items():
                model_obj.update({
                    optional_param: request.data.get(optional_param) if request.data.get(optional_param) is not None else default_value
                })

        try:
            model = repository.create(**model_obj)
            # Given id does not exist
            if isinstance(model, str):
                return JsonResponse(status=404, data={"message": model})

            return JsonResponse(status=201, data=model.to_dict())
        except Exception as e:
            return JsonResponse(status=400, data={"message": f"Error creating {model_name.lower()}: {e}"})
