import { Router } from "express";
import { Readable } from "stream";

import upload from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File gambar wajib diupload",
      });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "kantin-polines",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          },
        );

        Readable.from(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    res.json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
