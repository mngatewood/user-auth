import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3001;
const corsOptions = {
	credentials: true,
	origin: process.env.CLIENT_URL || 'http://localhost:3000',
	methods: ['GET','POST','DELETE','OPTIONS']
}

app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

app.use(express.static(join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});