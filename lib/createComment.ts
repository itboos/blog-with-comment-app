import type {NextApiRequest, NextApiResponse} from "next";
import type {Comment} from "../interfaces";
import redis from "./redis";
import {nanoid} from "nanoid";
// import getUser from "./getUser";
import clearUrl from "./clearUrl";

export default async function createComments(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = clearUrl(req.headers.referer);
  const {text, user} = req.body;
  // const {authorization} = req.headers;
  // console.log("authorization1", authorization);
  if (!text) {
    return res.status(400).json({message: "Missing parameter."});
  }

  if (!redis) {
    return res
      .status(400)
      .json({message: "Failed to connect to redis client."});
  }

  try {
    // verify user token
    const isAuthenticated = user.name;
    if (!isAuthenticated) {
      return res.status(400).json({message: "Need authorization."});
    }

    const {name, picture, sub, email} = user;

    const comment: Comment = {
      id: nanoid(),
      created_at: Date.now(),
      url,
      text,
      user: {name, picture, sub, email},
    };
    // console.log("JSON.stringify(comment):", JSON.stringify(comment));

    // write data  // list
    // https://docs.upstash.com/redis/sdks/javascriptsdk/getstarted
    await redis.lpush("comments", JSON.stringify(comment));
    // const data = await redis.lrange("comments", 0, 100);
    // console.log(data);

    return res.status(200).json(comment);
  } catch (_) {
    console.error(_);
    return res.status(400).json({message: "Unexpected error occurred."});
  }
}
