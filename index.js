// load env-vars
require('dotenv').config();

// requiring dependencies
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// initialize express
const app = express();

// requiring routers
const paymentRouter = require('./routes/paymentRouter');
const productRouter = require('./routes/productRouter');
const adminRouter = require('./routes/adminRouter');
const orderRouter = require('./routes/orderRouter');
const uploadRouter = require('./routes/uploadRouter');
const courseRouter = require('./routes/courseRouter');
const productCategoryRouter = require('./routes/productCategoryRouter');
const courseCategoryRouter = require('./routes/courseCategoryRouter');

// requiring middlewares
const errorMiddleware = require('./middleware/Error');

// require db configs
const connectToDb = require('./config/db');

// require cloudinary configs
const cloudinary = require('./config/cloudinary');

// connect to db
connectToDb();

// using middlewares
app.use(
  cors({
    origin: [/vercel\.app$/, /localhost:\d{4}$/],
    credentials: true,
  })
);
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

// basic api route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API service running 🚀',
  });
});

// using routers
app.use('/api/payment', paymentRouter);
app.use('/api/products', productRouter);
app.use('/api/admin', adminRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/course', courseRouter);
app.use('/api/productcategory', productCategoryRouter);
app.use('/api/coursecategory', courseCategoryRouter);

// using other middlewares
app.use(errorMiddleware);

// starting server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Server running');
});

// unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server shutting down due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
