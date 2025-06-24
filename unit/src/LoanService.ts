import { Book } from "./Book";
import { UserCategory } from "./types";
import { User } from "./User";

export class LoanService {
  private books: Map<string, Book> = new Map();
  private users: Map<string, User> = new Map();

  constructor() { }

  addBook(book: Book): void {
    this.books.set(book.id, book);
  }

  addUser(user: User): void {
    this.users.set(user.id, user);
  }

  getBook(bookId: string): Book | undefined {
    return this.books.get(bookId);
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  borrowBook(bookId: string, userId: string, borrowDate: Date = new Date()): boolean {
    const book = this.books.get(bookId);
    const user = this.users.get(userId);

    if (!book || !user) {
      return false;
    }

    if (!book.isAvailable() || !user.canBorrow()) {
      return false;
    }

    // Prêt du livre
    book.status = 'borrowed';
    book.borrowedBy = userId;
    book.borrowDate = borrowDate;
    book.dueDate = this.calculateDueDate(borrowDate, user.category);

    user.addLoan(bookId);

    return true;
  }

  returnBook(bookId: string, returnDate: Date = new Date()): number {
    const book = this.books.get(bookId);

    if (!book || !book.isBorrowed() || !book.borrowedBy) {
      return -1; // Code d'erreur
    }

    const user = this.users.get(book.borrowedBy);

    if (!user) {
      return -1; // Code d'erreur
    }

    // Calcul des pénalités éventuelles
    const penalty = this.calculatePenalty(book, returnDate);

    // Retour du livre
    book.status = 'available';
    user.removeLoan(bookId);
    book.borrowedBy = undefined;
    book.borrowDate = undefined;
    book.dueDate = undefined;

    return penalty;
  }

  calculateDueDate(borrowDate: Date, userCategory: UserCategory): Date {
    const dueDate = new Date(borrowDate);

    // Durée de prêt selon la catégorie d'utilisateur (en jours)
    const loanDurations: Record<UserCategory, number> = {
      standard: 14,  // 2 semaines
      premium: 30,   // 1 mois
      employee: 60   // 2 mois
    };

    dueDate.setDate(dueDate.getDate() + loanDurations[userCategory]);
    return dueDate;
  }

  calculatePenalty(book: Book, returnDate: Date): number {
    if (!book.dueDate) {
      return 0;
    }

    // Pas de pénalité si retour avant ou à la date prévue
    if (returnDate <= book.dueDate) {
      return 0;
    }

    // Calcul des jours de retard
    const dueTime = book.dueDate.getTime();
    const returnTime = returnDate.getTime();
    const daysLate = Math.ceil((returnTime - dueTime) / (1000 * 60 * 60 * 24));

    // Tarif des pénalités : 0.50€ par jour de retard
    return daysLate * 0.5;
  }

  getBorrowedBooks(): Book[] {
    return Array.from(this.books.values()).filter(book => book.isBorrowed());
  }

  getAvailableBooks(): Book[] {
    return Array.from(this.books.values()).filter(book => book.isAvailable());
  }

  getUserLoans(userId: string): Book[] {
    return Array.from(this.books.values()).filter(book => book.borrowedBy === userId);
  }

  getOverdueBooks(currentDate: Date = new Date()): Book[] {
    return this.getBorrowedBooks().filter(book =>
      book.dueDate ? book.dueDate < currentDate : false
    );
  }
}
