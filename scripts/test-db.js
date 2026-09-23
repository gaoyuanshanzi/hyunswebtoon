const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_n2hxPXvBUHY9@ep-crimson-shadow-b5s3bki4-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('Connecting to Neon DB...');
    const client = await pool.connect();
    console.log('Successfully connected to Neon PostgreSQL!');
    
    // 테이블 생성 쿼리
    await client.query(`
      CREATE TABLE IF NOT EXISTS comics (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        topic VARCHAR(255) NOT NULL,
        audience VARCHAR(255) NOT NULL,
        author VARCHAR(100) DEFAULT '현스웹툰',
        source_note VARCHAR(255),
        header_dialogue JSONB,
        panels JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table "comics" created or verified successfully!');
    
    const res = await client.query('SELECT count(*) FROM comics');
    console.log(`Current comic count in DB: ${res.rows[0].count}`);
    
    client.release();
    await pool.end();
    console.log('Connection test completed successfully.');
  } catch (err) {
    console.error('Neon DB connection error:', err);
    process.exit(1);
  }
}

testConnection();
