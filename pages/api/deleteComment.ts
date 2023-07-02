import type {NextApiRequest, NextApiResponse} from "next";
import deleteComments from "../../lib/deleteComment";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return deleteComments(req, res);
    default:
      return res.status(400).json({message: "Invalid method."});
  }
}
