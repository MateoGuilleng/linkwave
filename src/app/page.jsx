"use client";

import Image from "next/image";
import Link from "next/link";
import Spline from "@splinetool/react-spline";
import infoCards from "./libs/InfoCard";
import pricingCards from "./libs/PricingCards";
import { CheckCheck } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";

export default function Home() {
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
            <h1 className="text-4xl font-black md:text-8xl">Insightful</h1>
            <h2 className="text-md md:text-2xl">Start growing today!</h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-zinc-500">
            Insightful is an AI-powered sales optimization tool that provides
            data-driven insights to boost sales performance.
          </p>
          <div className="w-full flex items-center justify-center md:justify-start gap-4">
            <button className="w-48 h-12 text-sm sm:text-base rounded bg-white text-black hover:bg-fuchsia-700 hover:text-white transition-colors">
              Try 7 days free!
            </button>
            <button className="w-48 h-12 text-sm sm:text-base rounded hover:bg-white hover:text-white hover:bg-opacity-5 transition-colors">
              Contact
            </button>
          </div>
        </div>

        <div className="w-full h-2/4 md:h-full md:w-3/5 flex items-center justify-center relative -z-10">
          <Spline
            className="w-full flex scale-[.25] sm:scale-[.35] lg:scale-[.5] items-center justify-center md:justify-start"
            scene="https://prod.spline.design/pvM5sSiYV2ivWraz/scene.splinecode"
          />
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
            No More Time Wasted!
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
      <section
        id="pricing"
        className="h-fit min-h-screen w-full flex flex-col items-center justify-center gap-8 p-8"
      >
        <h4 className="text-4xl md:text-5xl font-bold">Pricing</h4>
        <div className="grid grid-cols-1 grid-rows-2 sm:grid-rows-1 sm:grid-cols-2 items-center h-fit w-full max-w-3xl gap-8">
          {pricingCards.map((pricingCard) => {
            return (
              <PricingCard
                oneliner={pricingCard.oneliner}
                title={pricingCard.title}
                price={pricingCard.price}
                benefits={pricingCard.benefits}
                key={pricingCard.id}
              />
            );
          })}
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

function PricingCard({ title, price, benefits, oneliner }) {
  return (
    <div className="h-fit w-full rounded flex flex-col p-8 gap-8 bg-gray-700 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20">
      <div className="flex flex-col gap-2">
        <div>
          <h6 className="text-2xl">{title}</h6>
          <p className="text-sm text-zinc-500">{oneliner}</p>
        </div>
        <p className="text-4xl font-bold">
          ${price}{" "}
          <span className="text-sm font-normal text-zinc-500">/ Month</span>
        </p>
      </div>
      <button className="bg-fuchsia-700 rounded p-2 text-sm transition-colors hover:bg-fuchsia-800">
        Try 7 days free!
      </button>
      <div className="flex flex-col w-full gap-4">
        {benefits.map((benefit, i) => {
          return (
            <p
              key={i}
              className="text-sm text-zinc-500 flex items-center gap-2"
            >
              <span>
                <CheckCheck />
              </span>
              {benefit}
            </p>
          );
        })}
      </div>
    </div>
  );
}
