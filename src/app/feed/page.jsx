"use client";

import React, { useState, useEffect } from "react";
import AOS from "aos"; // Importa AOS
import "aos/dist/aos.css"; // Importa los estilos de AOS

import { useRouter } from "next/navigation";
import {
  Banner,
  Tabs,
  Dropdown,
  TextInput,
  Button,
  Select,
} from "flowbite-react";
import UserProfile from "@/components/UserProfile";
import RequestCard from "@/components/RequestCard";
import ProjectCard from "@/components/ProjectCard";
import { MdDashboard, MdAnnouncement } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa"; // Importa el icono de flecha hacia abajo

import CustomDrawerFeed from "@/components/sideBarFeed";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  HiArchive,
  HiPaperClip,
  HiPencil,
  HiGlobe,
  HiOutlineSpeakerphone,
  HiCamera,
  HiX,
  HiOutlineArrowRight,
  HiSpeakerphone,
  HiDesktopComputer,
  HiPresentationChartLine,
} from "react-icons/hi";
import { toast } from "sonner";
import { Fa500Px, FaGlassCheers } from "react-icons/fa";

export default function UsersPage() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [projectsCopy, setProjectsCopy] = useState(null);

  const [users, setUsers] = useState([]);
  const [usersCopy, setUsersCopy] = useState([]);

  const [requests, setRequests] = useState([]);
  const [requestsCopy, setRequestsCopy] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const { user, isLoading } = useUser();
  const [userData, setUserData] = useState(null);
  const [userFollowingProjects, setUserFollowingProjects] = useState(null);

  const [searchQuery, setSearchQuery] = useState(null);

  // Estado para controlar cuántos proyectos se muestran
  const [visibleProjects, setVisibleProjects] = useState(6);

  const [visibleRequests, setVisibleRequests] = useState(2);

  // Función para cargar más proyectos
  const handleLoadMore = () => {
    setVisibleProjects((prevVisibleProjects) => prevVisibleProjects + 8);
  };

  // Función para cargar más requests
  const handleLoadMoreRequests = () => {
    setVisibleRequests((prevVisibleRequests) => prevVisibleRequests + 2);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    console.log(selectedType);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000, // Duración de la animación en milisegundos
    });
  }, []);

  const email = user?.email;
  useEffect(() => {
    if (email) {
      fetchData();
    }
  }, [user]);

  console.log(userFollowingProjects);
  console.log(users);

  const fetchData = async () => {
    if (user) {
      try {
        const response = await fetch(`/api/${email}`);
        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      try {
        const response = await fetch(`/api/${email}/projects`);
        const userFollowingProjects = await response.json();
        setUserFollowingProjects(userFollowingProjects);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      console.error("Session or user is null or undefined.");
    }
  };

  useEffect(() => {
    fetch("api/request")
      .then((response) => response.json())
      .then((data) => {
        setRequests(data);
        setRequestsCopy(data);
      })
      .catch((error) => console.error("Error fetching requests:", error));
  }, []);

  useEffect(() => {
    fetch("api/project")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setProjectsCopy(data);
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }, []);

  useEffect(() => {
    fetch("api/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setUsersCopy(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    let queryFilteredProjects = [];
    let queryFilteredUsers = [];
    let queryFilteredRequests = [];

    if (selectedType === "all") {
      queryFilteredProjects = projectsCopy.filter((project) =>
        project?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      queryFilteredUsers = usersCopy.filter((user) =>
        user.nickName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      queryFilteredRequests = requestsCopy.filter((request) =>
        request?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (selectedType === "project") {
      queryFilteredProjects = projectsCopy.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      queryFilteredUsers = []; // No mostrar usuarios
      queryFilteredRequests = []; // No mostrar requests
    } else if (selectedType === "user") {
      queryFilteredUsers = usersCopy.filter((user) =>
        user.nickName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      queryFilteredProjects = []; // No mostrar proyectos
      queryFilteredRequests = []; // No mostrar requests
    } else if (selectedType === "request") {
      queryFilteredRequests = requestsCopy.filter((request) =>
        request?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      queryFilteredProjects = []; // No mostrar proyectos
      queryFilteredUsers = []; // No mostrar usuarios
    }

    setProjects(queryFilteredProjects);
    setUsers(queryFilteredUsers);
    setRequests(queryFilteredRequests);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  // No filtrar requests por categoría seleccionada
  const visibleRequestsToShow = requests.slice(0, visibleRequests);

  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.projectType === selectedCategory)
    : projects;

  return (
    <div className="dark:bg-gray-950 bg-gray-100 text-black w-full">
      <Navbar using="feed" />
      {!user && (
        <Banner>
          <div
            data-aos="fade-up"
            className="flex w-full justify-between border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-4"
          >
            <div className="mx-auto flex items-center">
              <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                <MdAnnouncement className="mr-4 h-4 w-4" />
                <span>
                  You are currently in guest mode, create an account or sign in
                  if you want to access any project&nbsp;
                  <Link
                    href="/"
                    className="inline font-medium text-cyan-600 underline decoration-solid underline-offset-2 hover:no-underline dark:text-cyan-500"
                  >
                    Sign up
                  </Link>
                </span>
              </p>
            </div>
            <Banner.CollapseButton
              color="gray"
              className="border-0 bg-transparent text-gray-500 dark:text-gray-400"
            >
              <HiX className="h-4 w-4" />
            </Banner.CollapseButton>
          </div>
        </Banner>
      )}

      <div
        data-aos="fade-up"
        className="w-full flex flex-col gap-5 px-3 md:px-8 lg:px-12"
      >
        <div className="flex mt-10 gap-3">
          <CustomDrawerFeed
            followingUsers={userData?.following}
            followingProjects={userFollowingProjects?.projects}
          />
          <Select
            id="type"
            type="type"
            required
            name="type"
            value={selectedType}
            onChange={handleTypeChange}
            className="w-1/3"
          >
            <option value="" disabled>
              Filter
            </option>
            <option value="all">All</option>
            <option value="project">Project</option>
            <option value="user">User</option>
            <option value="request">Request</option>
          </Select>
          <TextInput
            id="search"
            type="search"
            placeholder="Search for a nickname, user, or project title!"
            onChange={handleSearchChange}
            name="search"
            autoComplete="off"
            className="w-1/2"
          />
          <Button onClick={handleSearchSubmit}>
            <HiOutlineArrowRight className="h-6 w-6 text-black dark:text-white" />
          </Button>
        </div>

        {selectedType === "all" || selectedType === "request" ? (
          <div data-aos="fade-up">
            <h2 className="pl-3 mb-4 text-2xl font-semibold  dark:text-white text-black">
              Recent requests:
            </h2>
            {visibleRequestsToShow.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
                {visibleRequestsToShow.map((request) => (
                  <div
                    onClick={() => {
                      router.push(`requests/${request.title}`);
                    }}
                    key={request._id}
                  >
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
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No requests found for this category.
              </p>
            )}
            {requests.length > visibleRequests && (
              <div className="flex items-center justify-center my-10">
                {/* Líneas horizontales a los lados del botón */}
                <div className="h-px w-16 bg-gray-300 dark:bg-gray-700"></div>
                <button
                  onClick={handleLoadMoreRequests}
                  data-aos="fade-down"
                  className="mx-4 px-6 py-3 flex items-center space-x-2 bg-white text-black rounded-full hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300 shadow-md"
                >
                  Load more requests <FaChevronDown className="ml-2" />
                </button>
                <div className="h-px w-16 bg-gray-300 dark:bg-gray-700"></div>
              </div>
            )}
          </div>
        ) : null}

        {(selectedType === "all" || selectedType === "project") && (
          <div data-aos="fade-up">
            <h2 className="pl-3 mb-4 text-2xl font-semibold text-black dark:text-white">
              Top projects:
            </h2>

            <div className="grid md:flex md:justify-between md:mx-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 text-black dark:text-white">
              <button
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  !selectedCategory
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCategoryClick("")}
              >
                <div className="text-2xl sm:text-3xl">
                  <HiArchive />
                </div>
                <div className="mt-2 p-2 text-sm sm:text-base">All</div>
              </button>
              <button
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  selectedCategory === "Math"
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCategoryClick("Math")}
              >
                <div className="text-2xl sm:text-3xl">
                  <Fa500Px />
                </div>
                <div className="mt-2 p-2 text-sm sm:text-base">Math</div>
              </button>
              <button
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  selectedCategory === "Chemestry"
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCategoryClick("Chemestry")}
              >
                <div className="text-2xl sm:text-3xl">
                  <FaGlassCheers />
                </div>
                <div className="mt-2 text-sm sm:text-base">Chemestry</div>
              </button>
              <button
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  selectedCategory === "Social science"
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCategoryClick("Social science")}
              >
                <div className="text-2xl sm:text-3xl">
                  <HiGlobe />
                </div>
                <div className="mt-2 text-sm sm:text-base">Social science</div>
              </button>
              <button
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  selectedCategory === "English"
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCategoryClick("English")}
              >
                <div className="text-2xl sm:text-3xl">
                  <HiSpeakerphone />
                </div>
                <div className="mt-2 text-sm sm:text-base">English</div>
              </button>
              <button
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  selectedCategory === "Technology"
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCategoryClick("Technology")}
              >
                <div className="text-2xl sm:text-3xl">
                  <HiDesktopComputer />
                </div>
                <div className="mt-2 text-sm sm:text-base">Technology</div>
              </button>
              <button
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  selectedCategory === "Farandula"
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCategoryClick("Farandula")}
              >
                <div className="text-2xl sm:text-3xl">
                  <HiCamera />
                </div>
                <div className="mt-2 text-sm sm:text-base">Farandula</div>
              </button>
              <button
                className={`h-24 sm:h-32 w-full lg:h-40 border-black border dark:bg-white/10 dark:border-white/15  rounded-lg flex flex-col items-center justify-center ${
                  selectedCategory === "Pruebas Icfes"
                    ? "bg-blue-500 dark:bg-blue-500"
                    : "bg-white"
                }`}
                onClick={() => handleCategoryClick("Pruebas Icfes")}
              >
                <div className="text-2xl sm:text-3xl">
                  <HiPresentationChartLine />
                </div>
                <div className="mt-2 text-sm sm:text-base">Pruebas Icfes</div>
              </button>
            </div>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
                {filteredProjects.slice(0, visibleProjects).map((project) => (
                  <ProjectCard
                    key={project?._id}
                    project={project}
                    data-aos="fade-up"
                  />
                ))}
                <p className="m-5 text-black dark:text-white">
                  {filteredProjects.length <= 0 ? "No projects found" : ""}
                </p>
              </div>

              {/* Mostrar el botón "Ver más" solo si hay más proyectos para cargar */}
              {visibleProjects < filteredProjects.length && (
                <div className="flex items-center justify-center my-10">
                  {/* Líneas horizontales a los lados del botón */}
                  <div className="h-px w-16 bg-gray-300 dark:bg-gray-700"></div>
                  <button
                    onClick={handleLoadMore}
                    data-aos="fade-down"
                    className="mx-4 px-6 py-3 flex items-center space-x-2 bg-white text-black rounded-full hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300 shadow-md"
                  >
                    Load more projects <FaChevronDown className="ml-2" />
                  </button>
                  <div className="h-px w-16 bg-gray-300 dark:bg-gray-700"></div>
                </div>
              )}
            </div>
          </div>
        )}

        {(selectedType === "all" || selectedType === "user") && (
          <div data-aos="fade-up">
            <h2 className="pl-3 mb-4 text-2xl font-semibold  dark:text-white text-black">
              Featured users:
            </h2>
            <div className="flex max-w-full gap-6 overflow-x-scroll pb-6">
              {users?.map((user) => (
                <UserProfile
                  key={user._id}
                  userData={user}
                  data-aos="fade-up"
                />
              ))}
              <p className="m-5 text-black dark:text-white">
                {users.length <= 0 ? "No users found" : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
