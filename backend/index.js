import cookieParser from 'cookie-parser';
import express, { urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'
import connectDB from './utils/db.js';
dotenv.config({});

const app = express();

app.get('/', (req, res) => {
    return res.status(200).json({
        message:"I am coming from backend",
        success:true
    })
})
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
    'http://localhost:5173/', // for local development
    'https://instagram-sigma-sable.vercel.app/' // your deployed frontend
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow non-browser tools like Postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // if using cookies or sessions
  }));
app.use(urlencoded({ extended: true }));

// APIs
app.use('/api/v1/user',userRoute)
app.use('/api/v1/post',postRoute)
app.use('/api/v1/message',messageRoute)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
})