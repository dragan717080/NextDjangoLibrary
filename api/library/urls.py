from django.urls import path

from .views.GenreView import GenreView
from .views.AuthorView import AuthorView
from .views.BookView import BookView
from .views.UserView import UserView
from .views.ReviewView import ReviewView
from .views.BookUserStatusView import BookUserStatusView
from .views.SearchView import SearchView

urlpatterns = [
    path('authors', AuthorView.as_view(http_method_names=['get', 'post']), name='author_base'),
    path('authors/<str:id>', AuthorView.as_view(http_method_names=['get', 'patch', 'delete']), name='author_by_id'),
    path('genres/top', GenreView.as_view(http_method_names=['get']), name='top_genre'),
    path('genres', GenreView.as_view(http_method_names=['get', 'post']), name='genre_base'),
    path('genres/<str:id>', GenreView.as_view(http_method_names=['get', 'patch', 'delete']), name='genre_by_id'),
    path('books', BookView.as_view(http_method_names=['get', 'post']), name='book_base'),
    path('books/<str:id>', BookView.as_view(http_method_names=['get', 'patch', 'delete']), name='book_by_id'),
    path('users', UserView.as_view(http_method_names=['get', 'post']), name='user_base'),
    path('users/<str:id>', UserView.as_view(http_method_names=['get', 'patch', 'delete']), name='user_by_id'),
    path('search', SearchView.as_view(http_method_names=['get']), name='search'),
    path('book_user_statuses', BookUserStatusView.as_view(http_method_names=['get', 'post']), name='book_user_status_base'),
    path('book_user_statuses/<str:id>', BookUserStatusView.as_view(http_method_names=['get', 'patch', 'delete']), name='book_user_status_by_id'),
    path('reviews', ReviewView.as_view(http_method_names=['get', 'post']), name='review_base'),
    path('reviews/<str:id>', ReviewView.as_view(http_method_names=['get', 'patch', 'delete']), name='review_by_id'),
]
