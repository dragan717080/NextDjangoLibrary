from .BaseView import BaseView
from ..repositories.GenreRepository import GenreRepository
from ..HttpUtils import HttpUtils
from django.http import JsonResponse

class GenreView(BaseView):
    def __init__(self, http_method_names):
        self.model_repository = self.genre_repository = GenreRepository()
        super().__init__()

    def post(self, request):
        return HttpUtils.get_post_data(
            request,
            id,
            ["name"], 
            self.genre_repository
        )

    def patch(self, request, id):
        return HttpUtils.get_patch_data(
            request,
            id,
            ["name"],
            self.genre_repository
        )
