"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { initFlowbite } from "flowbite";
import Navbar from "@/components/Navbar";
import { HiAdjustments, HiCloudDownload, HiUserCircle } from "react-icons/hi";
import { Button, Modal, Textarea, Label } from "flowbite-react";
import { FaArrowLeft, FaPlus, FaWindowClose, FaInfo } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Link } from "lucide-react";
import { useSession } from "next-auth/react";

function Page() {
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState();
  const { data: session, status } = useSession();
  const [project, setProject] = useState({});
  const author = session?.user?.email;
  const [lastWord, setLastWord] = useState("");
  const [commentText, setCommentText] = useState("");
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
  // Función para formatear la fecha y calcular la diferencia de tiempo desde el momento actual
  const formatCreatedAt = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
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
        const { comments } = await res.json();
        console.log("¡Comentario agregado con éxito!");
        console.log("Comentarios:", comments);
      }
    } catch (error) {
      setError("Something went wrong, try again");
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="bg-black w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#ffffff]">
        <div className="w-full">
          <div className="m-10  mb-0 text-2xl border-b pb-5 flex gap-6 justify-between border-indigo-100 font-semibold">
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
                        <h3 className="text-xl font-bold">Comments:</h3>
                        {project.comments &&
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
                                <div className="flex flex-col ml-4">
                                  <p>
                                    <strong className="text-md ">
                                      {comment.authorFN} {comment.authorLN}
                                    </strong>{" "}
                                    <p className="text-xs text-gray-400">
                                      {comment.author}
                                    </p>
                                  </p>
                                  <p className="text-xs mt-2 text-gray-400">
                                    {formatCreatedAt(comment.createdAt)}
                                  </p>
                                  <p className="mt-10">{comment.comment}</p>
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
