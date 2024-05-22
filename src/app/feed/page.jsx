"use client";

import React, { useState, useEffect } from "react";
import { Banner } from "flowbite-react";
import { MdAnnouncement } from "react-icons/md";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import {
  HiArchive,
  HiPaperClip,
  HiPencil,
  HiGlobe,
  HiOutlineSpeakerphone,
  HiCamera,
  HiX,
} from "react-icons/hi";

export default function UsersPage() {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Estado para la categoría seleccionada
  const { data: session } = useSession();

  useEffect(() => {
    fetch("api/project")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
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
      {!session?.user && ( // Mostrar el Banner solo si no hay sesión activa
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

      <h2 className="pl-3 mb-4 text-2xl font-semibold m-10">Search:</h2>
      <div className="flex w-full justify-evenly">
        <button
          className={`flex-shrink-0 w-40 h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
            !selectedCategory && "bg-blue-500" // Estilo activo si no hay categoría seleccionada
          }`}
          onClick={() => handleCategoryClick("")} // Manejar clic para mostrar todos los proyectos
        >
          <div className="text-3xl">
            <HiArchive />
          </div>
          <div className="mt-2 p-2">All</div>
        </button>
        <button
          className={`flex-shrink-0 w-40 h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
            selectedCategory === "Aplication" && "bg-blue-500" // Estilo activo
          }`}
          onClick={() => handleCategoryClick("Aplication")}
        >
          <div className="text-3xl">
            <HiPaperClip />
          </div>
          <div className="mt-2 p-2">Aplication / Game</div>
        </button>
        <button
          className={`flex-shrink-0 w-40 h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
            selectedCategory === "Art" && "bg-blue-500" // Estilo activo
          }`}
          onClick={() => handleCategoryClick("Art")}
        >
          <div className="text-3xl">
            <HiPencil />
          </div>
          <div className="mt-2">Art</div>
        </button>
        <button
          className={`flex-shrink-0 w-40 h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
            selectedCategory === "General discussion" && "bg-blue-500" // Estilo activo
          }`}
          onClick={() => handleCategoryClick("General discussion")}
        >
          <div className="text-3xl">
            <HiGlobe />
          </div>
          <div className="mt-2">General discussion</div>
        </button>
        <button
          className={`flex-shrink-0 w-40 h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
            selectedCategory === "Audio" && "bg-blue-500" // Estilo activo
          }`}
          onClick={() => handleCategoryClick("Audio")}
        >
          <div className="text-3xl">
            <HiOutlineSpeakerphone />
          </div>
          <div className="mt-2">Audio</div>
        </button>
        <button
          className={`flex-shrink-0 w-40 h-40 bg-white/10 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-white ${
            selectedCategory === "Video" && "bg-blue-500" // Estilo activo
          }`}
          onClick={() => handleCategoryClick("Video")}
        >
          <div className="text-3xl">
            <HiCamera />
          </div>
          <div className="mt-2">Video</div>
        </button>
      </div>

      <h2 className="pl-3 mb-4 text-2xl font-semibold m-10">Projects:</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-10">
        {filteredProjects.map((project) => (
          <Link key={project._id} href={`/${project.title}`}>
            <div className="relative rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800">
              <img
                className="w-full h-60 object-cover"
                src={project.banner}
                alt={project.title}
              />
              <div className="absolute bottom-0 h-full left-0 p-4 bg-gradient-to-t from-black to-transparent w-full">
                <div className="flex items-center">
                  <div className="ml-3 text-white absolute bottom-5">
                    <div className="text-lg font-bold">{project.title}</div>
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
    </div>
  );
}
