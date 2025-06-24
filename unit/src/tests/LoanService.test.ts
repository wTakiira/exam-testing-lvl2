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


  it('Doit créer un livre avec les bonnes propriétés', () => {
    const book = new Book('10', 'Seigneur des Anneaux', 'J. R. R. Tolkien');
    expect(book.id).toBe('10');
    expect(book.title).toBe('Seigneur des Anneaux');
    expect(book.author).toBe('J. R. R. Tolkien');
    expect(book.isAvailable()).toBe(true);
  });

  it('Doit créer un utilisateur et lui permettre d\'emprunter', () => {
    const user = new User('4', 'Lucie', 'lucie@monmail.com', 'standard');
    expect(user.id).toBe('4');
    expect(user.email).toBe('lucie@monmail.com');
    expect(user.canBorrow()).toBe(true);
  });


  it('Ne doit pas permettre à un utilisateur standard de dépasser la limite de prêts', () => {
    const user = new User('u2', 'Marc', 'marc@mail.com', 'standard');
    user.addLoan('b1');
    user.addLoan('b2');
    user.addLoan('b3');
    expect(user.canBorrow()).toBe(false);
  });


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
