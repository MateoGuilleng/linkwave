"use client";

import React, { useState, useEffect } from "react";
import { Banner, Tabs, Dropdown, TextInput, Button } from "flowbite-react";
import UserProfile from "@/components/UserProfile";
import ProjectCard from "@/components/ProjectCard";
import { MdDashboard } from "react-icons/md";
import { MdAnnouncement } from "react-icons/md";
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
  HiAdjustments,
  HiClipboardList,
  HiUserCircle,
  HiOutlineArrowRight,
} from "react-icons/hi";

export default function UsersPage() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Estado para la categoría seleccionada
  const { user, isLoading } = useUser();

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
    setSelectedCategory(category === selectedCategory ? "" : category); // Toggle de categoría seleccionada
  };

  // Filtrar proyectos según la categoría seleccionada o mostrar todos si no hay categoría seleccionada
  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.projectType === selectedCategory)
    : projects;

  return (
    <div>
      <Navbar using={"feed"} />
      {!user && ( // Mostrar el Banner solo si no hay sesión activa
        <Banner>
          <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
            <div className="mx-auto flex items-center">
              <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                <MdAnnouncement className="mr-4 h-4 w-4" />
                <span className="[&_p]:inline">
                  You are currently in guest mode, create an account or sign in
                  if you want to access to any project&nbsp;
                  <Link
                    href="/signUp"
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

      <div className="bg-black w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#ffffff]">
        <aside className="hidden py-4 md:w-1/4 lg:w-1/6 md:block">
          <div className="sticky flex flex-col gap-2 p-4 text-sm  top-12">
            <a
              href="/dashboard"
              className="flex items-center px-3 py-2.5 font-bol bg-slate-200  text-black border rounded-full"
            >
              Project info
            </a>

            <a
              href=""
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full  "
            >
              People
            </a>
          </div>
        </aside>
        <div className="w-full mx-10">
          <div className="flex my-10">
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
          <Tabs aria-label="Full width tabs" className="flex" style="fullWidth">
            <Tabs.Item active title="For You:" icon={HiUserCircle}>
              <h2 className="pl-3 mb-4 text-2xl font-semibold m-10">
                Projects:
              </h2>
              <div className="grid  md:flex md:justify-between md:mx-12 grid-cols-3  justify-center ml-7 gap-5">
                <button
                  className={` h-24 sm:w-32 sm:h-32 w-full  lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                    !selectedCategory && "bg-blue-500" // Estilo activo si no hay categoría seleccionada
                  }`}
                  onClick={() => handleCategoryClick("")} // Manejar clic para mostrar todos los proyectos
                >
                  <div className="text-2xl sm:text-3xl">
                    <HiArchive />
                  </div>
                  <div className="mt-2 p-2 text-sm sm:text-base">All</div>
                </button>
                <button
                  className={` h-24 sm:w-32 sm:h-32 w-full  lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                    selectedCategory === "Aplication" && "bg-blue-500" // Estilo activo
                  }`}
                  onClick={() => handleCategoryClick("Aplication")}
                >
                  <div className="text-2xl sm:text-3xl">
                    <HiPaperClip />
                  </div>
                  <div className="mt-2 p-2 text-sm sm:text-base">
                    Aplication / Game
                  </div>
                </button>
                <button
                  className={` h-24 sm:w-32 sm:h-32 w-full  lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                    selectedCategory === "Art" && "bg-blue-500" // Estilo activo
                  }`}
                  onClick={() => handleCategoryClick("Art")}
                >
                  <div className="text-2xl sm:text-3xl">
                    <HiPencil />
                  </div>
                  <div className="mt-2 text-sm sm:text-base">Art</div>
                </button>
                <button
                  className={` h-24 sm:w-32 sm:h-32 w-full  lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                    selectedCategory === "General discussion" && "bg-blue-500" // Estilo activo
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
                  className={` h-24 sm:w-32 sm:h-32 w-full  lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                    selectedCategory === "Audio" && "bg-blue-500" // Estilo activo
                  }`}
                  onClick={() => handleCategoryClick("Audio")}
                >
                  <div className="text-2xl sm:text-3xl">
                    <HiOutlineSpeakerphone />
                  </div>
                  <div className="mt-2 text-sm sm:text-base">Audio</div>
                </button>
                <button
                  className={` h-24 sm:w-32 sm:h-32 w-full  lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                    selectedCategory === "Video" && "bg-blue-500" // Estilo activo
                  }`}
                  onClick={() => handleCategoryClick("Video")}
                >
                  <div className="text-2xl sm:text-3xl">
                    <HiCamera />
                  </div>
                  <div className="mt-2 text-sm sm:text-base">Video</div>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-10">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
              <h2 className="pl-3 mb-4 text-2xl font-semibold m-10">
                Featured users:
              </h2>
              <div className="flex max-w-screen-lg gap-6 m-10 overflow-x-scroll">
                {users.map((user) => (
                  <UserProfile key={user._id} user={user} />
                ))}
              </div>
            </Tabs.Item>
            <Tabs.Item title="Explore:" icon={MdDashboard}>
              <h2 className="pl-3 mb-4 text-2xl font-semibold m-10">
                Projects:
              </h2>
              <div className="grid  md:flex md:justify-between md:mx-12 grid-cols-3  justify-center ml-7 gap-5">
                <button
                  className={` h-24 sm:w-32 sm:h-32 w-full  lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                    !selectedCategory && "bg-blue-500" // Estilo activo si no hay categoría seleccionada
                  }`}
                  onClick={() => handleCategoryClick("")} // Manejar clic para mostrar todos los proyectos
                >
                  <div className="text-2xl sm:text-3xl">
                    <HiArchive />
                  </div>
                  <div className="mt-2 p-2 text-sm sm:text-base">All</div>
                </button>
                <button
                  className={` h-24 sm:w-32 sm:h-32 w-full  lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                    selectedCategory === "Aplication" && "bg-blue-500" // Estilo activo
                  }`}
                  onClick={() => handleCategoryClick("Aplication")}
                >
                  <div className="text-2xl sm:text-3xl">
                    <HiPaperClip />
                  </div>
                  <div className="mt-2 p-2 text-sm sm:text-base">
                    Aplication / Game
                  </div>
                </button>
                <button
                  className={` h-24 sm:w-32 sm:h-32 w-full  lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                    selectedCategory === "Art" && "bg-blue-500" // Estilo activo
                  }`}
                  onClick={() => handleCategoryClick("Art")}
                >
                  <div className="text-2xl sm:text-3xl">
                    <HiPencil />
                  </div>
                  <div className="mt-2 text-sm sm:text-base">Art</div>
                </button>
                <button
                  className={` h-24 sm:w-32 sm:h-32 w-full  lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                    selectedCategory === "General discussion" && "bg-blue-500" // Estilo activo
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
                  className={` h-24 sm:w-32 sm:h-32 w-full  lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                    selectedCategory === "Audio" && "bg-blue-500" // Estilo activo
                  }`}
                  onClick={() => handleCategoryClick("Audio")}
                >
                  <div className="text-2xl sm:text-3xl">
                    <HiOutlineSpeakerphone />
                  </div>
                  <div className="mt-2 text-sm sm:text-base">Audio</div>
                </button>
                <button
                  className={` h-24 sm:w-32 sm:h-32 w-full  lg:h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
                    selectedCategory === "Video" && "bg-blue-500" // Estilo activo
                  }`}
                  onClick={() => handleCategoryClick("Video")}
                >
                  <div className="text-2xl sm:text-3xl">
                    <HiCamera />
                  </div>
                  <div className="mt-2 text-sm sm:text-base">Video</div>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-10">
                {filteredProjects.map((project) => (
                  <Link
                    key={project._id}
                    href={`/${project.author}/${encodeURIComponent(
                      project.title
                    )}`}
                  >
                    <div className="relative rounded-lg overflow-hidden hover:transform hover:-translate-y-1 hover:shadow-lg transition duration-300 ease-in-out shadow-md bg-white dark:bg-gray-800">
                      <img
                        className="w-full h-60 object-cover"
                        src={project.banner}
                        alt={project.title}
                      />
                      <div className="absolute bottom-0 h-full left-0 p-4 bg-gradient-to-t from-black to-transparent w-full">
                        <div className="flex items-center">
                          <div className="ml-3 text-white absolute bottom-5">
                            <div className="text-lg font-bold">
                              {project.title}
                            </div>
                            <div className="text-xs">{project.author}</div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-5 right-5 px-5 py-2 bg-black bg-opacity-75 text-white text-xs font-semibold">
                        {project.projectType}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            
            </Tabs.Item>
            <Tabs.Item title="Settings" icon={HiAdjustments}>
              This is{" "}
              <span className="font-medium text-gray-800 dark:text-white">
                Settings tabs associated content
              </span>
              . Clicking another tab will toggle the visibility of this one for
              the next. The tab JavaScript swaps classes to control the content
              visibility and styling.
            </Tabs.Item>
            <Tabs.Item title="Contacts" icon={HiClipboardList}>
              This is{" "}
              <span className="font-medium text-gray-800 dark:text-white">
                Contacts tabs associated content
              </span>
              . Clicking another tab will toggle the visibility of this one for
              the next. The tab JavaScript swaps classes to control the content
              visibility and styling.
            </Tabs.Item>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
