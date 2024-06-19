"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

import SortableListReadOnly from "@/components/boxesForClient";
import SortableRequestListReadOnly from "@/components/requestBoxesForClient";

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
  TextInput,
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
import { useUser } from "@auth0/nextjs-auth0/client";

function Page() {
  const [starIsClicked, setStarIsClicked] = useState(false);
  const [binaryStar, setBinaryStar] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openCommentEditModal, setOpenCommentEditModal] = useState(false);

  const [commentId, setCommentId] = useState();
  const [uploadModal, setUploadModal] = useState(false);
  const [error, setError] = useState();
  const { user, isLoading } = useUser();
  const [project, setProject] = useState({});
  const author = user?.email;
  const [lastWord, setLastWord] = useState("");
  const [commentText, setCommentText] = useState("");
  const [newComment, setNewComment] = useState("");
  const [showUpEditCommentButton, setShowUpEditCommentButton] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(false); // Estado para controlar la visibilidad del botón de carga de comentarios
  const [formFilled, setFormFilled] = useState(false);
  const [reqItems, setReqItems] = useState([]);

  const [message, setMessage] = useState("");

  const [requestBoxTitle, setRequestBoxTitle] = useState("");
  const [requestBoxCategory, setRequestBoxCategory] = useState("");
  const [requestFile, setRequestFile] = useState(null);
  const [requestBoxDescription, setRequestBoxDescription] = useState("");

  const [items, setItems] = useState([]);
  const getProject = async () => {
    console.log("last word desde get project", lastWord);
    try {
      const res = await fetch(
        `/api/project/specificProject/${encodeURIComponent(lastWord)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("data", data);
        setProject(data);
        setItems(data.boxes);
        setReqItems(data.requestBoxes);
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
    getProject();
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");
    const last = pathParts.filter((part) => part.trim() !== "").pop() || "";
    setLastWord(last);
  }, []);

  const handleRequestTitleChange = (e) => {
    setRequestBoxTitle(e.target.value);
  };

  const handleRequestCategoryChange = (e) => {
    setRequestBoxCategory(e.target.value);
  };
  const handleRequestFileChange = (e) => {
    setRequestFile(e.target.value);
  };

  const handleRequestBoxDescriptionChange = (e) => {
    setRequestBoxDescription(e.target.value);
  };

  const handleRequestBoxSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", requestFile);
    formData.append("projectID", project._id);
    formData.append("title", requestBoxTitle);
    formData.append("category", requestBoxCategory);
    formData.append("description", requestBoxDescription);

    try {
      const response = await fetch("/api/boxes/request/uploadRequest", {
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

  useEffect(() => {
    if (project?.starredBy?.includes(user?.email)) {
      setStarIsClicked(true);
      setBinaryStar(1);
    } else {
      setStarIsClicked(false);
      setBinaryStar(0);
    }
  }, [project, isLoading]);

  const handleStarClick = async () => {
    console.log("loco");
    const newStarIsClicked = !starIsClicked;
    setStarIsClicked(newStarIsClicked); // Cambia el estado de clicado a no clicado y viceversa

    const newBinaryStar = newStarIsClicked ? 1 : 0;

    console.log("binary Star: ", newBinaryStar, typeof newBinaryStar); //binary Star:  1 number
    console.log("lastWord: ", lastWord, typeof lastWord); // Añade un log para lastWord

    const starredBy = await user?.email;
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
    const author = user?.email
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
            window.location.reload(); // Reload the page after successful comment upload (consider using React state update instead)
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
            window.location.reload(); // Reload the page after successful comment deletion (consider using React state update instead)
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
            window.location.reload(); // Reload the page after successful comment update (consider using React state update instead)

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
              <div className="flex flex-wrap sm:w-full">
                <div className="text-3xl sm:text-5xl sm:w-fit  w-full sm:order-first">
                  <div className="flex flex-wrap align-middle items-center justify-between">
                    <div className="flex gap-3">
                      <button className="align-middle" onClick={router.back}>
                        <FaArrowLeft />{" "}
                      </button>{" "}
                      <h2 className="sm:text-4xl sm:w-fit align-middle">
                        {project?.title}
                      </h2>{" "}
                    </div>
                    <div className="flex items-center w-full gap-5 my-5 text-lg">
                      <div className="border-2 text-sm sm:text-lg rounded-lg w-full items-center flex p-3">
                        <div>Stars: {project?.stars}</div>
                        <button
                          className="w-9 h-9 ml-2 align-middle self-end"
                          onClick={handleStarClick}
                        >
                          {starIsClicked ? (
                            <HiStar className="" />
                          ) : (
                            <HiOutlineStar />
                          )}
                        </button>
                      </div>
                      <div className="border-2 text-sm sm:text-lg rounded-lg w-full items-center flex p-3">
                        <div>Following: {project?.stars}</div>
                        <button
                          className="w-9 h-9 ml-2 align-middle"
                          onClick={handleStarClick}
                        >
                          {starIsClicked ? <HiStar /> : <HiOutlineStar />}
                        </button>
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
                <h3 className="text-gray-400 text-xl mt-4 sm:mt-5 sm:order-first">
                  Description: {project?.description}{" "}
                </h3>
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
                                            {user?.email ==
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
                                        {user?.email ==
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

                <Button
                  className=""
                  color=""
                  onClick={() => router.push(`${lastWord}/requests`)}
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
              </Button.Group>
            </div>

            <div className="m-10"> {project?.content}</div>
            <div className="flex">
              <h1 className="text-2xl font-bold">Boxes:</h1>
            </div>
            <div className="App text-black w-full ">
              <div className="w-full">
                {items?.length == 0 ? (
                  "There are no boxes in the list"
                ) : (
                  <SortableListReadOnly
                    items={items}
                    projectName={project?.title}
                  />
                )}
              </div>
            </div>

            <>
              <Modal
                className="bg-black/75"
                show={uploadModal}
                onClose={() => setUploadModal(false)}
              >
                <Modal.Header>Upload Request:</Modal.Header>
                <Modal.Body>
                  <form onSubmit={handleRequestBoxSubmit}>
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
                            onChange={handleRequestTitleChange}
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
                            onChange={handleRequestCategoryChange}
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
                          onChange={handleRequestFileChange}
                          helperText="Add a file to your box"
                        />
                      </div>

                      <label
                        htmlFor="Description"
                        className="block mt-4 ml-5 text-sm font-medium text-indigo-900 dark:text-white"
                      >
                        Description: (Description Suports HTML Embeded!)
                      </label>

                      <Textarea
                        className="mt-5"
                        id="description"
                        name="description"
                        onChange={handleRequestBoxDescriptionChange}
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
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Page;
