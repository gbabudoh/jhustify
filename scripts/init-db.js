const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:LetMeGetaces232823@109.205.181.195:5432/postgres",
});

async function createDatabase() {
  try {
    await client.connect();
    console.log('Connected to postgres database.');
    
    // Check if database exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname='jhustify'");
    if (res.rowCount === 0) {
      console.log('Creating database "jhustify"...');
      await client.query('CREATE DATABASE jhustify');
      console.log('Database "jhustify" created successfully!');
    } else {
      console.log('Database "jhustify" already exists.');
    }
    
    await client.end();
  } catch (err) {
    console.error('Operation failed:', err.message);
    process.exit(1);
  }
}

createDatabase();
