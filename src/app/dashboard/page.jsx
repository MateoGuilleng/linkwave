"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button, Modal, Label, FileInput, DarkThemeToggle } from "flowbite-react";

import { HiOutlineExclamationCircle, HiSave } from "react-icons/hi";

function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [picModal, setPicModal] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [formFilled, setFormFilled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchData();
    }
  }, [session]);

  const email = session?.user?.email;
  const fetchData = async () => {
    if (session && session.user && session.user.email) {
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

  const handleChange = () => {
    const formFields = document.querySelectorAll("form input, form textarea");
    for (const field of formFields) {
      if (field.value) {
        setFormFilled(true);
        return;
      }
    }
    setFormFilled(false);
  };

  const handleUploadImage = (e) => {
    const archivoSeleccionado = e.target.files[0];

    // Verificar si el archivo es de un tipo permitido
    const tiposPermitidos = [
      "image/svg+xml",
      "image/png",
      "image/jpeg",
      "image/gif",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = session?.user?.email; // Asegúrate de tener acceso a la dirección de correo electrónico del usuario
    let firstName = formData.get("firstName");
    let lastName = formData.get("lastName");
    let profession = formData.get("profession");
    let bio = formData.get("bio");

    // Verificar si el campo está vacío y reemplazar con el valor del placeholder
    if (!firstName.trim()) {
      firstName = e.target
        .querySelector("#first_name")
        .getAttribute("placeholder");
    }
    if (!lastName.trim()) {
      lastName = e.target
        .querySelector("#last_name")
        .getAttribute("placeholder");
    }
    if (!profession.trim()) {
      profession = "unknown";
    }
    if (!bio.trim()) {
      bio = "unknown";
    }

    try {
      const res = await fetch(`/api/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          profession,
          bio,
        }),
      });

      // Comprobar si la solicitud fue exitosa
      if (res.ok) {
        // Convertir la respuesta a formato JSON
        const data = await res.json();
        // Imprimir la respuesta en la consola
        console.log("Respuesta del servidor:", data);
        // Mostrar el modal
        setShowModal(true);
        // Reiniciar la página después de 2 segundos
        setTimeout(() => {
          router.refresh();
        }, 2000);
        setTimeout(() => {
          setShowModal(false);
        }, 2000);
      } else {
        // Imprimir un mensaje de error si la solicitud no fue exitosa
        console.error("Error en la solicitud:", res.statusText);
      }
    } catch (error) {
      console.log("Error de red:", error);
    }
  };

  const handleDeleteImagePreview = async (e) => {
    setImagePreview(null);
    setArchivo(null);
  };


  const handleSaveImage = async (e) => {
    e.preventDefault();
    const email = session?.user?.email; // Asegúrate de tener acceso a la dirección de correo electrónico del usuario

    const formImageData = new FormData();
    try {
      if (archivo ?? false) {
        formImageData.append("file", archivo);
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
        console.log(imageLink);

        const firstName = await userData.firstName;
        const lastName = await userData.lastName;
        const profession = await userData.profession;
        const bio = await userData.bio;
        
        const proyectResponse = await fetch(`/api/${email}`, {
          method: "PUT",
          body: JSON.stringify({
            firstName,
            lastName,
            profession,
            bio,
            imageLink,
          }),
        });

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

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar using={"dashboard"} />
      <div className="bg-black w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#ffffff]">
        <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
          <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
            <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
            <a
              href="/dashboard"
              className="flex items-center px-3 py-2.5 font-bol bg-slate-200  text-black border rounded-full"
            >
              Personal info
            </a>
            <a
              href="dashboard/projects/"
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full  "
            >
              Projects
            </a>
            <a
              href="dashboard/account"
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full"
            >
              Account Settings
            </a>
            <a
              href="dashboard/notifications"
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full  "
            >
              Notifications
            </a>
          </div>
        </aside>
        <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
          <div className="p-2 md:p-4">
            <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
              <h2 className="pl-6 text-2xl font-bold sm:text-xl">
                Welcome {userData?.firstName || ""} {userData?.lastName || ""} <DarkThemeToggle/>
              </h2>

              <div className="grid max-w-2xl mx-auto mt-8">
                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                  <img
                    className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                    src={userData?.profile_image || ""}
                    alt="Bordered avatar"
                  />
                  <div className="flex flex-col space-y-5 sm:ml-8">
                    <>
                      <Button
                        className="hover:border-white bg-green-700"
                        onClick={() => setPicModal(true)}
                      >
                        <div className="flex gap-5 align-middle">
                          <div>Change profile image</div>
                        </div>
                      </Button>
                      <Modal
                        className="bg-black/75"
                        show={picModal}
                        onClose={() => setPicModal(false)}
                      >
                        <Modal.Header>Upload New Avatar:</Modal.Header>
                        <Modal.Body>
                          <div className="overflow-y-auto max-h-[70vh]">
                            <div className="flex w-full items-center justify-center">
                              <Label
                                htmlFor="dropzone-file"
                                className="flex h-34 w-full mb-10 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
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
                                    Your Uploaded Avatar
                                  </div>
                                  <img
                                    src={imagePreview}
                                    alt="Vista previa de la imagen"
                                    className="max-w-full max-h-[400px]"
                                  />
                                  <div className="mt-4 w-full flex flex-row justify-start">
                                    <Button.Group>
                                      <Button
                                        onClick={(e) => handleSaveImage(e)}
                                        className="hover:border-white bg-blue-600"
                                      >
                                        <HiSave className="mr-3 h-4 w-4" />
                                        Save
                                      </Button>

                                      <Button
                                        onClick={() =>
                                          handleDeleteImagePreview()
                                        }
                                        className="hover:border-white"
                                      >
                                        Remove Avatar
                                      </Button>
                                    </Button.Group>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </>
                    <>
                      <Button
                        className="border-w hover:bg-red-800"
                        onClick={() => setOpenModal(true)}
                      >
                        Sign out
                      </Button>
                      <Modal
                        show={openModal}
                        size="md"
                        onClose={() => setOpenModal(false)}
                        popup
                        className="bg-black/75"
                      >
                        <Modal.Header />
                        <Modal.Body>
                          <div className="text-center">
                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                              Are you sure you want to sign out?
                            </h3>
                            <div className="flex justify-center gap-4">
                              <Button
                                color="failure"
                                onClick={() => {
                                  setOpenModal(false);
                                  signOut();
                                  router.replace("/");
                                }}
                              >
                                {"Yes, Im sure"}
                              </Button>
                              <Button
                                color="gray"
                                onClick={() => setOpenModal(false)}
                              >
                                No, cancel
                              </Button>
                            </div>
                          </div>
                        </Modal.Body>
                      </Modal>
                    </>

                    <div
                      id="popup-modal"
                      tabIndex={-1}
                      className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                    >
                      <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                          <button
                            type="button"
                            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="popup-modal"
                          >
                            <svg
                              className="w-3 h-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 14"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                              />
                            </svg>
                            <span className="sr-only">Close modal</span>
                          </button>
                          <div className="p-4 md:p-5 text-center">
                            <svg
                              className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                              Are you sure you want to delete this product?
                            </h3>
                            <button
                              onClick={() => {
                                signOut();
                                router.push("/feed");
                              }}
                              data-modal-hide="popup-modal"
                              type="button"
                              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                            >
                              Yes, Im sure
                            </button>
                            <button
                              data-modal-hide="popup-modal"
                              type="button"
                              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            >
                              No, cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit} onChange={handleChange}>
                  <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                    <h2 className=" text-2xl font-bold mb-10 sm:text-xl text-white">
                      Edit info:
                    </h2>
                    <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                      <div className="w-full">
                        <label
                          htmlFor="first_name"
                          className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                        >
                          first name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="first_name"
                          className="bg-black border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                          placeholder={userData?.firstName || ""}
                          defaultValue={session.user.name}
                          required=""
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="last_name"
                          className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                        >
                          last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="last_name"
                          className="bg-black border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                          placeholder={userData?.lastName || ""}
                          defaultValue={session.user.name}
                          required=""
                        />
                      </div>
                    </div>

                    <div className="mb-2 sm:mb-6">
                      <label
                        htmlFor="profession"
                        className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                      >
                        Profession
                      </label>
                      <input
                        type="text"
                        name="profession"
                        id="profession"
                        className="bg-trasparent border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder={userData?.profession || ""}
                        required=""
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        htmlFor="message"
                        className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white"
                      >
                        Bio
                      </label>
                      <textarea
                        id="message"
                        name="bio"
                        rows={4}
                        className="block p-2.5 w-full text-sm text-white bg-black rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 "
                        placeholder={userData?.bio || ""}
                        defaultValue={""}
                      />
                    </div>
                    <div className="flex justify-end">
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
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
      {showModal && (
        <div className="fixed bottom-0 right-0 z-50">
          <div className="bg-green-500 text-white rounded-lg p-4 shadow-lg m-10">
            <p className="text-lg font-semibold">
              Datos de usuario actualizados
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
