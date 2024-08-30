"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { FaArrowLeft, FaPlus, FaEdit } from "react-icons/fa";
import { toast } from "sonner";
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

import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import ResponseCard from "@/components/ResponseCard"; // Importa el nuevo componente

function Page() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [error, setError] = useState();
  const [openModal, setOpenModal] = useState();

  const [message, setMessage] = useState("");
  const [lastWord, setLastWord] = useState("");
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState(false);
  const [responses, setResponses] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [response, setResponse] = useState(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState();

  const handleResponseChange = (e) => {
    const text = e.target.value;
    setResponse(text);
  };

  const handleProjectTypeChange = (e) => {
    setSelectedProjectType(e.target.value);
    console.log(selectedProjectType);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleProjectSubmit = async (e) => {
    const author = user?.email;

    e.preventDefault();

    const formData = new FormData(e.target.closest("form"));

    const title = formData.get("title");

    if (title.includes("/")) {
      toast.error("The title cannot contain a slash '/' character.");
      setIsSubmitDisabled(true);
      return;
    }
    const content = formData.get("content");

    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`/api/request/${lastWord}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              content,
              projectType: selectedProjectType,
            }),
          });

          if (res.status === 400) {
            reject(new Error("The name of the project is already in use"));
          } else if (res.status === 200) {
            resolve();
          } else {
            reject(new Error("Failed to submit project"));
          }
        } catch (error) {
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Submitting changes...",
      success: "Request changed successfully!",
      error: "Failed to change request!",
    });
  };

  useEffect(() => {
    if (lastWord) {
      const fetchResponses = async () => {
        try {
          const res = await fetch(`/api/response/${lastWord}`, {
            method: "GET",
          });
          if (res.ok) {
            const data = await res.json();
            setResponses(data);
          } else {
            console.error("Failed to fetch request data");
          }
        } catch (error) {
          console.error(
            "An error occurred while fetching request data:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

      fetchResponses();
    }
  }, [lastWord]);

  const handleResponseSubmit = async (e) => {
    e.preventDefault();

    const email = user.email;

    const requestData = {
      response,
      author: email,
    };

    const promise = () =>
      new Promise(async (resolve, reject) => {
        const timer = setTimeout(() => {
          toast("Please be patient, the uploading box is big", {
            icon: "⌛",
          });
        }, 5000);

        try {
          const response = await fetch(`/api/response/${lastWord}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          clearTimeout(timer);

          const result = await response.json();
          if (response.ok) {
            setMessage("Response uploaded successfully");
            resolve(); // Llama a resolve aquí para indicar que la operación fue exitosa
          } else {
            console.error("Error uploading Response:", result);
            reject(new Error("Error uploading Response")); // Rechaza el promise en caso de error
          }
        } catch (error) {
          clearTimeout(timer); // Asegura que el temporizador también se limpie en caso de error
          console.error("Error uploading Response:", error);
          reject(error); // Rechaza el promise en caso de error
        }
      });

    toast.promise(promise(), {
      loading: "Uploading...",
      success: "Response uploaded successfully",
      error: "Error uploading response",
    });
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");
    const last = pathParts.filter((part) => part.trim() !== "").pop() || "";
    setLastWord(last);
  }, []);

  useEffect(() => {
    if (lastWord) {
      const fetchRequestData = async () => {
        try {
          const res = await fetch(`/api/request/${lastWord}`, {
            method: "GET",
          });
          if (res.ok) {
            const data = await res.json();
            setRequestData(data);
          } else {
            console.error("Failed to fetch request data");
          }
        } catch (error) {
          console.error(
            "An error occurred while fetching request data:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

      fetchRequestData();
    }
  }, [lastWord]);

  return (
    <div>
      <Navbar />

      <div className="App text-black dark:text-white w-full">
        {loading ? (
          <p>Loading...</p>
        ) : requestData ? (
          <div>
            <div className="bg-gray-100 dark:bg-black w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-black dark:text-white">
              <div className="w-full">
                <div className="flex gap-3 m-10 flex-col">
                  <div className="flex gap-5">
                    <button className="align-middle" onClick={router.back}>
                      <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold self-center">
                      {requestData.title}
                    </h1>
                    <>
                      {user?.email == requestData?.author ? (
                        <Button
                          className="hover:border-white h-fit bg-green-700"
                          onClick={() => setOpenModal(true)}
                        >
                          <div className="flex gap-5 align-middle">
                            <div>
                              <FaEdit />
                            </div>
                          </div>
                        </Button>
                      ) : (
                        ""
                      )}

                      <Modal
                        className="bg-black/75"
                        show={openModal}
                        onClose={() => setOpenModal(false)}
                      >
                        <Modal.Header>Edit request</Modal.Header>
                        <Modal.Body>
                          <form
                            onSubmit={handleProjectSubmit}
                            onChange={() => {
                              setIsSubmitDisabled(false);
                            }}
                            className="flex max-w-md flex-col gap-4"
                          >
                            <div className="flex flex-row gap-10">
                              <div>
                                <div className="mb-2 block">
                                  <Label htmlFor="title" value="Title:" />
                                </div>
                                <TextInput
                                  id="title"
                                  name="title"
                                  placeholder={requestData.title}
                                  type="title"
                                  autoComplete="off"
                                  onChange={handleTitleChange}
                                />
                              </div>
                              <div className="max-w-md">
                                <div className="mb-2 block">
                                  <Label htmlFor="type" value="type" />
                                </div>
                                <Select
                                  id="type"
                                  type="type"
                                  name="type"
                                  value={selectedProjectType}
                                  onChange={handleProjectTypeChange}
                                >
                                  <option value="" disabled>
                                    Choose a category
                                  </option>
                                  <option value="Math">Math</option>
                                  <option value="Chemestry">Chemestry</option>
                                  <option value="Social science">
                                    Social science
                                  </option>
                                  <option value="English">English</option>
                                  <option value="Technology">Technology</option>
                                  <option value="Farandula">Farandula</option>
                                  <option value="Pruebas Icfes">
                                    Pruebas Icfes
                                  </option>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <div className="mb-2 block">
                                <Label htmlFor="content" value="Content:" />
                              </div>
                              <TextInput
                                id="content"
                                type="content"
                                name="content"
                                onChange={handleContentChange}
                                placeholder={requestData.content}
                                autoComplete="off"
                              />
                            </div>

                            <Button
                              type="submit"
                              className="text-black border-2 border-black/50 dark:border-white/50 dark:text-white"
                              disabled={isSubmitDisabled}
                            >
                              Submit
                            </Button>
                          </form>
                        </Modal.Body>
                      </Modal>
                    </>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Author: {requestData.author}
                    </p>
                    <p className="mt-7">Description: {requestData.content}</p>
                  </div>
                </div>

                <main className="m-10 mt-0 h-screen">
                  <div className="flex align-middle mt-10">
                    <h1 className="text-2xl font-bold">Responses:</h1>

                    <Button
                      className="dark:bg-gray-700 ml-4 bg-gray-100 text-black dark:text-white dark:hover:bg-gray-600 flex items-center justify-center"
                      onClick={() => setUploadModal(true)}
                    >
                      <FaPlus />
                    </Button>
                  </div>
                  <div className="mt-5">
                    {responses.map((resp) => (
                      <ResponseCard
                        key={resp.id}
                        response={resp}
                        requestTitle={lastWord}
                      />
                    ))}
                  </div>

                  <>
                    <Modal
                      className="bg-black/75 "
                      show={uploadModal}
                      onClose={() => setUploadModal(false)}
                    >
                      <Modal.Header className="bg-white dark:bg-black text-black dark:text-white">
                        Upload a Response:
                      </Modal.Header>
                      <Modal.Body className="bg-white dark:bg-black text-black dark:text-white">
                        <form className="" onSubmit={handleResponseSubmit}>
                          <div className="overflow-y-auto max-h-[70vh]">
                            <div className="flex items-center">
                              <label
                                htmlFor="description"
                                className="font-bold text-black dark:text-white"
                              >
                                Response:
                              </label>
                            </div>

                            <Textarea
                              className="mt-5"
                              id="description"
                              name="description"
                              onChange={handleResponseChange}
                              placeholder="Give a response about the request:"
                              required
                              rows={10}
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
            </div>
          </div>
        ) : (
          <p>No data found for this request.</p>
        )}
      </div>
    </div>
  );
}

export default Page;
