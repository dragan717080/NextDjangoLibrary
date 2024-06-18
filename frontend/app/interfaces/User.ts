import type Book from "./Book";

export default interface User {
  username: string;
  email: string;
  loaned_books_count: number;
  password_hash: string;
  avatar?: File;
  avatar_url: string;
  books: Partial<Book>[];
}
