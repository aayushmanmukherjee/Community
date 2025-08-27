import multer from "multer";

// use memoryStorage so we can directly send file buffer to ImageKit
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;