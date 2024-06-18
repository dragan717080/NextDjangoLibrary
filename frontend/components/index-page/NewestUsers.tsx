import React from "react";

import { useUsersStore } from "@/app/store/zustandStore";

import UserCard from "./UserCard";

const NewestUsers = () => {
  const { users } = useUsersStore();

  return (
    <section className="container pb-12 pt-10">
      <h2 className="from-primary mx-auto w-fit bg-gradient-to-r to-[#819EA7] bg-clip-text pb-8 text-3xl font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl">
        Newest Users
      </h2>
      <div className="cards grid gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {users.slice(0, 9).map((user, index) => (
          <UserCard user={user} key={index} />
        ))}
      </div>
    </section>
  );
};

export default NewestUsers;
