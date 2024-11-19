import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtTokens } from '../utils/jwt-helpers.js';

const router = express.Router();

router.post('/login', async (req, res) => {	
	try {
		const { email, password } = req.body;
		const response = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
		if (response.rows.length === 0) {
			return res.status(401).json({ error: 'Invalid email or password' });
		}
		const user = response.rows[0];
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ error: 'Invalid email or password' });
		}

		let tokens = jwtTokens(user.id, user.username, user.email);
		res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
		res.json({ data: { user: { id:user.id, username: user.username, email: user.email, ...tokens } }});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/refresh', async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (!refreshToken) {
			return res.status(401).json({ error: 'No refresh token provided' });
		}
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if (err) {
				return res.status(403).json({ error: 'Invalid refresh token' });
			}
			let tokens = jwtTokens(user.userId, user.name, user.email);
			res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
			res.json(tokens);
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.delete('/refresh', (req, res) => {
	try {
		res.clearCookie('refreshToken');
		res.status(200).json({ message: 'Refresh token deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post('/logout', (req, res) => {
	try {
		res.clearCookie('refreshToken');
		res.status(200).json({ message: 'Logged out' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;