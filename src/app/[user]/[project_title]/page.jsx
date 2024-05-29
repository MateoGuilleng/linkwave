"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/Navbar";

import {
  HiAdjustments,
  HiCloudDownload,
  HiUserCircle,
  HiStar,
  HiOutlineStar,
} from "react-icons/hi";

import {
  Button,
  Dropdown,
  Modal,
  Textarea,
  Label,
  DropdownLabel,
  FileInput,
  Select,
} from "flowbite-react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { SlOptionsVertical } from "react-icons/sl";
import { useSession } from "next-auth/react";

function Page() {
  const [starIsClicked, setStarIsClicked] = useState(false);
  const [binaryStar, setBinaryStar] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openCommentEditModal, setOpenCommentEditModal] = useState(false);

  const [commentId, setCommentId] = useState();
  const [uploadModal, setUploadModal] = useState(false);
  const [error, setError] = useState();
  const { data: session, status } = useSession();
  const [project, setProject] = useState({});
  const author = session?.user?.email;
  const [lastWord, setLastWord] = useState("");
  const [commentText, setCommentText] = useState("");
  const [newComment, setNewComment] = useState("");
  const [showUpEditCommentButton, setShowUpEditCommentButton] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(false); // Estado para controlar la visibilidad del botón de carga de comentarios
  const [formFilled, setFormFilled] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");
    const last = pathParts.filter((part) => part.trim() !== "").pop() || "";
    setLastWord(last);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      getProject();
    }
  }, [status]);
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

  const handleProjectTypeChange = (e) => {
    setSelectedProjectType(e.target.value);
    console.log(selectedProjectType);
  };

  useEffect(() => {
    if (project?.starredBy?.includes(session?.user?.email)) {
      setStarIsClicked(true);
      setBinaryStar(1);
    } else {
      setStarIsClicked(false);
      setBinaryStar(0);
    }
  }, [project, session]);

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

  const formatCreatedAt = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
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

  const projectComments = project?.comments;
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
                  <div>Stars: {project?.stars}</div>
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
                            className="mt-5"
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
                            <Button type="submit" className="mt-3">
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
                                        <Modal.Header className="">
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
                                                className="mt-5"
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
                                                  className="mt-3"
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

            <>
              <Button
                className="w-1/2 h-32 bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                onClick={() => setUploadModal(true)}
              >
                <div className="flex gap-10 align-middle">
                  <span>
                    <FaPlus className="text-white text-4xl" />{" "}
                  </span>
                  <p className="text-2xl"> Upload a request</p>
                </div>
              </Button>
              <Modal
                className="bg-black/75"
                show={uploadModal}
                onClose={() => setUploadModal(false)}
              >
                <Modal.Header>Upload Request:</Modal.Header>
                <Modal.Body>
                  <p className="mx-10">
                    Here you can upload your request in order to propose a
                    change to the project, if the owner accept, your changes
                    will be authorizated
                  </p>
                  <div className="overflow-y-auto max-h-[70vh]">
                    <div className="col-span-2 sm:col-span-1 ml-3">
                      <div className="mb-2 mt-6  block">
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
                          current: {project?.projectType}
                        </option>

                        <option value="ZIP">Application / Game</option>
                        <option value="Art">Art</option>
                        <option value="General discussion">
                          General discussion
                        </option>
                        <option value="Audio">Audio</option>
                        <option value="Video">Video</option>
                      </Select>
                    </div>
                    <div className="text-left text-md font-semibold p-5">
                      File:
                    </div>
                    <div>
                      <FileInput id="multiple-file-upload" multiple />
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Page;
