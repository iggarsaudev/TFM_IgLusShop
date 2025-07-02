export interface Review {
  id: number;
  comment: string;
  rating: number;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
}
