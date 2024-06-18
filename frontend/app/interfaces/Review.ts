export default interface Review {
  id: string;
  book: string;
  user: string;
  rating?: number;
  content?: string;
}
