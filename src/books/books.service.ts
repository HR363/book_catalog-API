/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BooksService {
  constructor(private readonly db: DatabaseService) {}

  async createBook(book: {
    title: string;
    author: string;
    publicationYear: number;
    isbn: string;
  }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pool = this.db.getPool();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await pool
      .request()
      .input('title', book.title)
      .input('author', book.author)
      .input('year', book.publicationYear)
      .input('isbn', book.isbn).query(`
        INSERT INTO books (title, author, publication_year, isbn)
        VALUES (@title, @author, @year, @isbn);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      id: result.recordset[0].id,
      ...book,
    };
  }

  async getAllBooks() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pool = this.db.getPool();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await pool.request().query(`
      SELECT id, title, author, publication_year AS publicationYear, isbn
      FROM books;
    `);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.recordset;
  }

  async getBookById(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pool = this.db.getPool();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await pool.request().input('id', id).query(`
        SELECT id, title, author, publication_year AS publicationYear, isbn
        FROM books
        WHERE id = @id;
      `);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const book = result.recordset[0];
    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return book;
  }

  async updateBook(
    id: number,
    book: Partial<{
      title: string;
      author: string;
      publicationYear: number;
      isbn: string;
    }>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pool = this.db.getPool();

    // Ensure the book exists
    await this.getBookById(id);

    await pool
      .request()
      .input('id', id)
      .input('title', book.title)
      .input('author', book.author)
      .input('year', book.publicationYear)
      .input('isbn', book.isbn).query(`
        UPDATE books SET
          title = @title,
          author = @author,
          publication_year = @year,
          isbn = @isbn
        WHERE id = @id;
      `);

    return { id, ...book };
  }

  async deleteBook(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pool = this.db.getPool();

    // Ensure the book exists
    await this.getBookById(id);

    await pool
      .request()
      .input('id', id)
      .query('DELETE FROM books WHERE id = @id;');

    return { message: `Book with ID ${id} deleted.` };
  }
  async countBooksByYear() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const pool = this.db.getPool();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await pool.request().execute('CountBooksByYear');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result.recordset; // e.g. [{ publication_year: 2022, count: 3 }]
  }
}
