export type UserRole = 'CLIENT' | 'BROKER' | 'ADMIN';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
  };
  token: string;
  refreshToken?: string;
}
