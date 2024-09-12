const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

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
  console.log("File added to the database:", file);
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

async function updateFileName(id, newName) {
  await prisma.file.update({
    where: {
      id: id,
    },
    data: {
      name: newName,
    },
  });
}

async function deleteFilesInFolder(folderId) {
  const files = await prisma.file.findMany({
    where: {
      folderId: folderId,
    },
  });

  for (const file of files) {
    deleteFile(file.id, file.path);
  }
}

async function deleteSubfolders(folderId) {
  // Get all subfolders
  const subfolders = await prisma.folder.findMany({
    where: {
      parentID: folderId,
    },
  });

  // Recursively delete each subfolder
  for (const subfolder of subfolders) {
    await deleteFilesInFolder(subfolder.id); // Delete files in subfolder
    await deleteSubfolders(subfolder.id); // Recursively delete subfolder
    await prisma.folder.delete({
      where: {
        id: subfolder.id,
      },
    });
  }
}

async function deleteFolder(id) {
  // First delete all files in the folder
  await deleteFilesInFolder(id);

  // Then delete all subfolders recursively
  await deleteSubfolders(id);

  // Finally delete the folder itself
  await prisma.folder.delete({
    where: {
      id: id,
    },
  });
}
async function getFolderById(id) {
  const folder = await prisma.folder.findUnique({
    where: {
      id: id,
    },
  });
  return folder;
}

async function deleteFileLocal(filePath) {
  // Delete file from the file system
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully from the file system:", filePath);
    }
  });
}

async function deleteFile(fileId) {
  // Delete file from the database
  await prisma.file.delete({
    where: {
      id: fileId,
    },
  });
}

async function getFileById(id) {
  const file = await prisma.file.findUnique({
    where: {
      id: id,
    },
  });
  return file;
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
  deleteFolder,
  getFolderById,
  deleteFile,
  getFileById,
  updateFileName,
  deleteFileLocal,
};
