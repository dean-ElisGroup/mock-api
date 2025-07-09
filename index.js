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
    return res.status(400).json({ error: "Missing articleId in request body" });
  }

  try {
    const snapshot = await db.ref("articles").once("value");
    const articles = snapshot.val();

    if (!articles) {
      return res.status(404).json({ error: "No articles found in database" });
    }

    // Filter articles where articleId includes the search term
    const matchedArticles = Object.values(articles).filter(article =>
      article.articleId.toLowerCase().includes(articleId.toLowerCase())
    );

    if (matchedArticles.length === 0) {
      return res.status(404).json({ error: "No articles matched your query" });
    }

    res.status(200).json({
      message: `Found ${matchedArticles.length} article(s) matching '${articleId}'`,
      articles: matchedArticles
    });

  } catch (err) {
    console.error("Error searching articles:", err);
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
      return res.status(500).json({ message: "No users found" });
    }

    // Step 2: Find matching user
    const matchedUser = Object.entries(users).find(([userId, user]) =>
      user.username === username && user.password === password
    );

    if (!matchedUser) {
      return res.status(401).json({ message: "Invalid credentials" });
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
      email: userData.email,
      country: userData.country,
      laundry: userData.laundry
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed due to server error" });
  }
});

app.post("/getArticleIn", async (req, res) => {
  const { locationBarcode } = req.body;

  if (!locationBarcode) {
    return res.status(400).json({ error: "Missing locationBarcode field" });
  }

  try {
    const snapshot = await db.ref("articles").once("value");
    const articles = snapshot.val();

    if (!articles) {
      return res.status(404).json({ error: "No articles found in the database" });
    }

    // Search for the article by locationBarcodeId in locations array
    let foundArticle = null;

    for (const articleId in articles) {
      const article = articles[articleId];
      const locations = article.locations || [];

      const match = locations.find(
        (loc) => loc.locationBarcodeId === locationBarcode
      );

      if (match) {
        foundArticle = {
          ...article,
          matchedLocation: match
        };
        break;
      }
    }

    if (foundArticle) {
      return res.status(200).json({
        message: "Article successfully found",
        articleId: foundArticle.articleId,
        locationBarcode,
        stockQty: foundArticle.articleActualStockQty,
        locationId: foundArticle.matchedLocation.locationId,
        articleDescription: foundArticle.articleDescription,
        articleSize: foundArticle.articleSize
      });
    } else {
      return res.status(404).json({ error: "No article found for the given locationBarcode" });
    }
  } catch (err) {
    console.error("Error in getArticleIn:", err);
    res.status(500).json({ error: "Internal server error" });
  }
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
