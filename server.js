import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Home page
app.get("/", (req, res) => {
  res.send("Welcome to DIVELOG!");
});

// Dive statistics page
app.get("/stats", (req, res) => {
  res.send(
    "View your dive statistics, including total number of dives, average depth reached, dive times, maximum and minimum depths, and most common dive modality.",
  );
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
