import { BookStatus, IBook } from "./types";

export class Book implements IBook {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  borrowedBy?: string;
  borrowDate?: Date;
  dueDate?: Date;

  constructor(id: string, title: string, author: string) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.status = 'available';
  }

  isBorrowed(): boolean {
    return this.status === 'borrowed';
  }

  isAvailable(): boolean {
    return this.status === 'available';
  }

  isInMaintenance(): boolean {
    return this.status === 'maintenance';
  }
}
