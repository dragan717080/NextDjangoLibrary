from ..models import User
from .BaseRepository import BaseRepository
from django.http import JsonResponse
from django.core.files.uploadedfile import InMemoryUploadedFile

class UserRepository(BaseRepository):
    def __init__(self):
        self.model = User

    def get_all(self, req):
        query_args = {key: value for key, value in req.GET.items()}
        # The list slice is equivalent to 'LIMIT' SQL clause
        return self.model.objects.all().filter(**query_args).order_by('-created_at')[:9]

    def create(
            self,
            username: str,
            email: str,
            loaned_books_count: int,
            password_hash: str = None,
            avatar: InMemoryUploadedFile = None,
            avatar_url: str = None,
        ):
        user = User(
            username=username,
            email=email,
            loaned_books_count=loaned_books_count,
        )

        if password_hash is not None:
            user.password_hash = password_hash

        if avatar is not None:
            user.avatar = avatar

        if avatar_url is not None:
            user.avatar_url = avatar_url

        try:
            user.save()
            return user
        except Exception as e:
            return f"Error creating user: {e}"

    def update(self, id: str, username: str, email: str, password_hash: str, loaned_books_count: int):
        try:
            user = User.objects.get(pk=id)
        except User.DoesNotExist:
            return None

        if username:
            user.username = username

        if email:
            user.email = email

        if password_hash:
            user.password_hash = password_hash

        # Sometimes can be null and it is treated as falsy value
        if loaned_books_count is not None:
            user.loaned_books_count = loaned_books_count

        user.save()
        return user
