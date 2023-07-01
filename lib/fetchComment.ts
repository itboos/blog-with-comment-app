import type {NextApiRequest, NextApiResponse} from "next";
import type {Comment} from "../interfaces";
import redis from "./redis";
import clearUrl from "./clearUrl";

export default async function fetchComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const url = clearUrl(req.headers.referer);

  if (!redis) {
    return res.status(500).json({message: "Failed to connect to redis."});
  }

  try {
    // get data
    const comments: Array<Comment> = await redis.lrange("comments", 0, 20);
    return res.status(200).json(comments);
  } catch (_) {
    return res.status(400).json({message: "Unexpected error occurred."});
  }
}
