const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const helperWrapper = require("../helper/wrapper");

// Saving data in project directory
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, "public/upload/movie");
//   },
//   filename(req, file, cb) {
//     cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
//   },
// });
// Saving data in cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "MoviePoster",
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only input .png/.jpg./.jpeg format"));
    }
  },
  limits: {
    files: 1,
    fileSize: 1024 * 1024,
  },
}).single("image");
const handlingUpload = (request, response, next) => {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
    }
    if (error) {
      // An unknown error occurred when uploading.
      return helperWrapper.response(response, 401, error.message, null);
    }
    return next();
  });
};
module.exports = handlingUpload;
