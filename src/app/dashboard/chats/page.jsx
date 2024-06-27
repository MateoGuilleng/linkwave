// app/dashboard/chats

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@auth0/nextjs-auth0/client";
import CustomDrawer from "@/components/sideBar";
import CustomAside from "@/components/SideBarPC";

import Navbar from "@/components/Navbar";
import { Button } from "flowbite-react";

function ProjectsPage() {
  const [userData, setUserData] = useState(null);
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/${user.email}`);
          const userData = await response.json();
          setUserData(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.error("Session or user is null or undefined.");
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar using={"projects"} />

      <div className="bg-gray-100 dark:bg-black text-black dark:text-white w-full flex flex-col gap-5 sm:px-5 md:px-10 md:flex-row ">
        <CustomAside />

        <main className="w-screen min-h-screen py-1 md:w-2/3 lg:w-3/4">
          <div className="md:p-4 mr-2">
            <div className="w-full px-6 pb-8 mt-8 sm:rounded-lg">
              <div className="flex items-center mb-10 w-full">
                <CustomDrawer />
                <h2 className="pl-3 mx-4 text-xl sm:text-2xl font-semibold">
                  Your chats:
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                {userData && userData.chats && userData.chats.length > 0 ? (
                  userData.chats.map((chat) => (
                    <Button
                      key={chat.chatId}
                      onClick={() => {
                        router.push(`/${user.email}/chats/${chat.chatId}`);
                      }}
                      className="p-4 mb-4 flex border-2 dark:hover:bg-white/5 bg-white dark:bg-black dark:border-white/50 border-black/50 hover:border-black text-black dark:text-white rounded-lg"
                    >
                      <img
                        src={chat.chatWithProfileImage}
                        alt={`${chat.chatWithNickName}'s profile`}
                        className="w-12 mr-8 h-12 rounded-full mt-2"
                      />
                      <div>
                        <p className="text-xl">
                          <strong>Chat with:</strong> {chat.chatWithNickName}
                        </p>
                        <p className="mb-5">{chat.chatWithEmail}</p>

                        <p className="text-xs">{chat.chatId}</p>
                      </div>
                    </Button>
                  ))
                ) : (
                  <p>No chats found.</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProjectsPage;
