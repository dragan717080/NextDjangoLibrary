from django.db.models import *
from uuid import uuid4
from django.core.validators import MaxValueValidator

class BaseModel(Model):
    id = UUIDField(
        primary_key = True, 
        default = uuid4, 
        editable = False
    )

    class Meta:
        abstract = True

    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

class Genre(BaseModel):
    name = CharField(max_length=70, unique=True)
    # Lowercase e.g. 'Combined Print Fiction' -> 'combined-print-fiction'
    name_encoded = CharField(max_length=70, unique=True)
    description = TextField()

    class Meta:
        db_table = 'genres'

        indexes = [
            Index(fields=['name'], name='idx_genre_name')
        ]

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'book_count': getattr(self, 'book_count', 0),  # Use getattr to handle the dynamic attribute
        }

class Author(BaseModel):
    name = CharField(max_length=70, unique=True)

    class Meta:
        db_table = 'authors'

        indexes = [
            Index(fields=['name'], name='idx_author_name')
        ]

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }

class Book(BaseModel):
    author = ForeignKey(Author, to_field='name', on_delete=CASCADE, db_column='author')
    title = CharField(max_length=200)
    description = TextField()
    image_url = CharField(max_length=200)
    rating = DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_votes = IntegerField(default=0)
    first_published = IntegerField()

    # Additional fields
    total_copies = IntegerField(default=1)
    available_copies = IntegerField(default=1)

    class Meta:
        db_table = 'books'
        # Ensure unique combination of author and title
        constraints = [
            UniqueConstraint(fields=['author', 'title'], name='unique_author_title')
        ]

    def get_genres(self):
        genre_query = Genre.objects.filter(bookgenre__book=self)
        return [genre.name for genre in genre_query]

    def to_dict(self):
        genres = [bg.genre.name for bg in self.bookgenre_set.all()]

        return {
            'id': self.id,
            'author': self.author.name,
            'genres': genres,
            'title': self.title,
            'description': self.description,
            'image_url': self.image_url,
            'total_copies': self.total_copies,
            'available_copies': self.available_copies,
            'rating': self.rating,
            'total_votes': self.total_votes,
        }

# Many to many table between book and genre
class BookGenre(Model):
    id = UUIDField(
        primary_key = True, 
        default = uuid4, 
        editable = False
    )
    book = ForeignKey(Book, on_delete=CASCADE)
    genre = ForeignKey(Genre, db_column='genre', to_field='name', on_delete=CASCADE)

    class Meta:
        db_table = 'books_genres'
        # Ensure unique combination of book and genre
        constraints = [
            UniqueConstraint(fields=['book', 'genre'], name='unique_book_genre')
        ]

    def to_dict(self):
        return {
            'id': self.id,
            'book_id': self.book,
            'genre': self.genre,
        }

class User(BaseModel):
    """
    IMPORTANT: columns referencing user must not be named 'user' because
    it's a reserved keyword, they must be named either 'user_id' or 'username'
    (if using username)
    """
    username = CharField(max_length=20, unique=True)
    email = EmailField(max_length=30, unique=True)
    password_hash = TextField()
    avatar = BinaryField(null=True)
    avatar_url = CharField(max_length=200, null=True)
    loaned_books_count = IntegerField(validators=[MaxValueValidator(3)])

    class Meta:
        db_table = 'users'

        indexes = [
            Index(fields=['username'], name='idx_user_username')
        ]

    def __str__(self):
        return self.username

    def to_dict(self):
        return {
            'username': self.username,
            'email': self.email,
            'loaned_books_count': self.loaned_books_count,
            'password_hash': self.password_hash,
            # Uncomment if need to expose full decoded avatar
            #'avatar': b64encode(self.avatar).decode('utf-8') if self.avatar else None,
            'avatar_url': self.avatar_url,
        }

class BookUserStatus(BaseModel):
    user = ForeignKey(User, db_column='username', to_field='username', on_delete=CASCADE)
    book = ForeignKey(Book, on_delete=CASCADE)

    statuses = [
        ('VALUE1', 'To Read'),
        ('VALUE2', 'Reading'),
        ('VALUE3', 'Read'),
    ]

    status = CharField(max_length=200, choices=statuses, default='To Read')

    class Meta:
        db_table = 'statuses'

        constraints = [
            UniqueConstraint(fields=['user', 'book'], name='unique_user_book_status')
        ]

    def to_dict(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "book": self.book.title,
            "status": self.status,
        }

class Review(BaseModel):
    user = ForeignKey(User, db_column='username', to_field='username', on_delete=CASCADE)
    book = ForeignKey(Book, on_delete=CASCADE)
    rating = IntegerField(validators=[MaxValueValidator(5)])
    content = TextField(null=True)

    class Meta:
        db_table = 'reviews'

        constraints = [
            UniqueConstraint(fields=['user', 'book'], name='unique_user_book_review')
        ]

    def to_dict(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "book": self.book.title,
            "rating": self.rating,
            "content": self.content,
        }
