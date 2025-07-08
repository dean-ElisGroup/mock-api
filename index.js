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

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Step 1: Get all users
    const snapshot = await db.ref("users").once("value");
    const users = snapshot.val();

    if (!users) {
      return res.status(500).json({ error: "No users found" });
    }

    // Step 2: Find matching user
    const matchedUser = Object.entries(users).find(([userId, user]) =>
      user.username === username && user.password === password
    );

    if (!matchedUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const [userId, userData] = matchedUser;

    // Step 3: Generate sessionKey and store it
    const sessionRef = db.ref("sessions").push(); // push generates a key
    const sessionKey = sessionRef.key;

    return res.status(200).json({
      message: "Login successful",
      sessionKey,
      firstname: userData.firstname,
      surname: userData.surname,
      email: userData.email
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed due to server error" });
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
