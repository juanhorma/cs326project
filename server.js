import express from "express";
import mongoose from "mongoose";
import divesRouter from "./routes/dives.js";
import buddiesRouter from "./routes/buddies.js";

const app = express();
const PORT = process.env.PORT || 3000;

await mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://dev:devpassword@mongo:27017/divelog?authSource=admin",
);

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
  res.status(200).render("homepage");
});

// Dive statistics page
app.get("/stats", (req, res) => {
  res.send(
    "View your dive statistics, including total number of dives, average depth reached, dive times, maximum and minimum depths, and most common dive modality.",
  );
});

app.use("/dives", divesRouter);
app.use("/buddies", buddiesRouter);

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;

  res.status(status).json({
    error:
      status >= 500
        ? "Something went wrong."
        : err.message || "Invalid request body.",
  });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
