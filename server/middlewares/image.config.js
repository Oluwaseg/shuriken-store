import dotenv from "dotenv";

dotenv.config();

import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "shop/product-images",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
    unique_filename: true,
    resource_type: "image",
  },
});

const uploadProductImage = multer({ storage: productStorage });

const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "shop/user-image",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, height: 600, crop: "limit" }],
    unique_filename: true,
    resource_type: "image",
  },
});

const uploadUserImage = multer({ storage: userStorage });

export { uploadProductImage, uploadUserImage };
