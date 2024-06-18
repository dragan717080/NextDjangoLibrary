import type Book from "../Book";
import User from "../User";

interface UserCardUser {
  username: string;
  avatar_url?: string;
  books: Book[];
}

export default interface UserCardProps {
  user: User;
}
