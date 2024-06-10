"use client";

import Image from "next/image";
import Link from "next/link";
import Spline from "@splinetool/react-spline";
import infoCards from "./libs/InfoCard";

import { CheckCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  return (
    <main className="flex min-h-screen h-fit flex-col items-center justify-center relative">
      <div className="w-full">
        <Navbar /> 
      </div>
      
      <header
        id="home"
        className="flex flex-col-reverse md:flex-row w-full h-screen max-w-7xl items-center justify-center p-8 relative overflow-x-hidden"
      >
        <div className="w-full h-2/4 md:h-full md:w-2/5 flex flex-col justify-center items-center md:items-start gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black md:text-8xl">Projectfully</h1>
            <h2 className="text-md md:text-2xl">Start growing today!</h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-zinc-500">
            Projectfully is an social media app where you can share and give
            your opinion about any type of project around the world!
          </p>
          <div className="w-full flex items-center justify-center md:justify-start gap-4">
            <button
              onClick={() => router.push("/feed")}
              className="w-48 h-12 text-sm sm:text-base rounded bg-white text-black hover:bg-fuchsia-700 hover:text-white transition-colors"
            >
              Explore
            </button>
            <button
              onClick={() => router.push("/signUp")}
              className="w-48 h-12 text-sm sm:text-base rounded hover:bg-white hover:text-white hover:bg-opacity-5 transition-colors"
            >
              Sign Up 
            </button>
          </div>
        </div>

        <div className="w-max h-2/4 md:h-full md:w-3/5 items-center justify-center relative -z-10">
          <img src="https://cdn3d.iconscout.com/3d/premium/thumb/abstract-shape-7161374-5818776.png?f=webp" alt="Imagen" />
        </div>
      </header>

      <section
        id="about"
        className="h-fit min-h-screen w-full flex relative items-center justify-center p-8"
      >
        <div className="absolute -z-10 h-full w-full overflow-hidden">
          <Image
            src="/whirl.svg"
            fill
            className="absolute object-cover w-full overflow-visible sm:rotate-90"
            alt="Background Whirl"
          />
        </div>
        <div className="w-full h-full flex items-center justify-center flex-col gap-8 max-w-7xl">
          <h3 className="text-4xl md:text-5xl font-bold">
            Give and recieve feedback
          </h3>
          <div className="w-full grid grid-cols-1 grid-rows-3 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 gap-4 justify-between relative">
            {infoCards.map((infoCard) => {
              return (
                <InfoCard
                  key={infoCard.id}
                  Icon={infoCard.icon}
                  title={infoCard.title}
                >
                  <p className="text-sm sm:text-base text-center md:text-left">
                    {infoCard.bodyText}
                  </p>
                </InfoCard>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
function InfoCard({ title, Icon, children }) {
  return (
    <div className="w-full h-80 flex flex-col justify-around items-center p-8 bg-gray-900 rounded bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20">
      <div className="p-4 bg-fuchsia-700 rounded-full">
        <Icon />
      </div>
      <div>
        <h3 className="text-lg font-bold sm:text-xl">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}
