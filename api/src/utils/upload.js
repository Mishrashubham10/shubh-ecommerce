import multer from 'multer';
import path from 'path';

/**
 * STORAGE CONFIGURATION
 * ---------------------
 * For now, store images locally.
 * Later we will replace this with Cloud storage (S3 / Cloudinary).
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // FOLDER WHERE FILE WILL BE SAVE
  },
  filename: (req, file, cb) => {
    /**
     * Unique filename:
     * product-167890123.png
     */
    const uniqueName =
      file.fieldname + '-' + Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

/**
 * FILE FILTER
 * -----------
 * Only allow images
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimeType);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

/**
 * MULTER CONFIG
 */
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB MAX
  },
  fileFilter,
});

export default upload;