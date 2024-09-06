// pages/requests.js

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@auth0/nextjs-auth0/client";
import CustomDrawer from "@/components/sideBar";
import CustomAside from "@/components/SideBarPC";
import Navbar from "@/components/Navbar";
import { Modal, Label, TextInput, Select, Button } from "flowbite-react";
import { FaPlus } from "react-icons/fa";
import RequestCard from "@/components/RequestCard"; // Importa el componente RequestCard

function Requests() {
  const { user, isLoading } = useUser();
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [requests, setRequests] = useState([]);

  const getRequests = async () => {
    const author = user?.email;
    try {
      const res = await fetch(`/api/request/session/${author}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        console.error("Failed to fetch projects:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchData();
      getRequests();
    }
  }, [user]);

  const email = user?.email;
  const fetchData = async () => {
    if (user && user.email) {
      try {
        const response = await fetch(`/api/${email}`);
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      console.error("Session or user is null or undefined.");
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.includes("/")) {
      toast.error("The title cannot contain a slash '/' character.");
      setIsSubmitDisabled(true);
    } else {
      setIsSubmitDisabled(false);
    }
    setTitle(value);
  };

  const handleProjectTypeChange = (e) => {
    setSelectedProjectType(e.target.value);
    console.log(selectedProjectType);
  };

  const handleProjectSubmit = async (e) => {
    const author = user?.email;

    e.preventDefault();

    const formData = new FormData(e.target.closest("form"));

    const title = formData.get("title");
    const description = formData.get("description");
    const content = formData.get("content");

    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }
    const authorImage = userData?.profile_image;
    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch("/api/request", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              content,
              author,
              projectType: selectedProjectType,
              authorImage,
            }),
          });

          if (res.status === 400) {
            reject(new Error("The name of the project is already in use"));
          } else if (res.status === 200) {
            router.push(`/requests/${encodeURIComponent(title)}`);
            resolve();
          } else {
            reject(new Error("Failed to submit project"));
          }
        } catch (error) {
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Submitting project...",
      success: "Project submitted successfully!",
      error: "Failed to submit project",
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar using={"requests"} />

      <div className="bg-gray-100 dark:bg-black w-full flex flex-col gap-5 sm:px-5 md:px-10 md:flex-row text-black dark:text-white">
        <CustomAside />

        <main className="w-screen min-h-screen py-1 md:w-2/3 lg:w-3/4">
          <div className="md:p-4 mr-2">
            <div className="w-full px-6 pb-8 mt-8 sm:rounded-lg">
              <div className="flex justify-between mb-10 w-full">
                <CustomDrawer />
                <h2 className="pl-3 mx-4 text-xl sm:text-2xl font-semibold">
                  Your requests
                </h2>

                <>
                  <Button
                    className="hover:border-white h-fit bg-green-700"
                    onClick={() => setOpenModal(true)}
                  >
                    <div className="flex gap-5 align-middle">
                      <div>Create new request </div>
                      <div>
                        <FaPlus />
                      </div>
                    </div>
                  </Button>
                  <Modal
                    className="bg-black/75"
                    show={openModal}
                    onClose={() => setOpenModal(false)}
                  >
                    <Modal.Header>New request</Modal.Header>
                    <Modal.Body>
                      <form
                        onSubmit={handleProjectSubmit}
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
                              type="title"
                              placeholder="Title of my project"
                              required
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
                              required
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
                            placeholder="full explanation"
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

              {/* Renderizar los requests */}
              {requests.map((request) => (
                <div key={request._id}>
                  <RequestCard
                    key={request._id}
                    title={request.title}
                    category={request.category}
                    content={request.content}
                    createdAt={request.createdAt}
                    updatedAt={request.updatedAt}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Requests;
