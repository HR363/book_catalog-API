/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BooksService {
  constructor(private readonly db: DatabaseService) {}

  async createBook(book: {
    title: string;
    author: string;
    publicationYear: number;
    isbn: string;
  }): Promise<any> {
    const pool = this.db.getPool();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const result = await pool
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .request()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .input('title', book.title)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .input('author', book.author)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .input('year', book.publicationYear)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .input('isbn', book.isbn)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .query(
        `INSERT INTO books (title, author, publication_year, isbn)
         VALUES (@title, @author, @year, @isbn);
         SELECT SCOPE_IDENTITY() AS id;`,
      );

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      id: result.recordset[0].id,
      ...book,
    };
  }
}
