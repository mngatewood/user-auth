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

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin, Access-Control-Allow-Credentials');
	next();
});

const port = process.env.PORT || 3001;

app.use(json());
app.use(cookieParser());

app.use(express.static(join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});