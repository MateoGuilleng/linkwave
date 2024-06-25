"use client";

import React, { useState, useEffect } from "react";
import { Banner, Tabs, Dropdown, TextInput, Button } from "flowbite-react";
import UserProfile from "@/components/UserProfile";
import ProjectCard from "@/components/ProjectCard";
import { MdDashboard, MdAnnouncement } from "react-icons/md";

import CustomDrawerFeed from "@/components/sideBarFeed";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  HiArchive,
  HiPaperClip,
  HiPencil,
  HiGlobe,
  HiOutlineSpeakerphone,
  HiCamera,
  HiX,
  HiOutlineArrowRight,
} from "react-icons/hi";

export default function UsersPage() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { user, isLoading } = useUser();
  const [userData, setUserData] = useState(null);
  const [userFollowingProjects, setUserFollowingProjects] = useState(null);

  console.log(userData);

  const email = user?.email;
  useEffect(() => {
    if (email) {
      fetchData();
    }
  }, [user]);

  console.log(userFollowingProjects);

  const fetchData = async () => {
    if (user) {
      try {
        const response = await fetch(`/api/${email}`);
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      try {
        const response = await fetch(`/api/${email}/projects`);
        const userFollowingProjects = await response.json();
        setUserFollowingProjects(userFollowingProjects);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      console.error("Session or user is null or undefined.");
    }
  };

  useEffect(() => {
    fetch("api/project")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  useEffect(() => {
    fetch("api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.projectType === selectedCategory)
    : projects;

  return (
    <div>
      <Navbar using={"feed"} />
      {!user && (
        <Banner>
          <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
            <div className="mx-auto flex items-center">
              <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                <MdAnnouncement className="mr-4 h-4 w-4" />
                <span className="[&_p]:inline">
                  You are currently in guest mode, create an account or sign in
                  if you want to access to any project&nbsp;
                  <Link
                    href="/api/auth/login"
                    className="inline font-medium text-cyan-600 underline decoration-solid underline-offset-2 hover:no-underline dark:text-cyan-500"
                  >
                    Sign up
                  </Link>
                </span>
              </p>
            </div>
            <Banner.CollapseButton
              color="gray"
              className="border-0 bg-transparent text-gray-500 dark:text-gray-400"
            >
              <HiX className="h-4 w-4" />
            </Banner.CollapseButton>
          </div>
        </Banner>
      )}

      <div className="bg-black w-full flex flex-col gap-5 px-3 md:px-8 lg:px-12 text-white">
        <div className="w-full md:w-9/12">
          <div className="flex my-10 gap-3">
            <CustomDrawerFeed followingUsers={userData?.following} followingProjects={userFollowingProjects?.projects} />
            <Dropdown
              label="Filter"
              className="dark:bg-black border-2 border-white/35"
              size="lg"
            >
              <Dropdown.Item>Projects</Dropdown.Item>
              <Dropdown.Item>Users</Dropdown.Item>
              <Dropdown.Item>Organizations</Dropdown.Item>
              <Dropdown.Item>Help requests</Dropdown.Item>
            </Dropdown>
            <TextInput
              id="search"
              className="w-full"
              type="search"
              placeholder="Search for a specific author, project or organization!"
              name="search"
              autoComplete="off"
            />
            <Button>
              <HiOutlineArrowRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="grid md:flex md:justify-between md:mx-12 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            <button
              className={`h-24 sm:h-32 w-full lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                !selectedCategory && "bg-blue-500"
              }`}
              onClick={() => handleCategoryClick("")}
            >
              <div className="text-2xl sm:text-3xl">
                <HiArchive />
              </div>
              <div className="mt-2 p-2 text-sm sm:text-base">All</div>
            </button>
            <button
              className={`h-24 sm:h-32 w-full lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                selectedCategory === "Aplication" && "bg-blue-500"
              }`}
              onClick={() => handleCategoryClick("Aplication")}
            >
              <div className="text-2xl sm:text-3xl">
                <HiPaperClip />
              </div>
              <div className="mt-2 p-2 text-sm sm:text-base">
                Application / Game
              </div>
            </button>
            <button
              className={`h-24 sm:h-32 w-full lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                selectedCategory === "Art" && "bg-blue-500"
              }`}
              onClick={() => handleCategoryClick("Art")}
            >
              <div className="text-2xl sm:text-3xl">
                <HiPencil />
              </div>
              <div className="mt-2 text-sm sm:text-base">Art</div>
            </button>
            <button
              className={`h-24 sm:h-32 w-full lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                selectedCategory === "General discussion" && "bg-blue-500"
              }`}
              onClick={() => handleCategoryClick("General discussion")}
            >
              <div className="text-2xl sm:text-3xl">
                <HiGlobe />
              </div>
              <div className="mt-2 text-sm sm:text-base">
                General discussion
              </div>
            </button>
            <button
              className={`h-24 sm:h-32 w-full lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                selectedCategory === "Audio" && "bg-blue-500"
              }`}
              onClick={() => handleCategoryClick("Audio")}
            >
              <div className="text-2xl sm:text-3xl">
                <HiOutlineSpeakerphone />
              </div>
              <div className="mt-2 text-sm sm:text-base">Audio</div>
            </button>
            <button
              className={`h-24 sm:h-32 w-full lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                selectedCategory === "Video" && "bg-blue-500"
              }`}
              onClick={() => handleCategoryClick("Video")}
            >
              <div className="text-2xl sm:text-3xl">
                <HiCamera />
              </div>
              <div className="mt-2 text-sm sm:text-base">Video</div>
            </button>
          </div>
          <h2 className="pl-3 mb-4 text-2xl font-semibold mt-10">
            Top projects:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>

          <h2 className="pl-3 mb-4 text-2xl font-semibold mt-10">
            Featured users:
          </h2>

          <div className="flex max-w-full gap-6 overflow-x-scroll pb-6">
            {users.map((user) => (
              <UserProfile key={user._id} userData={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
