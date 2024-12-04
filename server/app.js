import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import logger from './logger.js';
import { errorMiddleware } from './middlewares/error.js';

// import route
import cart from './routes/cart.js';
import category from './routes/category.js';
import order from './routes/order.js';
import product from './routes/product.js';
import user from './routes/user.js';
const app = express();

//! Middleware

const corsOptions = {
  origin: [
    process.env.ADMIN_URL,
    process.env.CLIENT_URL,
    'https://b3tfhzw5-3000.uks1.devtunnels.ms',
    'https://b3tfhzw5-3050.uks1.devtunnels.ms',
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  })
);

//! Setup Morgan to use Winston for logging

app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use('/api', user);
app.use('/api/', product);
app.use('/api', order);
app.use('/api', category);
app.use('/api', cart);

//! error middleware

app.use(errorMiddleware);

export default app;
