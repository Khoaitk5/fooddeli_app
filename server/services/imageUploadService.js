import bucket from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";

export const uploadImageToFirebase = async (file) => {
  if (!file) throw new Error("Không có file để upload");

  const fileName = `images/product/${uuidv4()}_${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  const stream = fileUpload.createWriteStream({
    metadata: { contentType: file.mimetype },
  });

  return new Promise((resolve, reject) => {
    stream.on("error", (err) => reject(err));

    stream.on("finish", async () => {
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(publicUrl);
    });

    stream.end(file.buffer);
  });
};
