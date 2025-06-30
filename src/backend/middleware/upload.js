import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define uploads directory path
const uploadDir = path.join(__dirname, '../uploads');

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
},
filename: (req, file, cb) => {
    // Use timestamp + original file extension for filename uniqueness
    cb(null, Date.now() + path.extname(file.originalname));
    },
});

// File filter to accept only images (jpeg, jpg, png, gif)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'));
    }
};

// File size limit (5 MB)
const limits = {
  fileSize: 5 * 1024 * 1024,
};

// Export configured multer middleware
const upload = multer({
    storage,
    fileFilter,
    limits,
});

export default upload;
