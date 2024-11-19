import pg from 'pg';

const { Pool } = pg;

let localPoolConfig = {
	user: 'postgres',
	password: 'postgres',
	host: 'localhost',
	port: '5432',
	database: 'user-auth',
};

const poolConfig = process.env.DATABASE_URL ? { 
	console.log("process.env.DATABASE_URL", process.env.DATABASE_URL);
	connectionString: process.env.DATABASE_URL, ssl:{ 
		rejectUnauthorized: false } 
	} : localPoolConfig;

const pool = new Pool(poolConfig);

export default pool;