import {
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const book = await this.booksService.createBook(body);
    return {
      message: 'Book created successfully',
      data: book,
    };
  }

  @Get()
  async findAll() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const books = await this.booksService.getAllBooks();
    return {
      message: 'Books retrieved successfully',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: books,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const book = await this.booksService.getBookById(id);
    return {
      message: `Book with ID ${id} retrieved`,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: book,
    };
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const updated = await this.booksService.updateBook(id, body);
    return {
      message: `Book with ID ${id} updated`,
      data: updated,
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.booksService.deleteBook(id);
    return result;
  }
}
