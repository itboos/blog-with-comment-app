import type {Comment} from "../interfaces";
import React, {useState} from "react";
import useSWR from "swr";
import {useUser} from "@auth0/nextjs-auth0/client";
import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";

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

  const onDelete = async (comment: Comment) => {
    // const token = await getAccessTokenSilently();

    const token = "testToken";

    try {
      await fetch("/api/comment", {
        method: "DELETE",
        body: JSON.stringify({comment}),
        headers: {
          // Authorization: token,
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
