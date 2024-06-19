"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { Button } from "flowbite-react";
import ProjectCard from "@/components/ProjectCard";

export default function Page() {
  const { user, isLoading } = useUser();
  const [userData, setUserData] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [lastWord, setLastWord] = useState();

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
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");
    const last = pathParts.filter((part) => part.trim() !== "").pop() || "";
    console.log(last);
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
            <div className="mt-4 w-full  sm:flex">
              <Button className="w-full mb-2">Follow</Button>
              <Button className="w-full">Chat</Button>
            </div>
          </div>
          <div className="md:ml-6 mt-4 md:mt-0">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
              {userData?.firstName} {userData?.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {userData?.profession}
            </p>
            <p className="text-gray-500 dark:text-gray-300 mt-2">
              {userData?.email}
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href={`https://twitter.com/${userData?.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href={`https://linkedin.com/in/${userData?.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href={`https://github.com/${userData?.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <FaGithub size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Bio
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {userData?.bio?.length > 0 ? userData.bio : "No bio available."}
          </p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Member Since
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {new Date(userData?.createdAt).toLocaleDateString()}
          </p>
        </div>
        <h2 className=" my-4 text-2xl font-semibold">Projects:</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-10">
          {userProjects?.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
