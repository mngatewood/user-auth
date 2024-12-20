import jwt from 'jsonwebtoken';

export const authToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) {
				return res.status(403).json({ error: 'Invalid access token' });
			}
			req.user = user;
			next();
		});
	} else {
		res.sendStatus(401);
	}
};