from .BaseView import BaseView
from ..repositories.BookUserStatusRepository import BookUserStatusRepository
from ..HttpUtils import HttpUtils

class BookUserStatusView(BaseView):
    def __init__(self, http_method_names):
        self.model_repository = self.book_user_status_repository = BookUserStatusRepository()
        super().__init__()

    def post(self, request):
        return HttpUtils.get_post_data(
            request,
            id,
            ["book_id", "user", "status"],
            self.book_user_status_repository,
        )

    def patch(self, request, id):
        return HttpUtils.get_patch_data(
            request,
            id,
            ["book_id", "user", "status"],
            self.book_user_status_repository
        )
