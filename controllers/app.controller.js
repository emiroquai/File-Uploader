const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const asyncHandler = require("express-async-handler");

async function getHome(req, res) {
  if (req.user) {
    const homeFolder = await db.getHomeFolderByUserId(req.user.id);
    const SubFolders = await db.getSubFoldersByParentId(homeFolder.id);
    const files = await db.getFilesByFolderId(homeFolder.id);
    // console.log("User: ", req.user);
    // console.log("Home folder: ", homeFolder);
    res.render("home", {
      user: req.user,
      topfolder: homeFolder,
      subfolders: SubFolders,
      files: files,
    });
  } else {
    res.render("home", {
      user: req.user,
      folder: null,
      files: null,
    });
  }
}

async function getSignUp(req, res) {
  res.render("forms/sign-up-form");
}

// Validators
const confirmPassword = [
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must have minimum 5 characters."),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords must be identical"),
];

async function postSignUp(req, res, next) {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("sign-up-form", {
      errors: errors.array(),
    });
  }
  // Continue with the sign-up logic
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    try {
      const newUser = await db.insertNewUser(req.body.username, hashedPassword);

      // Create a home folder for new user
      await db.createHomeFolder(newUser.id);

      // Automatically log in the user after sign-up
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/");
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  });
}

// Authenticate user
const logInUser = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

const logOutUser = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// Upload file with multer
const uploadFile = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log("File Uploaded:", req.file);
  await db.insertNewFile(
    req.file.originalname,
    req.file.path,
    req.file.size,
    req.body.folderId
  );
  reloadPage(res, req);
});

const reloadPage = (res, req) => {
  const referer = req.get("Referer") || "/";
  res.redirect(referer);
};

const createFolder = asyncHandler(async (req, res, next) => {
  await db.createNewFolder(req.body.name, req.user.id, req.body.folderId);
  reloadPage(res, req);
});

const renameFolderPost = asyncHandler(async (req, res, next) => {
  await db.updateFolderName(req.body.id, req.body.name);
  reloadPage(res, req);
});

const deleteFolder = asyncHandler(async (req, res, next) => {
  await db.deleteFolder(req.params.id);
  reloadPage(res, req);
});

const getFolderById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const folder = await db.getFolderById(id);
  const subFolders = await db.getSubFoldersByParentId(id);
  const files = await db.getFilesByFolderId(id);

  console.log("Folder:", folder);

  res.render("home", {
    user: req.user,
    topfolder: folder,
    subfolders: subFolders,
    files: files,
  });
});

const deleteFile = asyncHandler(async (req, res, next) => {
  const file = await db.getFileById(req.params.id);
  console.log(file);
  await db.deleteFile(file.id, file.path);
  reloadPage(res, req);
});

const renameFilePost = asyncHandler(async (req, res, next) => {
  await db.updateFileName(req.body.id, req.body.name);
  reloadPage(res, req);
});

module.exports = {
  getHome,
  getSignUp,
  confirmPassword,
  postSignUp,
  logInUser,
  logOutUser,
  uploadFile,
  createFolder,
  renameFolderPost,
  deleteFolder,
  getFolderById,
  deleteFile,
  renameFilePost,
};
