import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import { authToken } from '../middleware/authorization.js';

const router = express.Router();

router.post('/', async (req, res) => {
	try {
		const { username, email, password } = req.body;
		console.log("body", req.body);
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		console.log("hashedPassword", hashedPassword);
		const response = await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
		console.log("response", response);
		res.json({ data: { user: response.rows[0] } });
	} catch (err) {
		console.log("err", err);
		res.status(500).json({ error: err.message });
	}
});

router.post('/favorites', authToken, async (req, res) => {
	try {
		const { user_id, movie_id } = req.body;
		const response = await pool.query('INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2) RETURNING *', [user_id, movie_id]);
		res.json({ data: { favorite: response.rows[0] } });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/:user_id/favorites', authToken, async (req, res) => {
	try {
		const userId = req.params.user_id;
		const response = await pool.query('SELECT * FROM favorites WHERE user_id = $1', [userId]);
		res.json({ data: { user: { id: userId }, favorites: response.rows } });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.delete('/favorites', authToken, async (req, res) => {
	try {
		const { user_id, movie_id } = req.body;
		const response = await pool.query('DELETE FROM favorites WHERE user_id = $1 AND movie_id = $2 RETURNING *', [user_id, movie_id]);
		res.status(200).json({ message: 'Favorite deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;