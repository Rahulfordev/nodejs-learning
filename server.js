require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
