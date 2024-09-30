const express = require("express");
const router = express.Router();

let books = [
  { id: 1, title: "Book One", author: "Author One" },
  { id: 2, title: "Book Two", author: "Author Two" },
];

// get all books
router.get("/", (req, res) => {
  res.json(books);
});

// get specafic book
router.get("/:id", (req, res) => {
  const book = books.find((book) => book.id === parseInt(req.params.id));
  if (!book) return res.status(400).send("Book not found");
  res.json(book);
});

// put (update existing book)
router.put("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send("Book not found");

  book.title = req.body.title;
  book.author = req.body.author;
  res.json(book);
});

// post a new book
router.post("/", (req, res) => {
  const newBook = {
    id: parseInt(req.body.id),
    title: req.body.title,
    author: req.body.author,
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// delete a book
router.delete("/:id", (req, res) => {
  const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (bookIndex === -1) return res.status(4004).send("Book not found");

  books.splice(bookIndex, 1);
  res.send("delete success");
});

module.exports = router;
