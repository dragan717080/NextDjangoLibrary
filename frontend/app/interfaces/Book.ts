export default interface Book {
  id: string;
  created_at: string;
  updated_at: string;
  author: string;
  genres: string[];
  title: string;
  description: string;
  image_url: string;
  rating: number;
  total_votes: number;
  total_copies: number;
  available_copies: number;
}
