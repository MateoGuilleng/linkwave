"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Navbar from "@/components/Navbar";
import SortableListWithDnd from "@/components/SortableList";
import {
  HiAdjustments,
  HiCloudDownload,
  HiUserCircle,
  HiStar,
  HiOutlineStar,
} from "react-icons/hi";

import { formatDistanceToNow } from "date-fns";

import {
  FaArrowLeft,
  FaPlus,
  FaWindowClose,
  FaFile,
  FaInfo,
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaSave,
  FaEdit,
  FaFileWord,
  FaFileCode,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

import { SlOptionsVertical } from "react-icons/sl";
import { useSession } from "next-auth/react";

import {
  Label,
  TextInput,
  FileInput,
  Button,
  Modal,
  DropdownLabel,
  Dropdown,
  Select,
  Radio,
  Checkbox,
  Textarea,
} from "flowbite-react";

function Page() {
  const [editModal, setEditModal] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [starIsClicked, setStarIsClicked] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const { data: session, status } = useSession();
  const [lastWord, setLastWord] = useState("");
  const [project, setProject] = useState({});
  const [openCommentEditModal, setOpenCommentEditModal] = useState(false);
  const author = session?.user?.email;
  const [error, setError] = useState("");
  const [formFilled, setFormFilled] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showUploadButton, setShowUploadButton] = useState(false); // Estado para controlar la visibilidad del botón de carga de comentarios
  const projectComments = project?.comments;
  const [showUpEditCommentButton, setShowUpEditCommentButton] = useState(false);
  const [message, setMessage] = useState("");

  const [file, setFile] = useState(null);
  const [boxDescription, setBoxDescription] = useState("");
  const [boxTitle, setBoxTitle] = useState("");
  const [boxCategory, setBoxCategory] = useState("fileVanilla");

  const [boxInfo, setBoxInfo] = useState(null);
  const [items, setItems] = useState([]);

  const [commentId, setCommentId] = useState();
  console.log(typeof items);
  const handleDeleteComment = async () => {
    console.log(commentId);
    try {
      const res = await fetch(`/api/comments/${lastWord}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
        }),
      });
      if (res.ok) {
        // Redirige a la misma página para refrescar
        window.location.reload();
      } else {
        console.error("Failed to delete comment:", res.statusText);
      }
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  const handleTitleChange = (e) => setBoxTitle(e.target.value);
  const handleCategoryChange = (e) => setBoxCategory(e.target.value);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBoxDescriptionChange = (e) => {
    const text = e.target.value;
    setBoxDescription(text);
  };

  const handleBoxSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectID", project._id);
    formData.append("title", boxTitle);
    formData.append("category", boxCategory);
    formData.append("description", boxDescription);

    try {
      const response = await fetch("/api/boxes/uploadBox", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        console.log("File uploaded successfully", result);
        setMessage("Box uploaded successfully");

        const newBox = {
          id: result.fileId,
          title: boxTitle,
          category: boxCategory,
          description: boxDescription,
          filename: result.filename,
          filetype: result.filetype,
        };
        setBoxInfo(newBox);
        setItems((prevItems) => {
          const updatedItems = [...prevItems, newBox];
          console.log("Updated items:", updatedItems);
          return updatedItems;
        });
      } else {
        console.error("Error uploading file:", result);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  console.log("items", items);
  const formatCreatedAt = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  const handleUploadEditComment = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target.closest("form")); // Accede al formulario más cercano al elemento que desencadenó el evento

    const newComment = formData.get("newComment");

    try {
      const res = await fetch(`/api/comments/${lastWord}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
          newComment,
        }),
      });

      if (res.ok) {
        setError("");

        const { comments } = await res.json();
        console.log("¡Comentario agregado con éxito!");
        console.log("Comentarios:", comments);
        window.location.reload();
      }
    } catch (error) {
      setError("Something went wrong, try again");
      console.log(error);
    }
  };

  const handleEditCommentInputChange = (e) => {
    const text = e.target.value;
    setNewComment(text);
    setShowUpEditCommentButton(text.trim().length > 0); // Mostrar el botón si hay texto en el área de comentario
  };

  const handleCommentInputChange = (e) => {
    const text = e.target.value;
    setCommentText(text);
    setShowUploadButton(text.trim().length > 0); // Mostrar el botón si hay texto en el área de comentario
  };
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedBoxes = Array.from(project.boxes);
    const [movedBox] = updatedBoxes.splice(result.source.index, 1);
    updatedBoxes.splice(result.destination.index, 0, movedBox);

    // Assuming you have a method to update the boxes in your project
    // updateProjectBoxes(updatedBoxes);
  };
  const handleProjectTypeChange = (e) => {
    setSelectedProjectType(e.target.value);
    console.log(selectedProjectType);
  };
  const handleUploadComment = async (e) => {
    const author = session?.user?.email;
    e.preventDefault();

    const formData = new FormData(e.target.closest("form")); // Accede al formulario más cercano al elemento que desencadenó el evento

    const comment = formData.get("comment");
    try {
      const res = await fetch(`/api/project/specificProject/${lastWord}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment,
          author,
        }),
      });

      if (res.status === 200) {
        setError("");
        window.location.reload();
        const { comments } = await res.json();
        console.log("¡Comentario agregado con éxito!");
        console.log("Comentarios:", comments);
      }
    } catch (error) {
      setError("Something went wrong, try again");
      console.log(error);
    }
  };
  const handleStarClick = async () => {
    console.log("loco");
    const newStarIsClicked = !starIsClicked;
    setStarIsClicked(newStarIsClicked); // Cambia el estado de clicado a no clicado y viceversa

    const newBinaryStar = newStarIsClicked ? 1 : 0;

    console.log("binary Star: ", newBinaryStar, typeof newBinaryStar); //binary Star:  1 number
    console.log("lastWord: ", lastWord, typeof lastWord); // Añade un log para lastWord

    const starredBy = await session?.user?.email;
    try {
      const res = await fetch(`/api/stars/project/${lastWord}`, {
        method: "PUT",
        body: JSON.stringify({
          binaryStar: newBinaryStar,
          starredBy,
        }),
      });

      if (res.status === 200) {
        setError("");
      } else {
        setError("Failed to update the star status");
        console.log("Response status: ", res.status);
      }
    } catch (error) {
      setError("Something went wrong, try again");
      console.log(error);
    }
  };

  const handleSaveImage = async (e) => {
    e.preventDefault();
    const email = session?.user?.email; // Asegúrate de tener acceso a la dirección de correo electrónico del usuario

    const formImageData = new FormData();
    try {
      if (archivo ?? false) {
        formImageData.append("image", archivo);
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
        const projectType = project.projectType;

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
              projectType,
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

    const imageLink = project.banner;
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
            imageLink,
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
        setItems(data.boxes);
      } else {
        console.error("Failed to fetch projects:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      getProject();
    }
  }, [status]);

  const router = useRouter();

  const handleUploadImage = (e) => {
    const archivoSeleccionado = e.target.files[0];

    // Verificar si el archivo es de un tipo permitido
    const tiposPermitidos = [
      "image/svg+xml",
      "image/png",
      "image/jpeg",
      "image/gif",
      "application/x-msdownload", // This MIME type is commonly used for .exe files
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

  return (
    <div>
      <Navbar />
      <div className="bg-black w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#ffffff]">
        <div className="w-full">
          <img
            className="object-cover w-full h-72 p-1 ring-2 ring-indigo-300 dark:ring-indigo-500"
            src={project?.banner}
            alt="Bordered avatar"
          />

          <div className="m-10 sm:flex-row-reverse mb-0 text-2xl border-b pb-5 flex flex-col gap-6 justify-between border-indigo-100 font-semibold">
            <div className="flex w-full flex-wrap sm:flex-nowrap justify-between">
              <div className="flex flex-wrap sm:w-fit">
                <div className="text-3xl sm:text-5xl sm:w-fit  w-full sm:order-first">
                  <div className="flex gap-3">
                    <button onClick={router.back}>
                      <FaArrowLeft />{" "}
                    </button>{" "}
                    <h2 className="sm:text-4xl sm:w-fit">{project?.title}</h2>{" "}
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
                        className="bg-black/75 w-screen"
                        show={editModal}
                        onClose={() => setEditModal(false)}
                      >
                        <Modal.Header className="bg-black">
                          Edit Project:
                        </Modal.Header>
                        <Modal.Body className="bg-black">
                          <div className="overflow-y-auto max-h-[70vh]">
                            <div className="text-left text-md font-semibold p-5">
                              Banner:
                            </div>

                            <div className="flex w-full items-center justify-center">
                              <Label
                                htmlFor="dropzone-file"
                                className="flex h-34 w-full bg-black mb-3 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-900 "
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
                                {error}
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
                                        <FaSave className="mr-3 h-4 w-4" />
                                        Save
                                      </Button>

                                      <Button
                                        onClick={() =>
                                          handleDeleteImagePreview()
                                        }
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
                                    className="bg-black border border-gray-300 text-white  text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-black   dark:focus:ring-primary-500 d"
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
                                    className="bg-black border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-black dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                                    <option
                                      className="dark:bg-black bg-black"
                                      value="current"
                                    >
                                      current: {project?.projectType}
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
                                    className="block mb-2 text-sm font-medium dark:bg-black text-gray-900 dark:text-white"
                                  >
                                    Content
                                  </label>
                                  <textarea
                                    id="content"
                                    name="content"
                                    rows={4}
                                    className="block p-2.5 w-full text-sm dark:bg-black text-gray-900  rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                  </div>
                  <a
                    className="text-sm border-b-2 sm:text-xl "
                    href={`/${project?.author}`}
                  >
                    {" "}
                    {project?.author}{" "}
                  </a>
                </div>
                <h3 className="text-gray-400 text-xl mt-4 sm:mt-5 sm:order-first">
                  Description: {project?.description}{" "}
                </h3>
              </div>
              <div className="sm:flex sm:gap-3 sm:flex-col sm:items-end w-full lg:max-w-72">
                <div className="text-xl flex sm:w-fit border-2 rounded-lg w-full pt-2 px-2 align-middle justify-between">
                  <div>Stars: {project?.stars}</div>
                  <button onClick={handleStarClick}>
                    {starIsClicked ? (
                      <HiStar className="w-9 h-9 pb-2" />
                    ) : (
                      <HiOutlineStar className="w-9 h-9 pb-2" />
                    )}
                  </button>
                </div>
                <div className="text-xl flex w-full sm:w-1/2 border-2 rounded-lg pt-2 px-2 align-middle justify-between">
                  <div>Following: {project?.stars}</div>
                  <button onClick={handleStarClick}>
                    {starIsClicked ? (
                      <HiStar className="w-9 h-9 pb-2" />
                    ) : (
                      <HiOutlineStar className="w-9 h-9 pb-2" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <main className="m-10 mt-0">
            <div className="">
              <Button.Group className="flex-wrap">
                <Button>
                  <HiUserCircle className="mr-3 h-4 w-4" />
                  Overview
                </Button>
                <>
                  <Button onClick={() => setOpenModal(true)}>
                    <HiCloudDownload className="mr-3 h-4 w-4" />
                    Comments
                  </Button>
                  <Modal
                    dismissible
                    className="bg-black/75 w-screen"
                    show={openModal}
                    onClose={() => setOpenModal(false)}
                  >
                    <Modal.Header className="bg-black border-2">
                      <form action="" onSubmit={handleUploadComment}>
                        <div className="w-full">
                          <div className="mb-2 ">
                            <Label
                              className="text-xl"
                              htmlFor="comment"
                              value="Leave a comment:"
                            />
                          </div>
                          <Textarea
                            className="mt-5 bg-black dark:bg-black"
                            id="comment"
                            name="comment"
                            placeholder="give an opinion about the project..."
                            required
                            rows={4}
                            value={commentText}
                            onChange={handleCommentInputChange}
                          />

                          {error}
                          {showUploadButton && ( // Mostrar el botón de carga de comentarios si hay texto en el área de comentario
                            <Button
                              type="submit"
                              className="mt-3 hover:border-2 border-0 border-white"
                            >
                              Upload Comment
                            </Button>
                          )}
                        </div>
                      </form>
                    </Modal.Header>
                    <Modal.Body className="max-h-[400px] overflow-y-auto bg-black border-2 border-white/30">
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold">
                          Comments: ({projectComments?.length})
                        </h3>
                        {project?.comments &&
                          project.comments.map((comment, index) => (
                            <div
                              key={index}
                              className="border-b-2 border-white/25 p-3 rounded"
                            >
                              <div className="flex">
                                <img
                                  alt="Bonnie image"
                                  src={comment.authorProfileImage}
                                  className="mb-3 rounded-full shadow-lg w-14 h-14"
                                />
                                <div className="flex flex-col w-full ml-4">
                                  <div
                                    onClick={() => {
                                      setCommentId(comment.id);
                                      console.log(commentId);
                                    }}
                                    className="flex justify-between w-full"
                                  >
                                    <div>
                                      <p>
                                        <a
                                          className="hover:border-b-2"
                                          href={`profile/${author}`}
                                        >
                                          <strong className="text-md ">
                                            {comment.authorFN}{" "}
                                            {comment.authorLN}{" "}
                                            {session?.user?.email ==
                                            comment.author
                                              ? "(you)"
                                              : ""}
                                          </strong>{" "}
                                        </a>
                                        <p className="text-xs text-gray-400">
                                          {comment.author}
                                        </p>
                                      </p>
                                    </div>
                                    <>
                                      <Modal
                                        dismissible={false} // Evitar que se cierre haciendo clic fuera del modal
                                        className="bg-black/50"
                                        show={openCommentEditModal}
                                        onClose={() => {
                                          setOpenCommentEditModal(false);
                                        }}
                                      >
                                        <Modal.Header className="bg-black">
                                          <form
                                            action=""
                                            onSubmit={handleUploadEditComment}
                                          >
                                            <div className="w-full">
                                              <div className="mb-2">
                                                <Label
                                                  className="text-xl"
                                                  htmlFor="comment"
                                                  value="Edit This Comment:"
                                                />
                                              </div>

                                              <Textarea
                                                className="mt-5 bg-black dark:bg-black"
                                                id="newComment"
                                                name="newComment"
                                                placeholder={comment.comment}
                                                required
                                                rows={4}
                                                value={newComment}
                                                onChange={
                                                  handleEditCommentInputChange
                                                }
                                                onClick={(e) =>
                                                  e.stopPropagation()
                                                } // Evitar que se cierre al hacer clic dentro del textarea
                                              />

                                              {error}
                                              {showUpEditCommentButton && (
                                                <Button
                                                  type="submit"
                                                  className="mt-3 hover:border-2 border-white border-0"
                                                >
                                                  Edit Comment
                                                </Button>
                                              )}
                                            </div>
                                          </form>
                                        </Modal.Header>
                                      </Modal>
                                    </>
                                    <div className="self-end">
                                      <Dropdown
                                        label=""
                                        dismissOnClick={false}
                                        onClick={() => {
                                          setCommentId(comment.id);
                                          console.log(comment.id);
                                        }}
                                        renderTrigger={() => (
                                          <span>
                                            <SlOptionsVertical />
                                          </span>
                                        )}
                                      >
                                        {session?.user?.email ==
                                        comment.author ? (
                                          <div>
                                            <Dropdown.Item>
                                              Copy Link
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                              <Button
                                                className="w-full h-full"
                                                onClick={() => {
                                                  setOpenCommentEditModal(true);
                                                  setCommentId(comment?.id);
                                                }}
                                              >
                                                Edit Comment
                                              </Button>
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                              Follow Comment
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={async () => {
                                                await setCommentId(comment.id);
                                                console.log(commentId);
                                                handleDeleteComment();
                                              }}
                                            >
                                              Remove Comment
                                            </Dropdown.Item>
                                          </div>
                                        ) : (
                                          <div>
                                            <Dropdown.Item>
                                              Copy Link
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                              Follow Comment
                                            </Dropdown.Item>
                                            <Dropdown.Item>
                                              Report Comment
                                            </Dropdown.Item>
                                          </div>
                                        )}
                                      </Dropdown>
                                    </div>
                                  </div>
                                  <p className="text-xs mt-2 text-gray-400">
                                    {formatCreatedAt(comment.createdAt)}{" "}
                                    {comment.edited ? "(Edited)" : ""}{" "}
                                  </p>
                                  <p className="mt-10"> {comment.comment}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </Modal.Body>
                  </Modal>
                </>
                <Button className="" color="">
                  <HiAdjustments className="mr-3 h-4 w-4" />
                  Settings
                </Button>
                {project?.author == author ? (
                  <Button
                    color=""
                    onClick={() =>
                      router.push(`/dashboard/projects/${project?.title}`)
                    }
                  >
                    <HiAdjustments className="mr-3 h-4 w-4" />
                    Edit Project
                  </Button>
                ) : (
                  ""
                )}
              </Button.Group>
            </div>

            <div className="m-10"> {project?.content}</div>

            <div className="flex">
              <h1 className="text-2xl font-bold">Boxes:</h1>
              <Button
                className="bg-gray-700 ml-4 hover:bg-gray-600 flex items-center justify-center"
                onClick={() => setUploadModal(true)}
              >
                <FaPlus />
              </Button>
            </div>
            <div className="App text-black w-full ">
              <div className="w-full">
                {items?.length == 0 ? (
                  "There are no boxes in the list"
                ) : (
                  <SortableListWithDnd items={items} projectName={project.title} />
                )}
              </div>
            </div>
            <>
              <Modal
                className="bg-black/75"
                show={uploadModal}
                onClose={() => setUploadModal(false)}
              >
                <Modal.Header>Upload Box:</Modal.Header>
                <Modal.Body>
                  <form onSubmit={handleBoxSubmit}>
                    <div className="overflow-y-auto max-h-[70vh]">
                      <div className="flex gap-10">
                        <div className="mt-5 w-full ">
                          <div className="mb-2 block">
                            <Label htmlFor="Title" value="Title (optional)" />
                          </div>
                          <TextInput
                            id="Title"
                            type="Title"
                            placeholder="Title of the box"
                            name="title"
                            autoComplete="off"
                            onChange={handleTitleChange}
                          />
                        </div>
                        <div className="w-full">
                          <div className="mb-2 mt-6  block">
                            <Label htmlFor="Category" value="Category:" />
                          </div>
                          <Select
                            id="type"
                            type="type"
                            required
                            name="category"
                            onChange={handleCategoryChange}
                          >
                            <option value="FileVanilla">
                              {" "}
                              File vanilla (default)
                            </option>
                            <option value="File">File</option>
                            <option value="Text"> Text </option>
                            <option value="Picture">Picture</option>
                            <option value="Audio">Audio</option>
                            <option value="Video">Video</option>
                          </Select>
                        </div>
                      </div>

                      <div id="fileUpload" className="w-full mt-4">
                        <div className="mb-2 block">
                          <Label htmlFor="file" value="Upload file" />
                        </div>
                        <FileInput
                          id="file"
                          name="file"
                          className="w-full"
                          onChange={handleFileChange}
                          helperText="Add a file to your box"
                        />
                      </div>

                      <label
                        htmlFor="Description"
                        className="block mt-4 ml-5 text-sm font-medium text-indigo-900 dark:text-white"
                      >
                        Description:
                      </label>

                      <Textarea
                        className="mt-5"
                        id="description"
                        name="description"
                        onChange={handleBoxDescriptionChange}
                        placeholder="give a description about the box:"
                        required
                        rows={4}
                      />

                      <button type="submit">Upload</button>
                      {message && <p>{message}</p>}
                    </div>
                  </form>
                </Modal.Body>
              </Modal>
            </>
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
              href={`${lastWord}/social`}
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full  "
            >
              People
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
