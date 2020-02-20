// import { createWorker } from "tesseract.js";

// const worker = createWorker();

// export const ocrImage = async () => {
//   await worker.load();
//   await worker.loadLanguage("eng");
//   await worker.initialize("eng");
//   const {
//     data: { text }
//   } = await worker.recognize(
//     "https://tesseract.projectnaptha.com/img/eng_bw.png"
//   );
//   console.log(text);
//   await worker.terminate();
// };

export const ocrApi = async (url: string) => {
  const result = await fetch(`https://api.ocr.space/parse/image`, {
    method: "POST",
    headers: {
      apikey: process.env.API_KEY
    },
    body: JSON.stringify({
      base64Image: url
    })
  });
  return result.json();
};
