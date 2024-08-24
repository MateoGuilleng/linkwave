"use client";

import Link from "next/link";
import AOS from "aos"; // Importa AOS
import { useEffect } from "react";
import "aos/dist/aos.css"; // Importa los estilos de AOS
import { FaStar } from "react-icons/fa";
import { useUser } from "@auth0/nextjs-auth0/client"; // Importa useUser

const ProjectCard = ({ project }) => {
  const { user } = useUser(); // Obtén el estado de autenticación

  useEffect(() => {
    AOS.init({
      duration: 1000, // Duración de la animación en milisegundos
    });
  }, []);

  // Determina el href basado en si el usuario está autenticado
  const href = user
    ? `/${project.author}/${encodeURIComponent(project.title)}`
    : "/";

  return (
    <Link key={project._id} href={href}>
      <div
        data-aos="fade-up"
        className="relative rounded-lg overflow-hidden hover:transform hover:-translate-y-1 hover:shadow-lg transition duration-300 ease-in-out shadow-md bg-white dark:bg-gray-800"
      >
        <img
          className="w-full h-60 object-cover"
          src={project.banner}
          alt={project.title}
        />
        <div className="absolute bottom-0 h-full left-0 p-4 bg-gradient-to-t dark:from-black from-white to-transparent w-full">
          <div className="flex items-center">
            <div className="ml-3 text-white absolute bottom-5 flex">
              <img
                src={project.authorImage}
                alt={`${project.author}'s profile`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col ml-4 dark:text-white text-black">
                <div className="text-lg font-bold dark:text-white text-black">
                  {project.title}
                </div>
                <div className="text-xs dark:text-white text-black">
                  {project.author}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-5 left-5 px-5 py-2 bg-black bg-opacity-75 text-white text-xs font-semibold">
          <div className="flex">
            <FaStar className="self-center" />{" "}
            <p className="self-center pl-2">{project.stars}</p>
          </div>
        </div>
        <div className="absolute top-5 right-5 px-5 py-2 bg-black bg-opacity-75 text-white text-xs font-semibold">
          {project.projectType}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
