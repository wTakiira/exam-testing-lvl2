export type BookStatus = 'available' | 'borrowed' | 'maintenance';
export type UserCategory = 'standard' | 'premium' | 'employee';

export interface IBook {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  borrowedBy?: string;
  borrowDate?: Date;
  dueDate?: Date;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  category: UserCategory;
  currentLoans: string[];
}
