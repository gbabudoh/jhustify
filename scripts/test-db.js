const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:LetMeGetaces232823@109.205.181.195:5432/postgres",
});

async function testConnection() {
  try {
    console.log('Attempting to connect to PostgreSQL...');
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Current Time from DB:', res.rows[0].now);
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
