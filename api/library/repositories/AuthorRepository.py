from ..models import Author
from .BaseRepository import BaseRepository

class AuthorRepository(BaseRepository):
    def __init__(self):
        self.model = Author

    def create(self, name: str):
        author = Author(
            name=name,
        )

        author.save()
        return author

    def update(self, id: str, name: str):
        try:
            author = Author.objects.get(pk=id)
        except Author.DoesNotExist:
            return None

        if name:
            author.name = name

        author.save()
        return author
