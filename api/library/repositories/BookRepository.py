from ..models import Book, BookGenre
from .BaseRepository import BaseRepository
from .GenreRepository import GenreRepository
from .AuthorRepository import AuthorRepository
import random
from django.db.models import Prefetch

class BookRepository(BaseRepository):
    def __init__(self):
        self.model = Book
        self.genre_repository = GenreRepository()
        self.author_repository = AuthorRepository()
        self.related = ['author']
        self.many_related = [
            Prefetch('bookgenre_set', queryset=BookGenre.objects.select_related('genre'))
        ]

    def create(
        self,
        genre: str,
        author: str,
        title: str,
        description: str,
        image_url: str,
    ):
        total_copies = random.randint(1, 10)
        genre = self.genre_repository.get_by_fields({ "name": genre })
        if not genre:
           return "Genre was not found"

        author = self.author_repository.get_by_fields({ "name": author })
        if not author:
           return "Author was not found"

        genre = Book(
            genre=genre,
            author=author,
            title=title,
            description=description,
            image_url=image_url,
            total_copies=total_copies,
            available_copies=total_copies,
        )

        genre.save()
        return genre

    def update(
        self,
        id: str,
        genre: str = None,
        author: str = None,
        title: str = None,
        description: str = None,
        image_url: str = None,
        total_copies: str = None,
        available_copies: str = None,
        rating: float = None,
        total_votes: int = None,
    ):
        try:
            book = Book.objects.get(pk=id)
        except Book.DoesNotExist:
            return None

        if genre:
            book_genre = self.genre_repository.get_by_fields({ "name": genre })
            if book_genre == None:
                return "Genre was not found"

            book.genre = book_genre

        if author:
            book_author = self.author_repository.get_by_fields({ "name": author })
            if book_author == None:
                return "Author was not found"

            book.author = book_author

        if title:
            book.title = title

        if description:
            book.description = description

        if image_url:
            book.image_url = image_url

        if total_copies:
            book.total_copies = total_copies

        if available_copies:
            book.available_copies = available_copies

        if rating:
            book.rating = rating

        if total_votes:
            book.total_votes = total_votes

        book.save()
        return book
