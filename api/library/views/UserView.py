from .BaseView import BaseView
from ..repositories.UserRepository import UserRepository
from ..repositories.BookRepository import BookRepository
from ..repositories.BookUserStatusRepository import BookUserStatusRepository
from ..HttpUtils import HttpUtils
from django.http import JsonResponse
from .UserForm import UserForm
from base64 import b64encode
from ..models import User
from ..Utils import Utils

class UserView(BaseView):
    def __init__(self, http_method_names):
        self.model_repository = self.user_repository = UserRepository()
        self.book_repository = BookRepository()
        self.book_user_status_repository = BookUserStatusRepository()
        super().__init__()

    def __get_books_for_user(self, username: str):
        # Resolve book from book id
        def get_book_from_status(book: str, status: int):
            return {
                "title": book.title,
                "author": book.author.name,
                "image_url": book.image_url,
                "status": status
            }

        book_user_statuses = self.book_user_status_repository.get_list_by_fields({ "user": username })

        books_for_users = [get_book_from_status(status.book, status.status) if book_user_statuses else None for status in book_user_statuses]

        return [book for book in books_for_users if book]

    def get_all(self, request):
        # Handle the case if model has no 'created_at' attribute
        all_models = self.model_repository.get_all(request)

        return JsonResponse([
            { 
                **model.to_dict(),
                # Get the books that user has read
                "books": self.__get_books_for_user(model.username)
            } 
            for model in all_models], safe=False)

    def handle_avatar_upload(self, request):
        user_form = UserForm(request.POST, request.FILES)
        if user_form.is_valid():
            user_dict = user_form.__dict__['cleaned_data']

            try:
                avatar_url = Utils.save_avatar(
                user_dict['avatar'],
            )
            except Exception as e:
                return JsonResponse({ "message": "There was an error uploading avatar"}, status=500)

            user = self.model_repository.create(
                user_dict['username'],
                user_dict['email'],
                0,
                user_dict['password_hash'],
                b64encode(user_dict['avatar'].read()),
                avatar_url,
            )

            if not isinstance(user, User):
                return JsonResponse({ "message": user }, status=400)

            return JsonResponse(user.to_dict(), status=201)

        else:
            return JsonResponse({ "message": "Form fields are not valid" }, status=400)

    def handle_post_with_social_providers(self, request):
        return HttpUtils.get_post_data(
            request,
            id,
            ["username", "email", "password_hash", "avatar_url"], 
            self.user_repository,
            [
                { "loaned_books_count": 0 }
            ]
        )

    def post(self, request):
        # Differ from creating user via social providers
        is_socials = not request.META.get('CONTENT_TYPE').startswith('multipart/form-data')

        if is_socials:
            return self.handle_post_with_social_providers(request)

        # Avatar is a FileField
        avatar = "avatar" in request.FILES.keys()
        if avatar:
            return self.handle_avatar_upload(request)
        user_form = UserForm(request.POST)

        if user_form.is_valid():
            user_dict = user_form.__dict__['cleaned_data']
        else:
            return JsonResponse({ "message": "Form fields are not valid" }, status=400)

        user = self.model_repository.create(
            user_dict['username'],
            user_dict['email'],
            0,
            user_dict['password_hash'],
            user_dict['avatar_url'] if 'avatar_url' in user_dict else None
        )

        if not isinstance(user, User):
            return JsonResponse({ "message": user }, status=400)

        return JsonResponse(user.to_dict(), status=201)

    def patch(self, request, id):
        return HttpUtils.get_patch_data(
            request,
            id,
            ["username", "email", "password_hash", "loaned_books_count"],
            self.user_repository
        )
