import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const query = async (text: string, params?: any[]) => {
    const res = await pool.query(text, params)
    return res
}

export default pool