export interface User {
  id: number;
  name: string;
  email: string;
  role: 'guest' | 'buyer' | 'merchant' | 'admin';
  avatar?: string;
  createdAt: string;
}
