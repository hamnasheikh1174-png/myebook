export interface User {
  id: string;
  email: string;
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  description: string;
  image_url?: string;
  user_id: string;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
}
