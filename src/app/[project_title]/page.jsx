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
import { Button, Modal, Textarea, Label, Dropdown } from "flowbite-react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { SlOptionsVertical } from "react-icons/sl";
import { useSession } from "next-auth/react";

function Page() {
  const [starIsClicked, setStarIsClicked] = useState(false);
  const [binaryStar, setBinaryStar] = useState(0);

  const [openModal, setOpenModal] = useState(false);
  const [openCommentEditModal, setOpenCommentEditModal] = useState(false);

  const [commentId, setCommentId] = useState();

  const [error, setError] = useState();
  const { data: session, status } = useSession();
  const [project, setProject] = useState({});
  const author = session?.user?.email;
  const [lastWord, setLastWord] = useState("");
  const [commentText, setCommentText] = useState("");
  const [newComment, setNewComment] = useState("");
  const [showUpEditCommentButton, setShowUpEditCommentButton] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(false); // Estado para controlar la visibilidad del botón de carga de comentarios

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
          <div className="m-10  mb-0 text-2xl border-b pb-5 flex gap-6 justify-between border-indigo-100 font-semibold">
            <div className="flex gap-10">
              <button onClick={router.back}>
                <FaArrowLeft />{" "}
              </button>{" "}
              <div>
                <h2>{project?.title}</h2>{" "}
                <a
                  className="text-lg border-b-2"
                  href={`profile/${project?.author}`}
                >
                  {" "}
                  {project?.author}{" "}
                </a>
              </div>
              <h3 className="text-gray-400 text-xl mt-2">
                {" "}
                {project?.description}{" "}
              </h3>
            </div>{" "}
            <button
              onClick={handleStarClick}
              className="p-4 mr-24 flex items-center gap-8"
            >
              <div className="text-xl">{project?.stars}</div>
              {starIsClicked ? (
                <HiStar className="w-12 h-12" />
              ) : (
                <HiOutlineStar className="w-12 h-12" />
              )}
            </button>
          </div>

          <main className="m-10 mt-0">
            <div className="">
              <Button.Group>
                <Button gradientDuoTone="cyanToBlue">
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
                    className="bg-black/75"
                    show={openModal}
                    onClose={() => setOpenModal(false)}
                  >
                    <Modal.Header className="w-">
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
                    <Modal.Body className="max-h-[400px] overflow-y-auto">
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

                <Button color="">
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
          </main>
        </div>
      </div>
    </div>
  );
}

export default Page;
