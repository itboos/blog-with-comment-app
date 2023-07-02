import type {NextApiRequest, NextApiResponse} from "next";
import type {User, Comment} from "../interfaces";
import redis from "./redis";
// import getUser from './getUser'
// import clearUrl from "./clearUrl";

export default async function deleteComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {comment, user}: {comment: Comment; user: User} = req.body;

  if (!comment) {
    return res.status(400).json({message: "Missing parameter."});
  }

  if (!redis) {
    return res.status(500).json({message: "Failed to connect to redis."});
  }

  try {
    // verify user token
    if (!user) return res.status(400).json({message: "Invalid token."});
    comment.user.email = user.email;

    const isAdmin = process.env.NEXT_PUBLIC_AUTH0_ADMIN_EMAIL === user.email;
    const isAuthor = user.sub === comment.user.sub;

    if (!isAdmin && !isAuthor) {
      return res.status(400).json({message: "Need authorization."});
    }

    // delete
    // https://www.runoob.com/redis/lists-lrem.html
    await redis.lrem("comments", 0, JSON.stringify(comment));

    return res.status(200).end();
  } catch (err) {
    return res.status(400);
  }
}
