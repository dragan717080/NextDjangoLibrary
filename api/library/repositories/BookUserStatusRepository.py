from ..models import Book, BookUserStatus, User
from .BaseRepository import BaseRepository
from .BookRepository import BookRepository
from .UserRepository import UserRepository

class BookUserStatusRepository(BaseRepository):
    def __init__(self):
        self.model = BookUserStatus
        self.book_repository = BookRepository()
        self.user_repository = UserRepository()
        self.related = ['book', 'user']

    def create(self, book_id: str, user: str, status: int):
        try:
            book = self.book_repository.get_by_id(book_id)
            user = self.user_repository.get_by_fields({ "username": user})
        except Book.DoesNotExist:
            return "Book does not exist"
        except User.DoesNotExist:
            return "User does not exist"

        book_user_status = BookUserStatus(
            book=book,
            user=user,
            status=status
        )

        book_user_status.save()
        return book_user_status

    def update(self, id: str, book_id: str = None, user: str = None, status: str = None):
        try:
            book_user_status = BookUserStatus.objects.get(pk=id)
        except BookUserStatus.DoesNotExist:
            return None

        if book_id:
            book = self.book_repository.get_by_id(book_id)
            if book == None:
                return "Book was not found"

            book_user_status.book = book

        if user:
            user = self.user_repository.get_by_fields({ "username": user })
            if user == None:
                return "User was not found"

            book_user_status.user = user

        if status:
            book_user_status.status = status

        book_user_status.save()
        return book_user_status
