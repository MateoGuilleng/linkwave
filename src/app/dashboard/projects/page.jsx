"use client";

import { useState, useEffect } from "react";
import { initFlowbite } from "flowbite";
import Link from "next/link";
import { FaPlus, FaInfo } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Dropdown,
  Button,
  Modal,
  Checkbox,
  Label,
  TextInput,
} from "flowbite-react";
function ProjectsPage() {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);

  const [error, setError] = useState();

  const handleProjectSubmit = async (e) => {
    const author = session?.user?.email;
    e.preventDefault();

    const formData = new FormData(e.target.closest("form")); // Accede al formulario más cercano al elemento que desencadenó el evento

    const title = formData.get("title");
    const description = formData.get("description");
    const content = formData.get("content");

    if (!title || !content) {
      setError("Title and content are required");
      return;
    }

    try {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          content,
          author,
        }),
      });
      if (res.status === 400) {
        setError("The name of the project is already in use");
      }
      if (res.status === 200) {
        setError("");
        router.push(`/dashboard/projects/${title}`);
      }
    } catch (error) {
      setError("Something went wrong, try again");
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      getProjects();
    }
  }, [status]);
  const author = session?.user?.email;
  const getProjects = async () => {
    try {
      const res = await fetch(`/api/project/${author}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        console.error("Failed to fetch projects:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  function onCloseModal() {
    setOpenModal(false);
  }

  return (
    <div>
      <Navbar using={"projects"} />

      <div className="bg-black w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#ffffff]">
        <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
          <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
            <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
            <a
              href="/dashboard"
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full"
            >
              Dashboard
            </a>
            <a
              href=""
              className="flex items-center px-3 py-2.5 font-bold bg-slate-200 text-black border rounded-full"
            >
              Projects
            </a>
            <a
              href="account"
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full"
            >
              Account Settings
            </a>
            <a
              href="notifications"
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full"
            >
              Notifications
            </a>
          </div>
        </aside>
        <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
          <div className="p-2 md:p-4 w-full">
            <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
              <div className="flex justify-between mb-10 w-full">
                <h2 className="pl-6 text-2xl font-bold sm:text-xl">
                  Your projects:
                </h2>

                <>
                  <Button
                    className="hover:border-white bg-green-700"
                    onClick={() => setOpenModal(true)}
                  >
                    <div className="flex gap-5 align-middle">
                      <div>Create new project </div>
                      <div>
                        <FaPlus />
                      </div>
                    </div>
                  </Button>
                  <Modal show={openModal} onClose={() => setOpenModal(false)}>
                    <Modal.Header>New project</Modal.Header>
                    <Modal.Body>
                      <form
                        onSubmit={handleProjectSubmit}
                        className="flex max-w-md flex-col gap-4"
                      >
                        <div>
                          <div className="mb-2 block">
                            <Label htmlFor="title" value="Title:" />
                          </div>
                          <TextInput
                            id="title"
                            name="title"
                            type="title"
                            placeholder="Title of my project"
                            required
                            autoComplete="off" // Evitar autocompletar
                          />
                        </div>
                        <div>
                          <div className="mb-2 block">
                            <Label htmlFor="description" value="Description" />
                          </div>
                          <TextInput
                            id="description"
                            type="description"
                            name="description"
                            required
                            autoComplete="off" // Evitar autocompletar
                          />
                        </div>
                        <div>
                          <div className="mb-2 block">
                            <Label htmlFor="content" value="Content:" />
                          </div>
                          <TextInput
                            id="content"
                            type="content"
                            name="content"
                            required
                            autoComplete="off" // Evitar autocompletar
                          />
                        </div>

                        <Button type="submit">Submit</Button>
                      </form>
                    </Modal.Body>
                  </Modal>
                </>
              </div>

              <div className="grid grid-cols-1 gap-4 w-full">
                {projects
                  ? projects.map((project) => (
                      <div
                        className="max-w-sm w-full bg-transparent border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                        key={project._id}
                      >
                        <div className="m-4">
                          <h3 className="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
                            {project.title}
                          </h3>
                          <p className="pb-3 font-normal text-gray-400 dark:text-gray-400">
                            {project.description}
                          </p>
                          <p className="pb-3">{project.content}</p>
                          <a
                            href={`/dashboard/projects/${project.title}`}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            View project
                            <svg
                              className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 10"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))
                  : "cargando..."}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProjectsPage;
