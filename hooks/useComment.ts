import type {Comment} from "../interfaces";
import React, {useState} from "react";
import useSWR from "swr";
import {useUser} from "@auth0/nextjs-auth0/client";
// import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function useComments() {
  const [text, setText] = useState("");
  const {user, isLoading} = useUser();
  const {data: comments, mutate} = useSWR<Comment[]>("/api/comment", fetcher, {
    fallbackData: [],
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = "testToken";
    try {
      await fetch("/api/comment", {
        method: "POST",
        body: JSON.stringify({text, user}),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setText("");
      await mutate();
    } catch (err) {
      console.log(err);
    }
  };

  // https://github.com/vercel/next.js/pull/51874 目前 2023.07.02 delete 方法 body 未传的 bug
  const onDelete = async (comment: Comment) => {
    const token = "testToken";

    try {
      // await fetch("/api/comment", {
      await fetch("/api/deleteComment", {
        // method: "DELETE",
        method: "POST",
        body: JSON.stringify({comment, user}),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // search...
      await mutate();
    } catch (err) {
      console.log(err);
    }
  };

  return {text, setText, comments, onSubmit, onDelete};
}
