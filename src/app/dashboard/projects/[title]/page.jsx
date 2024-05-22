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
import { Label, FileInput, Button, Modal, Select } from "flowbite-react";
import { HiSave } from "react-icons/hi";

function Page() {
  const [editModal, setEditModal] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { data: session, status } = useSession();
  const [lastWord, setLastWord] = useState("");
  const [project, setProject] = useState({});
  const author = session?.user?.email;
  const [formFilled, setFormFilled] = useState(false);

  const handleProjectTypeChange = (e) => {
    setSelectedProjectType(e.target.value);
    console.log(selectedProjectType);
  };

  const handleSaveImage = async (e) => {
    e.preventDefault();
    const email = session?.user?.email; // Asegúrate de tener acceso a la dirección de correo electrónico del usuario

    const formImageData = new FormData();
    try {
      if (archivo ?? false) {
        formImageData.append("file", archivo);
        const uploadResponse = await fetch(`/api/uploadImage`, {
          method: "POST",

          body: formImageData,
        });

        if (!uploadResponse.ok) {
          throw new Error(
            `Error al subir la imagen: ${uploadResponse.statusText}`
          );
        }

        const uploadResult = await uploadResponse.json();
        console.log(uploadResult.message);
        console.log("Proyecto subido con éxito!");
        const imageLink = await uploadResult.url;
        console.log("image link:", imageLink);

        const title = project.title;
        const description = project.description;
        const content = project.content;

        const proyectResponse = await fetch(
          `/api/project/specificProject/projectAdmin/${lastWord}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              description,
              content,
              imageLink,
            }),
          }
        );

        if (!proyectResponse.ok) {
          throw new Error(
            `Error al subir el repositorio: ${proyectResponse.statusText}`
          );
        }

        const resProyect = await proyectResponse.json();
        console.log("resProyect", resProyect);
        router.refresh();
      }
    } catch (error) {
      console.error(`Error al enviar la solicitud: ${error.message}`);
    }
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");
    const last = pathParts.filter((part) => part.trim() !== "").pop() || "";
    setLastWord(last);
  }, []);

  const handleDeleteImagePreview = async (e) => {
    setImagePreview(null);
    setArchivo(null);
  };

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
      description = e.target
        .querySelector("#description")
        .getAttribute("placeholder");
    }
    if (!content.trim()) {
      content = e.target.querySelector("#content").getAttribute("placeholder");
    }

    try {
      const res = await fetch(
        `/api/project/specificProject/projectAdmin/${lastWord}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            content,
            projectType: selectedProjectType,
          }),
        }
      );
      router.refresh();
      // Comprobar si la solicitud fue exitosa
      if (res.ok) {
        // Convertir la respuesta a formato JSON
        const data = await res.json();
        // Imprimir la respuesta en la consola
        console.log("Respuesta del servidor:", data);

        router.replace("/dashboard/projects");
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
    if (project.projectType !== selectedProjectType) {
      setFormFilled(true);
    }
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

  const handleUploadImage = (e) => {
    const archivoSeleccionado = e.target.files[0];

    // Verificar si el archivo es de un tipo permitido
    const tiposPermitidos = [
      "image/svg+xml",
      "image/png",
      "image/jpeg",
      "image/gif",
    ];
    if (
      archivoSeleccionado &&
      tiposPermitidos.includes(archivoSeleccionado.type)
    ) {
      setArchivo(archivoSeleccionado);

      // Crear una URL temporal para previsualización de la imagen
      const previewUrl = URL.createObjectURL(archivoSeleccionado);
      setImagePreview(previewUrl);
      console.log(previewUrl);
    } else {
      // Restablecer el estado en caso de un tipo de archivo no permitido
      setArchivo(null);
      setImagePreview(null);
      setError(
        "Tipo de archivo no permitido. Selecciona un archivo SVG, PNG, JPG o GIF."
      );
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
          <img
            className="object-cover w-full h-72 p-1 ring-2 ring-indigo-300 dark:ring-indigo-500"
            src={project.banner}
            alt="Bordered avatar"
          />
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
                <Button
                  className="hover:border-white bg-green-700"
                  onClick={() => setEditModal(true)}
                >
                  <div className="flex gap-5 align-middle">
                    <FaEdit />
                  </div>
                </Button>
                <Modal
                  className="bg-black/75"
                  show={editModal}
                  onClose={() => setEditModal(false)}
                >
                  <Modal.Header>Edit Project:</Modal.Header>
                  <Modal.Body>
                    <div className="overflow-y-auto max-h-[70vh]">
                      <div className="text-left text-md font-semibold p-5">
                        Banner:
                      </div>
                      <div className="flex w-full items-center justify-center">
                        <Label
                          htmlFor="dropzone-file"
                          className="flex h-34 w-full mb-3 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                        >
                          <div className="flex flex-col items-center justify-center pb-6 pt-5">
                            <svg
                              className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 16"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                          </div>
                          <FileInput
                            onChange={(e) => handleUploadImage(e)}
                            id="dropzone-file"
                            className="hidden"
                          />
                        </Label>
                      </div>
                      <div className="w-full self-center">
                        {imagePreview && (
                          <div className="flex flex-col items-center justify-center">
                            <div className="text-left text-md font-semibold p-5">
                              Your Uploaded Banner
                            </div>
                            <img
                              src={imagePreview}
                              alt="Vista previa de la imagen"
                              className="max-w-full max-h-[400px] mr-10"
                            />
                            <div className="mt-4 w-full flex flex-row justify-start">
                              <Button.Group>
                                <Button
                                  onClick={(e) => handleSaveImage(e)}
                                  className="hover:border-white bg-blue-600"
                                >
                                  <HiSave className="mr-3 h-4 w-4" />
                                  Save
                                </Button>

                                <Button
                                  onClick={() => handleDeleteImagePreview()}
                                  className="hover:border-white"
                                >
                                  Remove Banner
                                </Button>
                              </Button.Group>
                            </div>
                          </div>
                        )}
                      </div>
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
                            <div className="mb-2 block">
                              <Label htmlFor="type" value="type" />
                            </div>
                            <Select
                              id="type"
                              type="type"
                              name="type"
                              required
                              onChange={handleProjectTypeChange}
                            >
                              <option value="current">
                                current: {project.projectType}
                              </option>

                              <option value="Aplication">
                                Application / Game
                              </option>
                              <option value="Art">Art</option>
                              <option value="General discussion">
                                General discussion
                              </option>
                              <option value="Audio">Audio</option>
                              <option value="Video">Video</option>
                            </Select>
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
                  </Modal.Body>
                </Modal>
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
                          add files to it! <br /> (if you dont see the project`s
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
              People
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
