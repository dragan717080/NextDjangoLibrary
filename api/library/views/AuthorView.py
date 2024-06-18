from .BaseView import BaseView
from ..repositories.AuthorRepository import AuthorRepository
from ..HttpUtils import HttpUtils

class AuthorView(BaseView):
    def __init__(self, http_method_names):
        self.model_repository = self.author_repository = AuthorRepository()
        super().__init__()

    def post(self, request):
        return HttpUtils.get_post_data(
            request,
            id,
            ["name"], 
            self.author_repository
        )

    def patch(self, request, id):
        return HttpUtils.get_patch_data(
            request,
            id,
            ["name"],
            self.author_repository
        )
