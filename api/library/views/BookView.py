from .BaseView import BaseView
from ..repositories.BookRepository import BookRepository
from ..repositories.BookUserStatusRepository import BookUserStatusRepository
from ..repositories.ReviewRepository import ReviewRepository
from ..HttpUtils import HttpUtils
from django.http import JsonResponse
from django.core.handlers.wsgi import WSGIRequest

class BookView(BaseView):
    def __init__(self, http_method_names):
        self.model_repository = self.book_repository = BookRepository()
        self.book_user_status_repository = BookUserStatusRepository()
        self.review_repository = ReviewRepository()
        super().__init__()

    def get_by_id(self, id: str, request: WSGIRequest):
        """
        Also return how many users have book in their statuses.\n
        If username is provided, also return his status for that book\n
        e.g. 'To Read', 'Reading', 'Read'
        """
        book = self.book_repository.get_by_id(id)

        if not book:
            return JsonResponse(status=404, data={ "message": "Book does not exist" })

        if 'username' not in request.GET.keys():
            return super().get_by_id(id)

        username = request.GET['username']

        status_for_user = self.book_user_status_repository.get_by_fields({ "book_id": id, "user": username })

        review_for_user = self.review_repository.get_by_fields({ "book_id": id, "user": username })

        review_dict = {
            "book": self.book_repository.get_by_id(id).to_dict(),
            "status": status_for_user.status if status_for_user else "Select status",
            "review": {
                "id": review_for_user.id,
                "rating": review_for_user.rating,
                "content": review_for_user.content
            } if review_for_user else {},
        }

        return JsonResponse(review_dict)

    def post(self, request):
        return HttpUtils.get_post_data(
            request,
            id,
            ["genre", "author", "title", "description", "image_url"],
            self.book_repository,
        )

    def patch(self, request, id):
        return HttpUtils.get_patch_data(
            request,
            id,
            ["genre", "author", "title", "description", "image_url", "total_copies", "available_copies"],
            self.book_repository
        )
