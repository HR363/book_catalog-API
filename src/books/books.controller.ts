import { Body, Controller, Post } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    const created = await this.booksService.createBook(body);
    return {
      message: 'Book created successfully',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: created,
    };
  }
}
