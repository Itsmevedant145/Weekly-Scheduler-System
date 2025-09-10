require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // 🔒 Allow self-signed certs (required for many free PostgreSQL hosts)
      },
    },
    migrations: {
      directory: './db/migrations',
      extension: 'ts', // If using TypeScript migrations
    },
  },
};
