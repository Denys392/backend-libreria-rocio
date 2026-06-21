import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "public/uploads/others/";

    if (req.baseUrl.includes("/products")) {
      folder = "public/uploads/products/";
    } else if (req.baseUrl.includes("/categories")) {
      folder = "public/uploads/categories/";
    } else if (req.baseUrl.includes("/users")) {
      folder = "public/uploads/profiles/";
    }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    return cb(null, true);
  } else {
    const error = new Error(
      "Solo se permiten imágenes (.jpeg, .jpg, .png, .webp)",
    );
    error.status = 400;
    return cb(error, false);
  }
};

export const uploadImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
