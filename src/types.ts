export interface User {
  id: number;
  email: string;
}

export interface Novel {
  id: number;
  title: string;
  author: string;
  price: number;
  category: string;
  description: string;
  imageUrl?: string;
  userId: number;
}

export interface AuthResponse {
  token: string;
  userId: number;
}
