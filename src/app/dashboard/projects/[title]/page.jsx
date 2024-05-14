"use client";

import { useEffect, useState } from "react";
import { initFlowbite } from "flowbite";
import Navbar from "@/components/Navbar";
import {
  FaArrowLeft,
  FaPlus,
  FaWindowClose,
  FaInfo,
  FaEdit,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Link } from "lucide-react";
import { useSession } from "next-auth/react";

function Page() {
  const { data: session, status } = useSession();
  const [lastWord, setLastWord] = useState("");
  const [project, setProject] = useState({});
  const author = session?.user?.email;
  const [formFilled, setFormFilled] = useState(false);


  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");
    const last = pathParts.filter((part) => part.trim() !== "").pop() || "";
    setLastWord(last);
  }, []);


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = session.user.email; // Asegúrate de tener acceso a la dirección de correo electrónico del usuario
    let title = formData.get("title");
    let description = formData.get("description");
    let content = formData.get("content");

    // Verificar si el campo está vacío y reemplazar con el valor del placeholder
    if (!title.trim()) {
      title = e.target.querySelector("#title").getAttribute("placeholder");
    }
    if (!description.trim()) {
      description = e.target.querySelector("#description").getAttribute("placeholder");
    }
    if (!content.trim()) {
      content = e.target.querySelector("#content").getAttribute("placeholder");
    }

    try {
      const res = await fetch(`/api/project/specificProject/projectAdmin/${lastWord}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          content,
        }),
      });

      // Comprobar si la solicitud fue exitosa
      if (res.ok) {
        // Convertir la respuesta a formato JSON
        const data = await res.json();
        // Imprimir la respuesta en la consola
        console.log("Respuesta del servidor:", data);

        router.back()
        // Mostrar el modal
        setShowModal(true);
        // Reiniciar la página después de 2 segundos
        setTimeout(() => {
          router.refresh();
        }, 2000);
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      } else {
        // Imprimir un mensaje de error si la solicitud no fue exitosa
        console.error("Error en la solicitud:", res.statusText);
      }
    } catch (error) {
      console.log("Error de red:", error);
    }
  };
  const handleChange = () => {
    const formFields = document.querySelectorAll("form input, form textarea");
    for (const field of formFields) {
      if (field.value) {
        setFormFilled(true);
        return;
      }
    }
    setFormFilled(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      getProject();
    }
  }, [status]);

  const router = useRouter();

  const getProject = async () => {
    try {
      const res = await fetch(`/api/project/specificProject/${lastWord}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      } else {
        console.error("Failed to fetch projects:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };

  const handleDelete = async () => {
    console.log("lol");
    try {
      const res = await fetch(`/api/project/specificProject/${lastWord}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        router.back();
      } else {
        console.error("Failed to fetch projects:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };
  const handleAddFiles = () => {};

  return (
    <div>
      <Navbar />

      <div className="bg-black w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#ffffff]">
        <div className="w-full">
          <div className="m-10 text-2xl border-b pb-5 flex gap-6 justify-between border-indigo-100 font-semibold">
            <div className="flex gap-10">
              <button onClick={router.back}>
                <FaArrowLeft />{" "}
              </button>{" "}
              <h2>{project?.title}</h2>{" "}
              <h3 className="text-gray-400 text-xl">
                {" "}
                {project?.description}{" "}
              </h3>
            </div>{" "}
            <div className="flex gap-5">
              <>
                {/* Modal toggle */}
                <button
                  data-modal-target="crud-modal"
                  data-modal-toggle="crud-modal"
                  className="block text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  <FaEdit />
                </button>
                {/* Main modal */}
                <div
                  id="crud-modal"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                  <div className="relative p-4 w-full max-w-md max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      {/* Modal header */}
                      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Create New Product
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          data-modal-toggle="crud-modal"
                        >
                          <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>
                      {/* Modal body */}
                      <form
                        onSubmit={handleEditSubmit}
                        onChange={handleChange}
                        className="p-4 md:p-5"
                      >
                        <div className="grid gap-4 mb-4 grid-cols-2">
                          <div className="col-span-2">
                            <label
                              htmlFor="title"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Title
                            </label>
                            <input
                              type="text"
                              name="title"
                              id="title"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder={project?.title}
                            />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <label
                              htmlFor="price"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Description
                            </label>
                            <input
                              type="text"
                              name="description"
                              id="description"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder={project?.description}
                            />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <label
                              htmlFor="category"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Tags
                            </label>
                            <select
                              id="category"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                              <option selected="">Select category</option>
                              <option value="TV">TV/Monitors</option>
                              <option value="PC">PC</option>
                              <option value="GA">Gaming/Console</option>
                              <option value="PH">Phones</option>
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label
                              htmlFor="content"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Content
                            </label>
                            <textarea
                              id="content"
                              name="content"
                              rows={4}
                              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder={project?.content}
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={!formFilled}
                          className={`text-white focus:outline-none focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${
                            formFilled
                              ? "bg-indigo-700 hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                              : "bg-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Save
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </>

              <>
                {/* Modal toggle */}
                <button
                  data-modal-target="crud-modal"
                  data-modal-toggle="crud-modal"
                  className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  <FaPlus />
                </button>
                {/* Main modal */}
                <div
                  id="crud-modal"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                  <div className="relative p-4 w-full max-w-md max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      {/* Modal header */}
                      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Create New Product
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          data-modal-toggle="crud-modal"
                        >
                          <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>
                      {/* Modal body */}
                      <form className="p-4 md:p-5">
                        <div className="grid gap-4 mb-4 grid-cols-2">
                          <div className="col-span-2">
                            <label
                              htmlFor="name"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="Type product name"
                              required=""
                            />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <label
                              htmlFor="price"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Price
                            </label>
                            <input
                              type="number"
                              name="price"
                              id="price"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              placeholder="$2999"
                              required=""
                            />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <label
                              htmlFor="category"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Category
                            </label>
                            <select
                              id="category"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            >
                              <option selected="">Select category</option>
                              <option value="TV">TV/Monitors</option>
                              <option value="PC">PC</option>
                              <option value="GA">Gaming/Console</option>
                              <option value="PH">Phones</option>
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label
                              htmlFor="description"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Product Description
                            </label>
                            <textarea
                              id="description"
                              rows={4}
                              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Write product description here"
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          <svg
                            className="me-1 -ms-1 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Add new product
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </>

              <>
                {" "}
                {/* Modal toggle */}
                <button
                  data-modal-target="static-modal"
                  data-modal-toggle="static-modal"
                  className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  type="button"
                >
                  <FaInfo />
                </button>
                {/* Main modal */}
                <div
                  id="static-modal"
                  data-modal-backdrop="static"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                  <div className="relative p-4 w-full max-w-2xl max-h-full">
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      {/* Modal header */}
                      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Main project page
                        </h3>
                        <button
                          type="button"
                          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          data-modal-hide="static-modal"
                        >
                          <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>
                      {/* Modal body */}
                      <div className="p-4 md:p-5 space-y-4">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                          here you will have the info of your project, start to
                          add files to it! <br /> (if you dont see the project's
                          info, try to refresh this page)
                        </p>
                      </div>
                      {/* Modal footer */}
                      <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button
                          data-modal-hide="static-modal"
                          type="button"
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Ok
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>

          <main>
            <div className="m-10"> {project?.content}</div>
          </main>
        </div>

        <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
          <div className="sticky flex flex-col gap-2 p-4 text-sm  top-12">
            <a
              href="/dashboard"
              className="flex items-center px-3 py-2.5 font-bol bg-slate-200  text-black border rounded-full"
            >
              Project info
            </a>
            <a
              href="dashboard/projects/"
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full  "
            >
              Collaborators
            </a>
            <a
              href="dashboard/projects/"
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full  "
            >
              social
            </a>

            <button
              onClick={handleDelete}
              className="flex items-center px-3 py-2.5 font-semibold hover:border-2 hover:rounded-full border-red-950  "
            >
              delete project
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Page;
