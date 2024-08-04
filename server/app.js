import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import session from "express-session";
import { errorMiddleware } from "./middlewares/error.js";

// import route
import user from "./routes/user.js";
import product from "./routes/product.js";
import order from "./routes/order.js";
import category from "./routes/category.js";
import cart from "./routes/cart.js";
const app = express();

// Middleware
// app.use(cors());

// app.options("*", cors());

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend origin
  credentials: true, // Allow credentials (cookies, headers, etc.)
};

app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000, // 30 minutes
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // CSRF protection
    },
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(errorMiddleware);

// routes
app.use("/api/user", user);
app.use("/api/", product);
app.use("/api", order);
app.use("/api", category);
app.use("/api", cart);

export default app;
