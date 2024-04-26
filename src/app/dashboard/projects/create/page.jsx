"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
function page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    const author = session.user.name;
    e.preventDefault();
    const title = e.target[0].value;
    const description = e.target[1].value;
    const content = e.target[2].value;

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
      if (res.status == 200) {
        setError("");
        router.replace("/dashboard/projects");
      }
    } catch (error) {
      setError("Something went wrong, try again");
      console.log(error);
    }
  };
  return (
    <div>
      <Navbar />
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="small-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="small-input"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="base-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Descripcion
          </label>
          <input
            type="text"
            name="description"
            id="base-input"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="large-input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Contenido
          </label>
          <input
            name="content"
            type="text"
            id="large-input"
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="text-red">{error}</div>
        <button
          type="submit"
          className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Crear proyecto
        </button>
      </form>
    </div>
  );
}

export default page;
