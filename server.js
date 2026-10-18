import express from "express";
import divesRouter from "./routes/dives.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));
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

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;

  res.status(status).json({
    error: status === 400 ? "Invalid request body." : "Something went wrong.",
  });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
