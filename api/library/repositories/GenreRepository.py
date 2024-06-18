from ..models import BookGenre, Genre
from .BaseRepository import BaseRepository
from ..databases.database_postgres import DatabasePostgres
from django.db.models import Count, Prefetch

class GenreRepository(BaseRepository):
    def __init__(self):
        self.model = Genre
        self.db = DatabasePostgres()
        self.many_related = [
            Prefetch('bookgenre_set', queryset=BookGenre.objects.select_related('book'))
        ]

    def get_all(self, req):
        query_args = {key: value for key, value in req.GET.items()}
        
        limit = None
        if 'limit' in query_args:
            limit = int(query_args.pop('limit'))

        sort_by = '-created_at'
        if 'sort_by' in query_args:
            sort_by = query_args.pop('sort_by')

        genres = (self.model.objects
                  .annotate(book_count=Count('bookgenre__book'))
                  .filter(**query_args)
                  .order_by(sort_by))

        if limit:
            genres = genres[:limit]

        sorted_genres = sorted(genres, key=lambda x: x.book_count, reverse=True)

        return sorted_genres

    def create(self, name: str):
        genre = Genre(
            name=name,
        )

        genre.save()
        return genre

    def update(self, id: str, name: str):
        try:
            genre = Genre.objects.get(pk=id)
        except Genre.DoesNotExist:
            return None

        if name:
            genre.name = name

        genre.save()
        return genre
