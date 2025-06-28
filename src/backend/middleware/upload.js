    import multer from 'multer';
    import path from 'path';
    import fs from 'fs';
    import { fileURLToPath } from 'url';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadDir = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
    });

    const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid =
        allowedTypes.test(path.extname(file.originalname).toLowerCase()) &&
        allowedTypes.test(file.mimetype);
    cb(isValid ? null : new Error('Only image files are allowed!'), isValid);
    };

    const limits = {
    fileSize: 5 * 1024 * 1024,
    };

    const upload = multer({ storage, fileFilter, limits });
    export default upload;
