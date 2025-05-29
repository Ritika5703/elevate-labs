const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

let books = [];
let currentId = 1;

app.get("/books", (req, res) => {
  res.json(books);
});

app.post("/books", (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required." });
  }

  const newBook = {
    id: currentId++,
    title,
    author,
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (title) book.title = title;
  if (author) book.author = author;

  res.json(book);
});

app.delete("/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  books = books.filter((b) => b.id !== bookId);
  res.json({ message: "Book deleted" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
