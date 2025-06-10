-- Create books table
IF OBJECT_ID('books', 'U') IS NULL
BEGIN
  CREATE TABLE books (
    id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255) NOT NULL,
    author NVARCHAR(255) NOT NULL,
    publication_year INT NOT NULL,
    isbn NVARCHAR(20) UNIQUE NOT NULL
  );
END;

-- Create book_deletions table
IF OBJECT_ID('book_deletions', 'U') IS NULL
BEGIN
  CREATE TABLE book_deletions (
    book_id INT,
    deleted_at DATETIME DEFAULT GETDATE()
  );
END;

-- Create index on title
IF NOT EXISTS (
  SELECT name FROM sys.indexes WHERE name = 'idx_books_title'
)
BEGIN
  CREATE INDEX idx_books_title ON books(title);
END;

-- Create or replace stored procedure
IF OBJECT_ID('CountBooksByYear', 'P') IS NOT NULL
  DROP PROCEDURE CountBooksByYear;
GO

CREATE PROCEDURE CountBooksByYear
AS
BEGIN
  SELECT publication_year, COUNT(*) AS count
  FROM books
  GROUP BY publication_year;
END;
GO

-- Create or replace trigger
IF OBJECT_ID('trg_AfterBookDelete', 'TR') IS NOT NULL
  DROP TRIGGER trg_AfterBookDelete;
GO

CREATE TRIGGER trg_AfterBookDelete
ON books
AFTER DELETE
AS
BEGIN
  INSERT INTO book_deletions (book_id)
  SELECT id FROM DELETED;
END;
GO
