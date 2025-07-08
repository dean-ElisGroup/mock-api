# Mock API for Articles

Node.js + Express mock backend for querying article data by articleId.

### POST /getArticle

Request:
```json
{
  "articleId": "E435"
}
```

Response:
Returns full article details if found, or 404.
