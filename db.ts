import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const {Pool} = pg;

const { user, password, host, port, database } = process.env
const db = new Pool({
  user,
  password,
  host,
  port: parseInt(port),
  database
});

export default db;