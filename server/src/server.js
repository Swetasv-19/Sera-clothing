const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const ErrorResponse = require("./utils/errorResponse");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/addresses", require("./routes/addressRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/products", require("./routes/products"));

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

app.get("/", (req, res) => {
  res.json({ message: "Sera Clothing API Server is running" });
});

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on port http://localhost:${PORT}`),
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
