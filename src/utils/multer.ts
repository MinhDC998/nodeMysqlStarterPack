import { RequestHandler } from "express";
import multer from "multer";
import fs from "fs";

const defaultDest = "public";
const multerOptions = (saveDir: string): Record<string, any> => ({
  storage: storage(saveDir),
  limits: { fieldSize: 88388608 },
});

const storage = (saveDir: string): any =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      const destinationSaveFile = `${defaultDest}${saveDir}`;

      if (!fs.existsSync(destinationSaveFile))
        fs.mkdirSync(destinationSaveFile, { recursive: true });

      cb(null, destinationSaveFile);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });

export const singleFileUpload = (
  fieldName: string,
  saveDir = "/"
): RequestHandler => {
  const fileUpload = multer(multerOptions(saveDir));

  return fileUpload.single(fieldName);
};
