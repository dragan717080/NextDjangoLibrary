from rest_framework.views import APIView
from django.http import JsonResponse
from django.core.handlers.wsgi import WSGIRequest
from ..databases.database_postgres import DatabasePostgres
from ..repositories.BookRepository import BookRepository
from ..repositories.UserRepository import UserRepository

class SearchView(APIView):
    """
    When search input in frontend is searched, provide query of books and users given union
        e.g. when input is 'om' give all books and users containing 'om'
    """
    
    def __init__(self, http_method_names):
        self.book_repository = BookRepository()
        self.user_repository = UserRepository()
        self.db = DatabasePostgres()
    
    def post(self, request: WSGIRequest):
        input = request.data['input']
        def get_books_result(table='books'):
            books_search_query = f"""
                SELECT id, title, author, image_url, description, rating FROM {table}
                WHERE title ILIKE '%{input}%'
                ORDER BY rating DESC
                LIMIT 10
            """

            return self.db.execute_raw_query(books_search_query)

        def get_users_result(table='users'):
            users_search_query = f"""
                SELECT username, avatar_url FROM {table}
                WHERE username ILIKE '%{input}%'
                LIMIT 10
            """

            return self.db.execute_raw_query(users_search_query)

        all_books = get_books_result()
        top_books = get_books_result("top_books_2023")
        all_users = get_users_result("users")

        return JsonResponse({ "books": [*all_books, *top_books], "users": all_users })
