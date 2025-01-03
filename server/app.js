import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import logger from './logger.js';
import { errorMiddleware } from './middlewares/error.js';

// import route
import cart from './routes/cart.js';
import category from './routes/category.js';
import chat from './routes/chat.js';
import order from './routes/order.js';
import product from './routes/product.js';
import user from './routes/user.js';
const app = express();

//! Middleware

const corsOptions = {
  origin: [
    process.env.ADMIN_URL,
    process.env.CLIENT_URL,
    process.env.ADMIN_DEVELOPMENT_URL,
    process.env.CLIENT_DEVELOPMENT_URL,
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

app.use(cors(corsOptions));

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
app.use('/api', chat);

app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

//! error middleware

app.use(errorMiddleware);

export default app;
