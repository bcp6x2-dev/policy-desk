const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
process.env.DATABASE_URL
? {
connectionString: process.env.DATABASE_URL,
ssl: { rejectUnauthorized: false }
}
: {
user: 'postgres',
host: 'localhost',
database: 'policydesk',
password: process.env.DB_PASSWORD,
port: 5432,
}
);

module.exports = pool;