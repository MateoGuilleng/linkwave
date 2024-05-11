"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function UsersPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("api/project")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  return (
    <div>
      <Navbar using={"feed"} />
      <h2 className="pl-3 mb-4 text-2xl font-semibold m-10">
        Proyectos destacados
      </h2>
      <div className="flex overflow-x-auto m-10">
        <div className="flex gap-4" style={{ width: "fit-content" }}>
          {projects.map((project) => (
            <div
              key={project._id}
              className="max-w-xs"
              style={{ width: "400px" }} // Ancho ajustable de la tarjeta
            >
              <div className="max-w-md overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                <img
                  className="object-cover w-full h-60"
                  src="https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                  alt="Article"
                />
                <div className="p-4">
                  <div>
                    <span className="text-xs font-medium text-blue-600 uppercase dark:text-blue-400">
                      TAG TAG TAG
                    </span>
                    <a
                      href="#"
                      className="block mt-2 text-lg font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600 hover:underline"
                      tabIndex={0}
                      role="link"
                    >
                      {project?.title}
                    </a>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 overflow-hidden overflow-ellipsis">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center">
                    <img
                      className="object-cover h-8 w-8 rounded-full mr-2"
                      src="https://images.unsplash.com/photo-1586287011575-a23134f797f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=48&q=60"
                      alt="Avatar"
                    />
                    <a
                      href="#"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                      tabIndex={0}
                      role="link"
                    >
                      {project.author}
                    </a>
                  </div>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {project.createdAt}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <h2 className="pl-3 mb-4 text-2xl font-semibold m-10">
        Proyectos del dia
      </h2>
    </div>
  );
}
