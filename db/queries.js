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

async function createNewFolder(name, userId, parentId) {
  const folder = await prisma.folder.create({
    data: {
      name: name,
      userId: userId,
      parentID: parentId,
    },
  });
  return folder;
}

async function createHomeFolder(userId) {
  const folder = await prisma.folder.create({
    data: {
      name: "Home",
      userId: userId,
    },
  });
}

async function getHomeFolderByUserId(userId) {
  const homeFolder = await prisma.folder.findFirst({
    where: {
      userId: userId,
      parentID: null,
    },
  });
  return homeFolder;
}

async function insertNewFile(name, path, size, folderId) {
  const file = await prisma.file.create({
    data: {
      name: name,
      path: path,
      size: size,
      folderId: folderId,
    },
  });
  console.log("File created:", file);
}

async function getFilesByFolderId(folderId) {
  const files = await prisma.file.findMany({
    where: {
      folderId: folderId,
    },
  });
  return files;
}

async function getSubFoldersByParentId(folderId) {
  const SubFolders = await prisma.folder.findMany({
    where: {
      parentID: folderId,
    },
  });
  return SubFolders;
}

async function updateFolderName(id, newName) {
  await prisma.folder.update({
    where: {
      id: id,
    },
    data: {
      name: newName,
    },
  });
}

module.exports = {
  insertNewUser,
  getUserByID,
  getUserByUsername,
  createNewFolder,
  createHomeFolder,
  getHomeFolderByUserId,
  insertNewFile,
  getFilesByFolderId,
  getSubFoldersByParentId,
  updateFolderName,
};
