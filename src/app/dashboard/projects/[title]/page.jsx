"use client";

import { useEffect, useState } from "react";
import AOS from "aos"; // Importa AOS
import "aos/dist/aos.css"; // Importa los estilos de AOS
import { toast } from "sonner";

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
  FaSave,
  FaEdit,
  FaPeopleArrows,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

import { SlOptionsVertical } from "react-icons/sl";
import { useUser } from "@auth0/nextjs-auth0/client";

import {
  Label,
  Popover,
  TextInput,
  FileInput,
  Button,
  Modal,
  Dropdown,
  Select,
  Textarea,
} from "flowbite-react";

function Page() {
  const [editModal, setEditModal] = useState(false);
  const { user, isLoading } = useUser();

  const [openModal, setOpenModal] = useState(false);
  const [starIsClicked, setStarIsClicked] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);

  const [archivo, setArchivo] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const [lastWord, setLastWord] = useState("");
  const [project, setProject] = useState({});
  const [openCommentEditModal, setOpenCommentEditModal] = useState(false);
  const author = user?.email;
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

  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [contentProject, setContentProject] = useState(project?.content || "");
  const [selectedProjectType, setSelectedProjectType] = useState(
    project?.projectType || ""
  );
  const [categoryChanged, setCategoryChanged] = useState(false);

  // Manejador para el cambio en el tipo de proyecto
  const handleProjectTypeChange = (e) => {
    setSelectedProjectType(e.target.value);
    setCategoryChanged(true); // Indica que la categoría fue cambiada
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

  console.log("itens", items);
  if (items == undefined) {
    console.log("jajaja");
    getProject();
  } else {
    console.log("jejee");
  }

  useEffect(() => {
    AOS.init({
      duration: 1000, // Duración de la animación en milisegundos
    });
    getProject();
  }, []);

  const content = (
    <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
      <div className="border-b  px-3 py-2 border-gray-600 bg-gray-700">
        <h3 className="font-semibold text-white">Use your own HTML!</h3>
      </div>
      <div className="px-3 py-2 bg-black">
        <p>
          In the description of any box, you can paste any HTML code, that
          means, you can upload and resize images, put Iframes from spotify,
          youtube or even Instagram posts! If you want to know how to do it
          click{" "}
          <a className="border-b-2" href="/docs/htmlEmbeded">
            here!
          </a>
        </p>
      </div>
    </div>
  );
  const handleDeleteComment = async () => {
    console.log(commentId);

    const promise = () =>
      new Promise(async (resolve, reject) => {
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
            console.log("Comment deleted successfully");
            // Optionally, update your local state or UI after deletion

            resolve();
          } else {
            console.error("Failed to delete comment:", res.statusText);
            reject(new Error("Failed to delete comment"));
          }
        } catch (error) {
          console.error("Error deleting comment:", error.message);
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Deleting comment...",
      success: "Comment deleted successfully",
      error: "Failed to delete comment",
    });
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

    console.log(file, typeof file);

    const promise = () =>
      new Promise(async (resolve, reject) => {
        const timer = setTimeout(() => {
          toast("Please be patient, the uploading box is big", {
            icon: "⌛",
          });
        }, 5000); // 10 seconds

        try {
          const response = await fetch("/api/boxes/uploadBox", {
            method: "POST",
            body: formData,
          });

          clearTimeout(timer);

          const result = await response.json();
          if (response.ok) {
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

            resolve({ name: result.filename });

            window.location.reload();
          } else {
            console.error("Error uploading file:", result);
            reject(new Error("Error uploading file"));
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Uploading...",
      success: (data) => {
        return `Box uploaded successfully`;
      },
      error: "Error uploading file",
    });
  };

  const formatCreatedAt = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  const handleUploadEditComment = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target.closest("form")); // Access the closest form element to the event trigger

    const newComment = formData.get("newComment");

    const promise = () =>
      new Promise(async (resolve, reject) => {
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
            console.log("Comment updated successfully!");
            console.log("Comments:", comments);

            resolve({ comment: newComment });
          } else {
            setError("Something went wrong, try again");
            console.log("Error updating comment:", res.statusText);
            reject(new Error("Error updating comment"));
          }
        } catch (error) {
          setError("Something went wrong, try again");
          console.error("Error updating comment:", error);
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Updating comment...",
      success: (data) => {
        return `Comment updated successfully: ${data.comment}`;
      },
      error: "Error updating comment",
    });
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
  const handleUploadComment = async (e) => {
    const author = user?.email;
    e.preventDefault();

    const formData = new FormData(e.target.closest("form")); // Access the closest form element to the event trigger

    const comment = formData.get("comment");

    const promise = () =>
      new Promise(async (resolve, reject) => {
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

            const { comments } = await res.json();
            console.log("Comment added successfully!");
            console.log("Comments:", comments);

            resolve({ comment });
          } else {
            setError("Something went wrong, try again");
            console.log("Error adding comment:", res.statusText);
            reject(new Error("Error adding comment"));
          }
        } catch (error) {
          setError("Something went wrong, try again");
          console.error("Error adding comment:", error);
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Uploading comment...",
      success: (data) => {
        return `Comment added successfully: ${data.comment}`;
      },
      error: "Error adding comment",
    });
  };

  const handleSaveImage = async (e) => {
    e.preventDefault();
    const formImageData = new FormData();

    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          if (archivo) {
            formImageData.append("image", archivo);
            const uploadResponse = await fetch(`/api/uploadImage`, {
              method: "POST",
              body: formImageData,
            });

            if (!uploadResponse.ok) {
              throw new Error(
                `Error uploading image: ${uploadResponse.statusText}`
              );
            }

            const uploadResult = await uploadResponse.json();
            const imageLink = uploadResult.url;

            const title = project.title;
            const description = project.description;
            const content = project.content;
            const projectType = project.projectType;

            const projectResponse = await fetch(
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

            if (!projectResponse.ok) {
              throw new Error(
                `Error updating project: ${projectResponse.statusText}`
              );
            }

            const resProject = await projectResponse.json();
            console.log("resProject", resProject);

            resolve({ name: "Image" });
          }
        } catch (error) {
          console.error(`Error in request: ${error.message}`);
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Uploading image...",
      success: (data) => {
        return `${data.name} uploaded successfully`;
      },
      error: "Error uploading image",
    });
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");
    const last = pathParts.filter((part) => part.trim() !== "").pop() || "";
    setLastWord(last);
    console.log(last);
  }, []);

  const handleDeleteImagePreview = async (e) => {
    setImagePreview(null);
    setArchivo(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

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

    const imageLink = await project.banner;
    let categoryToSend = await project.projectType;

    if (categoryChanged) {
      categoryToSend = selectedProjectType;
    }

    const promise = () =>
      new Promise(async (resolve, reject) => {
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
                projectType: categoryToSend,
                imageLink,
              }),
            }
          );

          // Comprobar si la solicitud fue exitosa
          if (res.ok) {
            // Convertir la respuesta a formato JSON
            const data = await res.json();
            // Imprimir la respuesta en la consola
            console.log("Respuesta del servidor:", data);

            router.refresh();
            router.replace("/dashboard/projects");
            resolve({ name: title });
          } else {
            // Imprimir un mensaje de error si la solicitud no fue exitosa
            console.error("Error en la solicitud:", res.statusText);
            reject(new Error(res.statusText));
          }
        } catch (error) {
          console.log("Error de red:", error);
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Submitting...",
      success: (data) => {
        return `${data.name} updated successfully`;
      },
      error: "Error updating project",
    });
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
    try {
      const res = await fetch(`/api/project/specificProject/${lastWord}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const promise = () =>
        new Promise((resolve, reject) => {
          if (res.ok) {
            router.replace("/dashboard/projects");
            resolve();
          } else {
            console.error("Failed to delete project:", res.statusText);
            reject(new Error("Failed to delete project"));
          }
        });

      toast.promise(promise(), {
        loading: "Deleting project...",
        success: "Project deleted successfully",
        error: "Failed to delete project",
      });
    } catch (error) {
      console.error("Error deleting project:", error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 dark:bg-black w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-black dark:text-white">
        <div className="w-full">
          <img
            className="object-cover w-full h-72 p-1 ring-2 ring-indigo-300 dark:ring-indigo-500"
            src={project?.banner}
            alt="Bordered avatar"
          />

          <div
            data-aos="fade-up"
            className="m-10 sm:flex-row-reverse mb-0 text-2xl border-b pb-5 flex flex-col gap-6 justify-between border-indigo-100 font-semibold"
          >
            <div className="flex w-full flex-wrap sm:flex-nowrap justify-between">
              <div className="flex flex-wrap sm:w-full">
                <div className="sm:w-fit  w-full sm:order-first">
                  <div className="flex flex-wrap align-middle items-center justify-between">
                    <div className="flex gap-3">
                      <button className="align-middle" onClick={router.back}>
                        <FaArrowLeft />{" "}
                      </button>{" "}
                      <h2 className="sm:text-6xl text-center text-3xl sm:w-fit align-middle">
                        {project?.title}
                      </h2>{" "}
                      <>
                        <Button
                          className="hover:border-white bg-black/35 h-fit bg-green-700"
                          onClick={() => {
                            setEditModal(true);
                            toast.info(
                              "You will be returned to your projects after the changes have been made"
                            );
                          }}
                        >
                          <div className="flex gap-5 align-middle">
                            <FaEdit />
                          </div>
                        </Button>
                        <Modal
                          className="bg-black/75 w-screen text-black dark:text-white"
                          show={editModal}
                          onClose={() => setEditModal(false)}
                        >
                          <Modal.Header className="dark:bg-black bg-white">
                            Edit Project:
                          </Modal.Header>
                          <Modal.Body className="dark:bg-black bg-white">
                            <div className="overflow-y-auto max-h-[70vh]">
                              <div className="text-left text-md font-semibold p-5">
                                Banner:
                              </div>

                              <div className="flex w-full items-center justify-center">
                                <Label
                                  htmlFor="dropzone-file"
                                  className="flex h-34 w-full dark:bg-black bg-white mb-3 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-400 dark:hover:bg-gray-900 "
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
                                      className="bg-black border border-gray-300 text-black dark:text-white text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-black dark:focus:ring-primary-500"
                                      value={title}
                                      onChange={(e) => setTitle(e.target.value)}
                                      placeholder={project?.title}
                                    />
                                  </div>
                                  <div className="col-span-2 sm:col-span-1">
                                    <label
                                      htmlFor="description"
                                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                      Description
                                    </label>
                                    <TextInput
                                      name="description"
                                      id="description"
                                      placeholder={project?.description}
                                      value={description}
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="col-span-2 sm:col-span-1">
                                    <div className="mb-2 block">
                                      <Label htmlFor="type" value="Type" />
                                    </div>
                                    <Select
                                      id="category"
                                      name="category"
                                      required
                                      onChange={handleProjectTypeChange}
                                      value={selectedProjectType}
                                    >
                                      <option
                                        className="dark:bg-black bg-black"
                                        value="current"
                                      >
                                        current: {project?.projectType}
                                      </option>
                                      <option value="Math">Math</option>
                                      <option value="Chemestry">
                                        Chemestry
                                      </option>
                                      <option value="Social science">
                                        Social science
                                      </option>
                                      <option value="English">English</option>
                                      <option value="Technology">
                                        Technology
                                      </option>
                                      <option value="Farandula">
                                        Farandula
                                      </option>
                                      <option value="Pruebas Icfes">
                                        Pruebas Icfes
                                      </option>
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
                                      className="block p-2.5 w-full text-sm dark:bg-black text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                      value={contentProject}
                                      onChange={(e) =>
                                        setContentProject(e.target.value)
                                      }
                                      placeholder={project?.content}
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
                    <div className="flex items-center w-full gap-5 my-5 text-lg">
                      <div className="border-2 text-sm sm:text-lg rounded-lg w-full items-center flex p-3">
                        <div>Stars: {project?.stars}</div>
                      </div>
                      <div className="border-2 text-sm sm:text-lg rounded-lg w-full items-center flex p-3">
                        <div>Following: {project?.followers}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <p className="text-lg mr-4">Author:</p>
                    <img
                      src={project?.authorImage}
                      alt={`${project?.author}'s profile`}
                      className="w-10 h-10 mr-4 rounded-full object-cover"
                    />
                    <a
                      className="text-sm border-b-2 sm:text-xl "
                      href={`/${project?.author}`}
                    >
                      {" "}
                      {project?.author}{" "}
                    </a>
                  </div>
                </div>
                <h3 className="text-gray-400 text-lg sm:text-xl mt-4 sm:mt-5 sm:order-first">
                  Description: {project?.description}{" "}
                </h3>
              </div>
            </div>
          </div>

          <main data-aos="fade-up" className="m-10 mt-0">
            <div data-aos="fade-up" className="">
              <Button.Group className="flex-wrap">
                <Button
                  onClick={() =>
                    router.replace(`/${project.author}/${project.title}`)
                  }
                >
                  <HiUserCircle className="mr-3 h-4 w-4 text-black dark:text-white" />
                  <p className="text-black dark:text-white">Overview</p>
                </Button>
                <>
                  <Button onClick={() => setOpenModal(true)}>
                    <HiCloudDownload className="mr-3 h-4 w-4 text-black dark:text-white" />
                    <p className="text-black dark:text-white">Comments</p>
                  </Button>
                  <Modal
                    dismissible
                    className="bg-black/75 w-screen"
                    show={openModal}
                    onClose={() => setOpenModal(false)}
                  >
                    <Modal.Header className="bg-white dark:bg-black border-2 bg">
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
                            className="mt-5 bg-white dark:bg-black"
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
                              className="mt-3 hover:border-2 border-0 border-white text-black dark:text-white"
                            >
                              Upload Comment
                            </Button>
                          )}
                        </div>
                      </form>
                    </Modal.Header>
                    <Modal.Body className="max-h-[400px] overflow-y-auto bg-white dark:bg-black text-black dark:text-white border-2 border-white/30">
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
                                            {user?.email == comment.author
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
                                        <Modal.Header className="bg-white dark:text-white">
                                          <form
                                            action=""
                                            onSubmit={handleUploadEditComment}
                                          >
                                            <div className="w-full">
                                              <div className="mb-2 text-black dark:text-white">
                                                <Label
                                                  className="text-xl"
                                                  htmlFor="comment"
                                                  value="Edit This Comment:"
                                                />
                                              </div>

                                              <Textarea
                                                className="mt-5 bg-white dark:bg-black"
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
                                                  className="mt-3 hover:border-2 text-black dark:text-white border-white border-0"
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
                                        {user?.email == comment.author ? (
                                          <div>
                                            <Dropdown.Item>
                                              <Button
                                                className="w-full h-full text-black dark:text-white"
                                                onClick={() => {
                                                  setOpenCommentEditModal(true);
                                                  setCommentId(comment?.id);
                                                }}
                                              >
                                                Edit Comment
                                              </Button>
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
                <Button
                  className=""
                  color=""
                  onClick={() => {
                    router.push(`${lastWord}/requests`);
                  }}
                >
                  <HiAdjustments className="mr-3 h-4 w-4" />
                  Requests
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
                <Button
                  className="block sm:hidden"
                  color=""
                  onClick={() =>
                    router.push(`/${project?.author}/${lastWord}/social`)
                  }
                >
                  <FaPeopleArrows className="mr-3 h-4 w-4 " />
                  People
                </Button>
              </Button.Group>
            </div>

            <div className="m-10"> {project?.content}</div>

            <div data-aos="fade-up" className="flex">
              <h1 className="text-2xl font-bold">Boxes:</h1>
              <Button
                className="dark:bg-gray-700 ml-4 bg-gray-100 text-black dark:text-white dark:hover:bg-gray-600 flex items-center justify-center"
                onClick={() => setUploadModal(true)}
              >
                <FaPlus />
              </Button>
            </div>
            <div data-aos="fade-up" className="App text-black w-full ">
              <div className="w-full">
                {items?.length == 0 ? (
                  "There are no boxes in the list"
                ) : (
                  <SortableListWithDnd
                    items={items}
                    projectName={encodeURIComponent(project.title)}
                  />
                )}
              </div>
            </div>
            <>
              <Modal
                className="bg-black/75 "
                show={uploadModal}
                onClose={() => setUploadModal(false)}
              >
                <Modal.Header className="bg-white dark:bg-black text-black dark:text-white">
                  Upload Box:
                </Modal.Header>
                <Modal.Body className="bg-white dark:bg-black text-black dark:text-white">
                  <form
                    className=""
                    onSubmit={(e) => {
                      handleBoxSubmit(e);
                    }}
                  >
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

                      <div className="flex items-center">
                        <label
                          htmlFor="Description"
                          className="block mt-4 ml-5 text-sm font-medium text-indigo-900 dark:text-white"
                        >
                          Description: (Description Suports HTML Embeded!)
                        </label>

                        <Popover
                          content={content}
                          className=""
                          placement="right"
                        >
                          <Button className="align-middle mb-2 border-2 ml-3 border-white/35 text-black dark:text-white">
                            Learn More
                          </Button>
                        </Popover>
                      </div>

                      <Textarea
                        className="mt-5"
                        id="description"
                        name="description"
                        onChange={handleBoxDescriptionChange}
                        placeholder="give a description about the box:"
                        required
                        rows={4}
                      />
                      <button
                        className="border-2 dark:border-white/50 border-black/50 p-2 my-4  rounded-lg w-full"
                        type="submit"
                      >
                        Upload
                      </button>
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
              href={`/${project?.author}/${lastWord}/social`}
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full  "
            >
              People
            </a>

            <button
              className="flex items-center px-3 py-2.5 font-semibold hover:border-2 hover:rounded-full border-red-950  "
              onClick={() => {
                toast.warning(
                  "Are you sure you want to delete this proyect? If you confirm, changes will not be able to undo!",
                  {
                    action: {
                      label: "Confirm Delete",
                      onClick: () => handleDelete(),
                    },
                  }
                );
              }}
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
