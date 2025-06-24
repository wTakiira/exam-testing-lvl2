import { IUser, UserCategory } from "./types";

export class User implements IUser {
  id: string;
  name: string;
  email: string;
  category: UserCategory;
  currentLoans: string[] = [];

  constructor(id: string, name: string, email: string, category: UserCategory = 'standard') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.category = category;
  }

  canBorrow(): boolean {
    const loanLimits: Record<UserCategory, number> = {
      standard: 3,
      premium: 5,
      employee: 8
    };

    return this.currentLoans.length < loanLimits[this.category];
  }

  addLoan(bookId: string): void {
    if (!this.currentLoans.includes(bookId)) {
      this.currentLoans.push(bookId);
    }
  }

  removeLoan(bookId: string): void {
    this.currentLoans = this.currentLoans.filter(id => id !== bookId);
  }
}
