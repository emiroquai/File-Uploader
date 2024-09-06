const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function insertNewUser(user_name, hashedPassword, isAdmin) {
  await pool.query(
    "INSERT INTO users (user_name, user_password, isAdmin) VALUES ($1, $2, $3)",
    [user_name, hashedPassword, isAdmin]
  );
  const newUser = getUserByUsername(user_name);
  return newUser;
}

async function getUserByID(id) {
  const query = "SELECT * FROM users WHERE user_id = $1";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}

async function getUserByUsername(username) {
  const query = "SELECT * FROM users WHERE user_name = $1";
  const { rows } = await pool.query(query, [username]);
  return rows[0];
}

module.exports = {
  insertNewUser,
  getUserByID,
  getUserByUsername,
};
