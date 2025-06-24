// loanService.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { LoanService } from '../LoanService';
import { Book } from '../Book';
import { User } from '../User';

let service: LoanService;

beforeEach(() => {
  service = new LoanService();
});

describe('LoanService Unit Tests', () => {
  it('Doit pouvoir emprunter un livre quand l\'utilisateur et le livre sont valid', () => {
    const book = new Book('1', 'Manon Lescaut', 'Abbé Prévost');
    const user = new User('1', 'Thomas', 'thomas@monmail.com', 'standard');

    service.addBook(book);
    service.addUser(user);

    const result = service.borrowBook('1', '1');

    expect(result).toBe(true);
    expect(book.isBorrowed()).toBe(true);
    expect(book.borrowedBy).toBe('1');
    expect(user.currentLoans.includes('1')).toBe(true);
  });

  it('Doit echoué si le livre est déjà emprunter', () => {
    const book = new Book('2', 'On ne badine pas avec l’amour', 'Alfred de Musset');
    const user1 = new User('1', 'Benjamin', 'benj@monmail.com', 'standard');
    const user2 = new User('2', 'Eva', 'eva@monmail.com', 'standard');

    service.addBook(book);
    service.addUser(user1);
    service.addUser(user2);

    service.borrowBook('2', '1');
    const result = service.borrowBook('2', '2');

    expect(result).toBe(false);
    expect(book.borrowedBy).toBe('1');
    expect(user2.currentLoans.includes('2')).toBe(false);
  });

  it('Doit ajouter une pénalité quand un livre est rendu en retard', () => {
    const book = new Book('3', 'Le Petit Prince', 'Antoine de Saint-Exupéry');
    const user = new User('3', 'Edgard', 'edgard@mmonail.com', 'standard');

    service.addBook(book);
    service.addUser(user);

    const borrowDate = new Date('2023-01-01');
    const returnDate = new Date('2023-02-01');

    service.borrowBook('3', '3', borrowDate);
    const penalty = service.returnBook('3', returnDate);

    expect(penalty).toBeGreaterThan(0);
    expect(book.isBorrowed()).toBe(false);
    expect(user.currentLoans.includes('3')).toBe(false);
  });
});
