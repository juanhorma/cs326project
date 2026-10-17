import express from "express";
import divesRouter from "./routes/dives.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use("/dives", divesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
