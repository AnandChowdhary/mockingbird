import { recognize } from "tesseract.js";

export const ocrImage = async () => {
  const result = await recognize(
    "https://tesseract.projectnaptha.com/img/eng_bw.png",
    "eng",
    { logger: m => console.log(m) }
  );
  return result;
};
