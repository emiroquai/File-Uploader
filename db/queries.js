const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function insertNewUser(username, hashedPassword) {
  const user = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });
  return user;
}

async function getUserByID(id) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return user;
}

async function getUserByUsername(username) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return user;
}

module.exports = {
  insertNewUser,
  getUserByID,
  getUserByUsername,
};
