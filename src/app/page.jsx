"use client";

import Image from "next/image";
import infoCards from "./libs/InfoCard";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import AOS from "aos"; // Importa AOS
import "aos/dist/aos.css"; // Importa los estilos de AOS

export default function Home() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [userData, setUserData] = useState(null);

  const email = user?.email;

  useEffect(() => {
    AOS.init({
      duration: 1000, // Duración de la animación en milisegundos
    });
    const fetchData = async () => {
      if (email) {
        const promise = () =>
          new Promise(async (resolve, reject) => {
            try {
              const response = await fetch(`/api/checkUser/${email}`);
              const { userExists } = await response.json();

              if (!userExists) {
                await createUser();
              } else {
                fetchUserData();
              }

              resolve(userExists); // Resolve with userExists value
            } catch (error) {
              console.error("Error fetching user data:", error);
              reject(error);
            }
          });

        toast.promise(promise(), {
          loading: "Checking user data...",
          success: (userExists) => {
            if (!userExists) {
              return "User created successfully";
            } else {
              return "User data checked successfully";
            }
          },
          error: "Failed to fetch user data",
        });
      }
    };

    fetchData();
  }, [email]); // Dependencia única para useEffect

  const createUser = async () => {
    const nickName = user.nickname;
    const profile_image = user.picture;

    try {
      const response = await fetch(`/api/${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickName, profile_image }),
      });

      const newUser = await response.json();
      setUserData(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/${email}`);
      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <main className="flex min-h-screen h-fit flex-col items-center justify-center relative bg-gray-50 dark:bg-black">
      <div className="w-full">
        <Navbar />
      </div>

      <header
        id="home"
        data-aos="fade-down"
        className="flex flex-col-reverse md:flex-row w-full h-screen max-w-7xl items-center justify-center p-8 relative overflow-x-hidden"
      >
        <div className="w-full h-2/4 md:h-full md:w-2/5 flex flex-col justify-center items-center md:items-start gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black md:text-8xl text-gray-900 dark:text-white">
              Linkwave
            </h1>
            <h2 className="text-md md:text-2xl text-gray-700 dark:text-gray-300">
              Start growing today!
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-gray-600 dark:text-gray-400">
            Linkwave is a social media app where you can share and give your
            opinion about any type of project around the world!
          </p>
          <div className="w-full flex items-center justify-center md:justify-start gap-4">
            <button
              onClick={() => router.push("/feed")}
              className="w-48 h-12 text-sm sm:text-base rounded bg-fuchsia-600 text-white hover:bg-fuchsia-700 transition-colors dark:bg-fuchsia-700 dark:hover:bg-fuchsia-800"
            >
              Explore
            </button>

            <button
              onClick={() => router.push("/api/auth/login")}
              className="w-48 h-12 text-sm sm:text-base rounded border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:border-gray-600 transition-colors"
            >
              Log in
            </button>
          </div>
        </div>

        <div className="w-max h-2/4 md:h-full md:w-3/5 items-center justify-center relative">
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/abstract-shape-7161374-5818776.png?f=webp"
            alt="Imagen"
            className="object-contain"
          />
        </div>
      </header>
      <section
        id="about"
        data-aos="fade-up"
        className="h-fit min-h-screen w-full flex relative items-center justify-center p-8 bg-white dark:bg-black"
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
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Give and receive feedback
          </h3>
          <div
            data-aos="fade-right"
            className="w-full grid grid-cols-1 grid-rows-3 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 gap-4 justify-between relative "
          >
            {infoCards.map((infoCard) => (
              <InfoCard
                key={infoCard.id}
                Icon={infoCard.icon}
                title={infoCard.title}
              >
                <p className="text-sm sm:text-base text-center md:text-left text-gray-700 dark:text-gray-300">
                  {infoCard.bodyText}
                </p>
              </InfoCard>
            ))}
          </div>
        </div>
      </section>
    </main>
  );

  function InfoCard({ title, Icon, children }) {
    return (
      <div className="w-full h-80 flex flex-col justify-around items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl">
        <div className="p-4 bg-fuchsia-600 rounded-full text-white">
          <Icon />
        </div>
        <div>
          <h3 className="text-lg font-bold sm:text-xl text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="text-gray-700 dark:text-gray-300">{children}</div>
      </div>
    );
  }
}
