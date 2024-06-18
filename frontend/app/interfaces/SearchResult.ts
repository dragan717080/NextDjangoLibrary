interface Book {
  id: string;
  title: string;
  author: string;
  image_url: string;
  description: string;
  rating: number;
}

interface User {
  username: string;
  avatar_url: string;
}

export default interface SearchResult {
  books: Book[],
  users: User[],
}
