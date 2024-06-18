from ..models import Review
from .BaseRepository import BaseRepository
from .UserRepository import UserRepository
from .BookRepository import BookRepository

class ReviewRepository(BaseRepository):
    def __init__(self):
        self.model = Review
        self.user_repository = UserRepository()
        self.book_repository = BookRepository()
        self.related = ['user', 'book', 'review']

    def create(self, username: str, book_id: str, rating: int = None, content: str = None):
        user = self.user_repository.get_by_fields({ "username": username })

        # If review with the same username and book_id exists, go to the update instead
        review = self.get_by_fields({ "user": username, "book_id": book_id })

        if review is not None:
            return self.update(review.id, rating, content, book_id)

        if not user:
            return "User with that username doesn't exist"
        
        book = self.book_repository.get_by_id(book_id)
        if not book:
            return "Book doesn't exist"

        review = Review(
            user=user,
            book=book,
            rating=rating,
            content=content or None,
        )

        review.save()

        if rating is not None:
            # Update the book rating and total votes
            new_total_votes = book.total_votes + 1
            new_rating = round(((round(book.rating * book.total_votes) + rating) / new_total_votes), 2)

            self.book_repository.update(
                book_id,
                rating=new_rating,
                total_votes=book.total_votes + 1
            )

        return review

    def update(self, id: str, rating: int = None, content: str = None, book_id: str = None):
        try:
            review = Review.objects.get(pk=id)
        except Review.DoesNotExist:
            return None

        if rating:

            if book_id:
                book = self.book_repository.get_by_id(book_id)
                # Update the book rating and total votes (Is different than the 'create' method),
                # since will not add new votes, but modify existing rating
                
                old_rating = review.rating
                book_total_votes = book.total_votes or 1
                try:
                    new_rating = round((round(book.rating * book.total_votes) - old_rating + rating) / book.total_votes, 2)
                # Book has no reviews yet
                except ZeroDivisionError:
                    new_rating = rating

                self.book_repository.update(
                    book_id,
                    rating=new_rating,
                    total_votes=book_total_votes,
                )

            review.rating = rating

        if content:
            review.content = content

        review.save()
        return review

    def delete(self, id):
        """
        When a review is deleted, update 'rating' and 'total_votes' for related book.
        """
        try:
            review = Review.objects.get(pk=id)
            if review.rating:
                book = review.book
                book.rating -= review.rating
                book.total_votes -= 1
                book.save()
            review.delete()
            return 1
        except self.model.DoesNotExist:
            return None
