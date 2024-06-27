"use client";

import React, { useState, useEffect } from "react";
import {
  Banner,
  Tabs,
  Dropdown,
  TextInput,
  Button,
  Select,
} from "flowbite-react";
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
import { toast } from "sonner";

export default function UsersPage() {
  const [projects, setProjects] = useState([]);
  const [projectsCopy, setProjectsCopy] = useState(null);

  const [users, setUsers] = useState([]);
  const [usersCopy, setUsersCopy] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const { user, isLoading } = useUser();
  const [userData, setUserData] = useState(null);
  const [userFollowingProjects, setUserFollowingProjects] = useState(null);

  const [searchQuery, setSearchQuery] = useState(null);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    console.log(selectedType);
  };

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
      .then((data) => {
        setProjects(data);
        setProjectsCopy(data);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  useEffect(() => {
    fetch("api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setUsersCopy(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    let queryFilteredProjects = [];
    let queryFilteredUsers = [];

    if (selectedType === "all") {
      queryFilteredProjects = projectsCopy.filter((project) =>
        project?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      queryFilteredUsers = usersCopy.filter((user) =>
        user.nickName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (selectedType === "project") {
      queryFilteredProjects = projectsCopy.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      queryFilteredUsers = []; // No mostrar usuarios
    } else if (selectedType === "user") {
      queryFilteredUsers = usersCopy.filter((user) =>
        user.nickName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      queryFilteredProjects = []; // No mostrar proyectos
    }

    setProjects(queryFilteredProjects);
    setUsers(queryFilteredUsers);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.projectType === selectedCategory)
    : projects;

  return (
    <div className="dark:bg-gray-950 bg-gray-100 text-black w-full">
      <Navbar using="feed" />
      {!user && (
        <Banner>
          <div className="flex w-full justify-between border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-4">
            <div className="mx-auto flex items-center">
              <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                <MdAnnouncement className="mr-4 h-4 w-4" />
                <span>
                  You are currently in guest mode, create an account or sign in
                  if you want to access any project&nbsp;
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

      <div className="w-full flex flex-col gap-5 px-3 md:px-8 lg:px-12">
        <div className="flex mt-10 gap-3">
          <CustomDrawerFeed
            followingUsers={userData?.following}
            followingProjects={userFollowingProjects?.projects}
          />
          <Select
            id="type"
            type="type"
            required
            name="type"
            value={selectedType}
            onChange={handleTypeChange}
            className="w-1/3"
          >
            <option value="" disabled>
              Filter
            </option>
            <option value="all">All</option>
            <option value="project">Project</option>
            <option value="user">User</option>
          </Select>
          <TextInput
            id="search"
            type="search"
            placeholder="Search for a nickname, user, or project title!"
            onChange={handleSearchChange}
            name="search"
            autoComplete="off"
            className="w-1/2"
          />
          <Button onClick={handleSearchSubmit}>
            <HiOutlineArrowRight className="h-6 w-6 text-black dark:text-white" />
          </Button>
        </div>

        {(selectedType === "all" || selectedType === "project") && (
          <div>
            <h2 className="pl-3 mb-4 text-2xl font-semibold mt-10 text-black dark:text-white">
              Top projects:
            </h2>

            <div className="grid md:flex md:justify-between md:mx-12 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 text-black dark:text-white">
              <button
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  !selectedCategory
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCategoryClick("")}
              >
                <div className="text-2xl sm:text-3xl">
                  <HiArchive />
                </div>
                <div className="mt-2 p-2 text-sm sm:text-base">All</div>
              </button>
              <button
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  selectedCategory === "Application"
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCategoryClick("Application")}
              >
                <div className="text-2xl sm:text-3xl">
                  <HiPaperClip />
                </div>
                <div className="mt-2 p-2 text-sm sm:text-base">
                  Application / Game
                </div>
              </button>
              <button
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  selectedCategory === "Art"
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCategoryClick("Art")}
              >
                <div className="text-2xl sm:text-3xl">
                  <HiPencil />
                </div>
                <div className="mt-2 text-sm sm:text-base">Art</div>
              </button>
              <button
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  selectedCategory === "General discussion"
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
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
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  selectedCategory === "Audio"
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCategoryClick("Audio")}
              >
                <div className="text-2xl sm:text-3xl">
                  <HiOutlineSpeakerphone />
                </div>
                <div className="mt-2 text-sm sm:text-base">Audio</div>
              </button>
              <button
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  selectedCategory === "Video"
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCategoryClick("Video")}
              >
                <div className="text-2xl sm:text-3xl">
                  <HiCamera />
                </div>
                <div className="mt-2 text-sm sm:text-base">Video</div>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
              {filteredProjects.map((project) => (
                <ProjectCard key={project?._id} project={project} />
              ))}
              <p className="m-5">
                {filteredProjects.length <= 0 ? "No projects found" : ""}
              </p>
            </div>
          </div>
        )}

        {(selectedType === "all" || selectedType === "user") && (
          <div>
            <h2 className="pl-3 mb-4 text-2xl font-semibold  dark:text-white text-black">
              Featured users:
            </h2>
            <div className="flex max-w-full gap-6 overflow-x-scroll pb-6">
              {users?.map((user) => (
                <UserProfile key={user._id} userData={user} />
              ))}
              <p className="m-5">{users.length <= 0 ? "No users found" : ""}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
