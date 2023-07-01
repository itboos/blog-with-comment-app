// 暂未使用...
import {useState, useRef} from "react";
import type {NextApiRequest} from "next";
import type {MouseEvent} from "react";
import Head from "next/head";
// import clsx from 'clsx'
import useSWR, {mutate} from "swr";
// import toast from 'react-hot-toast'
// import redis from '../lib/redis'

type Feature = {
  id: string;
  title: string;
  score: number;
  ip: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Item({
  isFirst,
  isLast,
  isReleased,
  hasVoted,
  feature,
}: {
  isFirst: boolean;
  isLast: boolean;
  isReleased: boolean;
  hasVoted: boolean;
  feature: Feature;
}) {
  const upvote = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const res = await fetch("/api/vote", {
      body: JSON.stringify({
        id: feature.id,
        title: feature.title,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const {error} = await res.json();
    if (error) {
      return toast.error(error);
    }

    mutate("/api/features");
  };

  return (
    <div
      className={clsx(
        "p-6 mx-8 flex items-center border-t border-l border-r",
        isFirst && "rounded-t-md",
        isLast && "border-b rounded-b-md"
      )}
    >
      <button
        className={clsx(
          "ring-1 ring-gray-200 rounded-full w-8 min-w-[2rem] h-8 mr-4 focus:outline-none focus:ring focus:ring-blue-300",
          (isReleased || hasVoted) &&
            "bg-green-100 cursor-not-allowed ring-green-300"
        )}
        disabled={isReleased || hasVoted}
        onClick={upvote}
      >
        {isReleased ? "✅" : "👍"}
      </button>
      <h3 className="text font-semibold w-full text-left">{feature.title}</h3>
      <div className="bg-gray-200 text-gray-700 text-sm rounded-xl px-2 ml-2">
        {feature.score}
      </div>
    </div>
  );
}

export default function Roadmap({
  features,
  ip,
}: {
  features: Feature[];
  ip: string;
}) {
  const [isCreateLoading, setCreateLoading] = useState(false);
  const [isEmailLoading, setEmailLoading] = useState(false);
  const featureInputRef = useRef<HTMLInputElement>(null);
  const subscribeInputRef = useRef<HTMLInputElement>(null);

  const {data, error} = useSWR("/api/features", fetcher, {
    initialData: {features},
  });

  if (error) {
    toast.error(error);
  }

  const addFeature = async (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateLoading(true);

    const res = await fetch("/api/create", {
      body: JSON.stringify({
        title: featureInputRef?.current?.value ?? "",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const {error} = await res.json();
    setCreateLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    mutate("/api/features");
    if (featureInputRef.current) {
      featureInputRef.current.value = "";
    }
  };

  const subscribe = async (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailLoading(true);

    const res = await fetch("/api/subscribe", {
      body: JSON.stringify({
        email: subscribeInputRef?.current?.value ?? "",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const {error} = await res.json();
    setEmailLoading(false);

    if (error) {
      return toast.error(error);
    }

    toast.success("You are now subscribed to feature updates!");

    if (subscribeInputRef.current) {
      subscribeInputRef.current.value = "";
    }
  };

  return <div className="feature-page"></div>;
}

export async function getServerSideProps({req}: {req: NextApiRequest}) {
  const ip =
    req.headers["x-forwarded-for"] || req.headers["Remote_Addr"] || "NA";
  const features = (await redis.hvals("features"))
    .map((entry) => JSON.parse(entry))
    .sort((a, b) => {
      // Primary sort is score
      if (a.score > b.score) return -1;
      if (a.score < b.score) return 1;

      // Secondary sort is title
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;

      return 1;
    });

  return {props: {features, ip}};
}
