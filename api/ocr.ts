import { NowRequest, NowResponse } from "@now/node";
import { ocrImage } from "../helpers/ocr";

export default async (req: NowRequest, res: NowResponse) => {
  return res.json(ocrImage());
};
