"use client";

import { useState, useEffect } from "react";
import { initFlowbite } from "flowbite";
import Link from "next/link";
import { FaPlus, FaInfo } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  HiMenu,
  HiChartPie,
  HiLogin,
  HiPencil,
  HiSearch,
  HiUsers,
} from "react-icons/hi";
import Navbar from "@/components/Navbar";
import {
  Modal,
  Label,
  TextInput,
  Card,
  Select,
  Sidebar,
  Button,
  FileInput,
  DarkThemeToggle,
  Drawer,
} from "flowbite-react";

function ProjectsPage() {
  const [selectedProjectType, setSelectedProjectType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  const handleProjectTypeChange = (e) => {
    setSelectedProjectType(e.target.value);
    console.log(selectedProjectType);
  };

  const handleProjectSubmit = async (e) => {
    const author = session?.user?.email;
    e.preventDefault();

    console.log("hol");

    const formData = new FormData(e.target.closest("form"));

    const title = formData.get("title");
    const description = formData.get("description");
    const projectType = formData.get("type");
    const content = formData.get("content");

    if (!title || !content) {
      setError("Title and content are required");
      return;
    }

    try {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          content,
          author,
          projectType: selectedProjectType,
        }),
      });
      if (res.status === 400) {
        setError("The name of the project is already in use");
      }
      if (res.status === 200) {
        setError("");
        router.push(`/dashboard/projects/${title}`);
      }
    } catch (error) {
      setError("Something went wrong, try again");
      console.log(error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      getProjects();
    }
  }, [status]);

  const author = session?.user?.email;
  const getProjects = async () => {
    try {
      const res = await fetch(`/api/project/${author}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        console.error("Failed to fetch projects:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  function onCloseModal() {
    setOpenModal(false);
  }

  return (
    <div>
      <>
        <Drawer open={isOpen} onClose={handleClose}>
          <Drawer.Header title="MENU" titleIcon={() => <></>} />
          <Drawer.Items>
            <Sidebar
              aria-label="Sidebar with multi-level dropdown example"
              className="[&>div]:bg-transparent [&>div]:p-0"
            >
              <div className="flex h-full flex-col justify-between py-2">
                <div>
                  <form className="pb-3 md:hidden">
                    <TextInput
                      icon={HiSearch}
                      type="search"
                      placeholder="Search"
                      required
                      size={32}
                    />
                  </form>
                  <Sidebar.Items>
                    <Sidebar.ItemGroup>
                      <Sidebar.Item href="/dashboard" icon={HiChartPie}>
                        Dashboard
                      </Sidebar.Item>
                      <Sidebar.Item href="/dashboard/projects" icon={HiPencil}>
                        Projects
                      </Sidebar.Item>
                      <Sidebar.Item href="/users/list" icon={HiUsers}>
                        Account Settings
                      </Sidebar.Item>
                      <Sidebar.Item
                        href="/authentication/sign-in"
                        icon={HiLogin}
                      >
                        Notifications
                      </Sidebar.Item>
                    </Sidebar.ItemGroup>
                  </Sidebar.Items>
                </div>
              </div>
            </Sidebar>
          </Drawer.Items>
        </Drawer>
      </>
      <Navbar using={"projects"} />

      <div className="bg-black w-full flex flex-col gap-5 sm:px-5 md:px-10 md:flex-row text-[#ffffff]">
        <aside className="hidden w-full max-w-2xs py-4 md:w-1/3 lg:w-1/4 md:block">
          <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
            <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
            <a
              href="/dashboard"
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full"
            >
              Dashboard
            </a>
            <a
              href=""
              className="flex items-center px-3 py-2.5 font-bold bg-slate-200 text-black border rounded-full"
            >
              Projects
            </a>
            <a
              href="account"
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full"
            >
              Account Settings
            </a>
            <a
              href="notifications"
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full"
            >
              Notifications
            </a>
          </div>
        </aside>

        <main className="w-screen min-h-screen py-1 md:w-2/3 lg:w-3/4">
          <div className="md:p-4 mr-2">
            <div className="w-full px-6 pb-8 mt-8 sm:rounded-lg">
              <div className="flex justify-between mb-10 w-full">
                <Button
                  className="md:hidden visible"
                  onClick={() => setIsOpen(true)}
                >
                  <HiMenu className="w-7 h-7" />
                </Button>
                <h2 className="pl-3 mb-4 text-xl sm:text-2xl font-semibold">
                  Your projects:
                </h2>
                <>
                  <Button
                    className="hover:border-white h-fit bg-green-700"
                    onClick={() => setOpenModal(true)}
                  >
                    <div className="flex gap-5 align-middle">
                      <div>Create new project </div>
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
                    <Modal.Header>New project</Modal.Header>
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
                            />

                            <div className="mt-5 w-60">
                              <div className="mb-2 block">
                                <Label
                                  htmlFor="description"
                                  value="Description"
                                />
                              </div>
                              <TextInput
                                id="description"
                                type="description"
                                placeholder="A brief description of my project"
                                name="description"
                                required
                                autoComplete="off"
                              />
                            </div>
                          </div>
                          <div className="max-w-md">
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
                        </div>
                        <div>
                          <div className="mb-2 block">
                            <Label
                              htmlFor="content"
                              value="Content: (optional)"
                            />
                          </div>
                          <TextInput
                            id="content"
                            type="content"
                            name="content"
                            placeholder="full explanation"
                            autoComplete="off"
                          />
                        </div>

                        <Button type="submit">Submit</Button>
                      </form>
                    </Modal.Body>
                  </Modal>
                </>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <button
                      className="relative text-white px-4 py-2 rounded transition transform hover:-translate-y-1 hover:shadow-lg hover:shadow-white"
                      onClick={() => {
                        router.push(`projects/${project.title}`);
                      }}
                      key={project._id}
                    >
                      <Card
                        className="max-w-sm lg:h-52 lg:text-xs"
                        imgSrc={project.banner}
                        horizontal
                      >
                        <div className="absolute top-5 left-5 px-5 py-2 bg-black bg-opacity-75 text-white text-xs font-semibold">
                          {project.projectType}
                        </div>
                        <h5 className="text-2xl font-bold tracking-tight lg:text-xl lg:pt-0 text-gray-900 dark:text-white">
                          {project.title}
                        </h5>
                        <p className="font-normal text-gray-700 lg:pb-10 dark:text-gray-400">
                          {project.description}
                        </p>
                      </Card>
                    </button>
                  ))
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProjectsPage;
