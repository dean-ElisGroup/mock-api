import express from "express";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const articles = {
  E435: {
    articleId: "E435",
    articleSize: "L",
    articleDescription: "ZIP POLO - COLLAR - BLUE",
    articleActualStockQty: "12",
    locations: [
      { locationId: "A-114", locationBarcodeId: "123456789" },
      { locationId: "B-114", locationBarcodeId: "1234567890" }
    ]
  },
  X101: {
    articleId: "X101",
    articleSize: "M",
    articleDescription: "SWEATSHIRT - GREY",
    articleActualStockQty: "5",
    locations: [
      { locationId: "C-200", locationBarcodeId: "222222222" }
    ]
  }
};

app.post("/getArticle", (req, res) => {
  const { articleId } = req.body;
  const article = articles[articleId];
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ error: `Article '${articleId}' not found` });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Dummy check (always succeeds — you can add real logic later)
  if (username && password) {
    const token = "255364-U81A-9987-P92G";
    res.json({
      message: "Login successful",
      token: token
    });
  } else {
    res.status(400).json({ error: "Username and password are required" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
