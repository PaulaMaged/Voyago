// Import required libraries
import multer from "multer"; // Library for handling multipart/form-data
import path from "path"; // Library for handling file paths

// Set storage engine for multer
const storage = multer.diskStorage({
  /**
   * Destination directory for uploaded files
   */
  destination: "./public/uploads/",

  /**
   * Generates the filename for the uploaded file
   * @param {object} req - The request object
   * @param {object} file - The file being uploaded
   * @param {function} cb - Callback function to return the filename
   */
  filename: function (req, file, cb) {
    // Generate a filename by combining the fieldname, timestamp, and original file extension
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

/**
 * Filter function to restrict the types of files that can be uploaded
 * @param {object} req - The request object
 * @param {object} file - The file being uploaded
 * @param {function} cb - Callback function to return a boolean indicating whether the file is allowed
 */
const fileFilter = (req, file, cb) => {
  // Check if the file has an allowed mimetype
  if (
    file.mimetype === "image/jpeg" || // Allow JPEG images
    file.mimetype === "image/png" || // Allow PNG images
    file.mimetype === "application/pdf" || // Allow PDF files
    file.mimetype === "application/msword" || // Allow MS Word files (.doc)
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // Allow MS Word files (.docx)
  ) {
    // If the file is allowed, return true
    cb(null, true);
  } else {
    // If the file is not allowed, return false
    cb(null, false);
  }
};

// Initialize the multer instance with storage and file filter options
const upload = multer({
  // Use the disk storage engine
  storage: storage,

  // Limit file size to 100MB
  limits: { fileSize: 1024 * 1024 * 100 },

  // Apply the file filter
  fileFilter: fileFilter,
});

// Export the multer instance as the default export
export default upload;
