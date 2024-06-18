import React from "react";
import Image from "next/image";

import type { UserCardProps } from "@/app/interfaces";

const UserCard = ({ user }: UserCardProps) => {
  const { username, avatar_url, books } = user;
  const booksCount = Object.keys(books).length;

  const avatarUrl = avatar_url ? avatar_url : "/user.png";

  return (
    <div className="card group relative h-48 w-full rounded-xl bg-zinc-700 shadow-md shadow-black outline-none before:absolute before:left-0 before:top-0 before:size-full before:rounded-xl before:opacity-0 before:transition-opacity before:duration-500 after:absolute after:left-0 after:top-0 after:size-full after:rounded-xl after:opacity-0 after:transition-opacity after:duration-500 hover:shadow-xl hover:shadow-black hover:before:opacity-100">
      <div className="absolute inset-px z-[2] flex flex-col gap-2.5 rounded-xl bg-[#141414] p-2.5">
        <div className="relative flex size-full flex-col overflow-hidden rounded-md p-4">
          <div className="mb-3.5">{username}</div>

          <div className="mb-3.5 size-14">
            <Image
              height={56}
              width={56}
              src={avatarUrl}
              className="size-full rounded-full"
              alt="User avatar"
            />
          </div>

          <h3 className="text-xl">
            <div className="flex size-full items-center after:absolute after:inset-0">
              {booksCount} book{booksCount !== 1 && "s"}
            </div>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
