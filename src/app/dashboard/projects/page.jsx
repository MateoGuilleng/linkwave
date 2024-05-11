"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

function ProjectsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
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

  const getProjects = async () => {
    try {
      const res = await fetch(`/api/project`, {
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

  const handleCreateProject = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar using={"projects"} />
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-zinc-900 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Create Project</h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-white"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="mt-1 p-2 border border-gray-700 bg-zinc-900 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-white"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="mt-1 p-2 border border-gray-300 bg-zinc-900 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-white"
                >
                  Content
                </label>
                <input
                  type="text"
                  id="content"
                  name="content"
                  className="mt-1 p-2 border border-gray-300 bg-zinc-900 rounded-md w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  onClick={handleProjectSubmit}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
            <div className="text-red">{error}</div>
          </div>
        </div>
      )}
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
                <button
                  className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={handleCreateProject}
                >
                  Create Project
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 w-full">
                {projects
                  ? projects.map((project) => (
                      <div
                        className="max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                        key={project._id}
                      >
                        <div className="m-4">
                          <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {project.title}
                          </h3>
                          <p className="pb-3 font-normal text-gray-700 dark:text-gray-400">
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
