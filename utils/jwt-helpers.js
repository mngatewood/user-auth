import jwt from 'jsonwebtoken';

export const jwtTokens = (userId, name, email) => {
	const user = { userId, name, email };
	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); // TODO: 15m
	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '14d' }); // TODO: 14d
	return { accessToken, refreshToken };
}