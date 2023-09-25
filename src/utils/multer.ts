import { RequestHandler } from "express";
import multer from "multer";
import fs from "fs";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

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

export const uploadToS3 = (fileName: string, fileDir = "/") => {
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  const s3 = new aws.S3();

  return multer({
    storage: multerS3({
      // @ts-ignore
      s3,
      bucket: process.env.BUCKET_NAME || "",
      region: process.env.AWS_REGION || "",
      key: function (req, file, cb) {
        console.log({ fileDir });
        cb(null, `${fileDir}/${file.originalname}`);
      },
    }),
  }).single(fileName);
};
