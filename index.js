//import express from "express";
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
//import db from "./firebase.js";
const db = require("./firebase.js");

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

const users = [
  { username: "dball", password: "password1" },
  { username: "mwalkingshaw", password: "password1" }
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if user exists and password matches
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const token = "255364-U81A-9987-P92G";
    res.json({
      message: "Login successful",
      token: token,
    });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

app.post("/getArticleIn", (req, res) => {
  const { locationBarcode, articleId } = req.body;

  if (!locationBarcode || !articleId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  res.status(200).json({
    message: "Article successfully found",
    articleId,
    locationBarcode,
    stockQty: "2"
  });
});

app.post("/updateArticleQty", async (req, res) => {
  const { articleId, qty } = req.body;

  if (!articleId || qty == null) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const ref = db.ref(`articles/${articleId}`);
    await ref.update({ articleActualStockQty: qty });

    const snapshot = await ref.once("value");
    res.status(200).json({
      message: "Article quantity updated",
      article: snapshot.val()
    });
  } catch (err) {
    res.status(500).json({ error: "Firebase error", details: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
