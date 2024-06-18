import type Book from "./Book";
import type Review from "./Review";

export type StatusOption = 'To read' | 'Reading' | 'Read';

export interface BookUserStatus {
  id: string;
  user: string;
  book: string;
  status: StatusOption;
}

/**
 * In situations where user is signed in, it will return
 * both book and his status for that book.
 */
export interface FullBookUserStatus {
  book: Book;
  status: StatusOption | 'Select status';
  total_votes: number;
  rating: number;
  review: Review;
}
