"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@auth0/nextjs-auth0/client";
import CustomDrawer from "@/components/sideBar";
import CustomAside from "@/components/SideBarPC";
import Navbar from "@/components/Navbar";

function Docs() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  console.log(user);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar using={"projects"} />

      <div className="bg-gray-100 dark:bg-black w-full flex flex-col gap-5 sm:px-5 md:px-10 md:flex-row text-black dark:text-white">
        <CustomAside />

        <main className="w-screen min-h-screen py-1 md:w-2/3 lg:w-3/4">
          <div className="md:p-4 mr-2">
            <div className="w-full px-6 pb-8 mt-8 sm:rounded-lg">
              <div className="flex items-center mb-10 w-full">
                <CustomDrawer />
                <h2 className="pl-3 mx-4 text-xl sm:text-2xl font-semibold">
                  Contact us
                </h2>
              </div>
              {/* Contact Information Section */}
              <div className="mb-8">
                <p className="text-lg mb-2">
                  You can contact us through our emails:
                </p>
                <ul className="list-disc list-inside mb-4">
                  <li>
                    <a
                      href="mailto:mmguilleng@cpsih.edu.co"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      mmguilleng@cpsih.edu.co
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:saherandezp@cpsih.edu.co"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      saherandezp@cpsih.edu.co
                    </a>
                  </li>
                </ul>
                <p className="text-lg mb-2">
                  Or visit our project repository on GitHub:
                </p>
                <a
                  href="https://github.com/MateoGuilleng/linkwave"
                  className="text-blue-600 dark:text-blue-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Docs;
