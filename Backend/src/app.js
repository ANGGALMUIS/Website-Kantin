import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Railway Test Success",
  });
});

export default app;
