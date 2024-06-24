// app/[user]/page.jsx

"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { ref, set } from "firebase/database";
import { db } from "@/config/firebase";
import { Button } from "flowbite-react";
import ProjectCard from "@/components/ProjectCard";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Page() {
  const { user, isLoading } = useUser();
  const [userData, setUserData] = useState(null);
  const [sessionUserData, setSessionUserData] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [lastWord, setLastWord] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const iconMap = {
    Facebook: <FaFacebook size={24} />,
    Twitter: <FaTwitter size={24} />,
    Instagram: <FaInstagram size={24} />,
    LinkedIn: <FaLinkedin size={24} />,
    GitHub: <FaGithub size={24} />,
  };

  console.log("lastword", userData);
  console.log("sessionUserData", sessionUserData);

  const handleChatButtonClick = async () => {
    setLoading(true);

    try {
      // Check if a chat already exists between the users
      let chatId = null;
      const myEmail = user.email;

      console.log("PUTA", lastWord, myEmail);

      const response = await fetch(`/api/${lastWord}/${myEmail}/chats`, {
        method: "GET",
      });
      if (response.ok) {
        const existingChat = await response.json();

        console.log("existing chat", existingChat);
        if (existingChat && existingChat.chatId) {
          chatId = existingChat.chatId;
        }
      } else {
        throw new Error("Failed to check existing chat");
      }

      // If no existing chat, generate a new chat ID
      if (!chatId) {
        chatId = uuidv4();
      } else {
        router.push(`${user.email}/chats/${chatId}`);
      }

      if (!chatId) {
        const chatRef = ref(db, `chats/${chatId}`);
        await set(chatRef, {
          participants: [user.email, userData.email],
          createdAt: Date.now(),
        });
      }
      // Update both users with the new chat ID if it doesn't exist
      if (!chatId) {
        await updateUserWithChatId(lastWord, chatId);
      }
      if (!chatId) {
        await updateUserSessionWithChatId(user.email, chatId);
      }

      // Redirect to the chat page with the newly created or existing chat ID
      router.push(`${user.email}/chats/${chatId}`);
    } catch (error) {
      console.error("Error handling chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserWithChatId = async (email, chatId) => {
    const chatWithNickName = await sessionUserData.nickName;
    const chatWithEmail = await sessionUserData.email;
    const chatWithProfileImage = await sessionUserData.profile_image;
    console.log(chatWithNickName, chatWithEmail, chatWithProfileImage);

    try {
      const response = await fetch(`/api/${email}/chats`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatWithNickName,
          chatWithEmail,
          chatWithProfileImage,
          chatId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user ${email} with chatId ${chatId}`);
      }

      const updatedUserData = await response.json();
      console.log(
        `User ${email} updated with chatId ${chatId}:`,
        updatedUserData
      );
    } catch (error) {
      console.error(
        `Error updating user ${email} with chatId ${chatId}:`,
        error
      );
    }
  };

  const updateUserSessionWithChatId = async (email, chatId) => {
    const chatWithNickName = await userData.nickName;
    const chatWithEmail = await userData.email;
    const chatWithProfileImage = await userData.profile_image;

    console.log(chatWithNickName, chatWithEmail, chatWithProfileImage);
    try {
      const response = await fetch(`/api/${email}/chats`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatWithNickName,
          chatWithEmail,
          chatWithProfileImage,
          chatId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user ${email} with chatId ${chatId}`);
      }

      const updatedUserData = await response.json();
      console.log(
        `User ${email} updated with chatId ${chatId}:`,
        updatedUserData
      );
    } catch (error) {
      console.error(
        `Error updating user ${email} with chatId ${chatId}:`,
        error
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user && lastWord) {
        try {
          const response = await fetch(`/api/${lastWord}`);
          const userData = await response.json();
          setUserData(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }

      try {
        const response = await fetch(`/api/project/${lastWord}`);
        const userProjects = await response.json();
        setUserProjects(userProjects);
      } catch (error) {
        console.error("Error fetching user projects:", error);
      }
    };

    fetchData();
  }, [user, lastWord]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && lastWord) {
        try {
          const response = await fetch(`/api/${user.email}`);
          const userData = await response.json();
          setSessionUserData(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, [user, lastWord]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");
    const last = pathParts.filter((part) => part.trim() !== "").pop() || "";
    setLastWord(last);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-black min-h-screen">
      <Navbar />
      <div className="bg-white dark:bg-black dark:border-2 shadow-md rounded-lg p-6 max-w-4xl mx-auto mt-10">
        <div className="flex flex-col md:flex-row  md:items-start">
          <div className="justify-center flex sm:block">
            <img
              src={userData?.profile_image}
              alt={`${userData?.firstName} ${userData?.lastName}`}
              className="w-32 h-32 ml-2 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600"
            />
            {user?.email == userData?.email ? (
              <Button
                onClick={() => {
                  router.push("/dashboard");
                }}
                className="w-full mb-2"
              >
                Dashboard
              </Button>
            ) : (
              <div className="mt-4 w-full  sm:flex">
                <Button className="w-full mb-2">Follow</Button>
                <Button
                  onClick={handleChatButtonClick}
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Loading Chat..." : "Chat"}
                </Button>
              </div>
            )}
          </div>
          <div className="md:ml-6 mt-4 md:mt-0">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
              {userData?.nickName}{" "}
              {user?.email == userData?.email ? "(you)" : ""}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Profession: {userData?.profession}
            </p>
            <p className="text-gray-500 dark:text-gray-300 mt-2">
              {userData?.email}
            </p>
            <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userData?.socialProfiles?.map((profile, index) => (
                <button
                  key={index}
                  className="p-4 border rounded-lg shadow-md bg-black"
                  onClick={()=> router.push(`${profile.url}`)}
                >
                  <div className="flex items-center space-x-4">
                    {iconMap[profile.social]}
                    <h3 className="text-xl font-semibold text-white">
                      {profile.social}
                    </h3>
                  </div>
                  <p className="text-2xs text-white break-words">
                    {profile.url}
                  </p>
                </button>
              ))}
            </div>

            <p className="text-gray-800 dark:text-gray-200 mt-4">
              Bio: {userData?.bio}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-black dark:border-2 shadow-md rounded-lg p-6 max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Projects
        </h2>
        {userProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {userProjects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No projects found.</p>
        )}
      </div>
    </div>
  );
}
