"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [formFilled, setFormFilled] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = session.user.email; // Asegúrate de tener acceso a la dirección de correo electrónico del usuario
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
          router.refresh()
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
                Welcome {userData?.firstName || ""} {userData?.lastName || ""}
              </h2>

              <div className="grid max-w-2xl mx-auto mt-8">
                <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                  <img
                    className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                    src={userData?.profile_image || ""}
                    alt="Bordered avatar"
                  />
                  <div className="flex flex-col space-y-5 sm:ml-8">
                    <button
                      type="button"
                      className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 "
                    >
                      Change picture
                    </button>
                    <button
                      onClick={() => {
                        signOut();
                        router.push("/feed");
                      }}
                      type="button"
                      className="py-3.5 px-7 text-base font-medium text-indigo-900 focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 "
                    >
                      Log Out
                    </button>
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
                          className="bg-black border border-indigo-300 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
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
                          className="bg-black border border-indigo-300 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
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
                        className="bg-black border border-indigo-300 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
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
