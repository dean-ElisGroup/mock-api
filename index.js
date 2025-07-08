//import express from "express";
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
//import db from "./firebase.js";
const db = require("./firebase.js");
const bodyParser = require("body-parser");

app.use(express.json());

app.use(bodyParser.json());

app.post("/getArticle", async (req, res) => {
  const { articleId } = req.body;

  if (!articleId) {
    return res.status(400).json({ error: "articleId is required in the request body" });
  }

  try {
    const snapshot = await db.ref(`articles/${articleId}`).once("value");
    const article = snapshot.val();

    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ error: `Article '${articleId}' not found` });
    }
  } catch (error) {
    console.error("Error retrieving article:", error);
    res.status(500).json({ error: "Internal server error" });
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
