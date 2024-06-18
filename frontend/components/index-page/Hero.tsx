import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

const Hero = () => {
  const router = useRouter();
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";

  const getTitle = () =>
    isAuthenticated
      ? "Gun Violence Awareness Month"
      : "Join our club today to unlock special privileges";

  const getHeroImageSrc = () =>
    isAuthenticated
      ? "/gun-violence-awareness-month.jpeg"
      : "/monthly-event.png";

  const getParagraph = () =>
    isAuthenticated
      ? "Gun Violence Awareness Month was created to be a beacon of awareness, illuminating the impact of gun violence on our communities. We are fully committed to promoting gun safety in our community."
      : "Join our celebration of reading and exploration for all ages! Read books, connect with other readers, comment on your friends' reviews, make list of your favorite books and much more!";

  return (
    <section className="bg-black row py-9 container max-w-[inherit] flex-col md:flex-row gap-10 md:gap-16 2xl:gap-20">
      <Image
        src={getHeroImageSrc()}
        height={450}
        width={450}
        className="object-contain"
        alt="Hero Image"
      />
      <div className="flex flex-col 2xl:max-w-[40%]">
        <h1 className="pb-2 text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
          {getTitle()}
        </h1>
        <p className="mt-auto">{getParagraph()}</p>
        {!isAuthenticated && (
          <p
            className="pointer underline mt-10"
            onClick={() => router.push("auth")}
          >
            Join now
          </p>
        )}
      </div>
    </section>
  );
};

export default Hero;
