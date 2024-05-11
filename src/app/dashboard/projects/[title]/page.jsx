"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Link } from "lucide-react";
import { useSession } from "next-auth/react";

function Page() {
  const { data: session, status } = useSession();
  const [project, setProject] = useState({});
  const author = session?.user?.email;

  useEffect(() => {
    if (status === "authenticated") {
      getProject();
    }
  }, [status]);

  const router = useRouter();

  const getProject = async () => {
    try {
      const res = await fetch(`/api/project/${author}`, {
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

  const handleDelete = () => {};

  return (
    <div>
      <Navbar />

      <div className="bg-black w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#ffffff]">
        <div className="w-full">
          <div className="m-10 text-2xl border-b pb-5 flex gap-6 border-indigo-100 font-semibold">
            <button onClick={router.back}>
              <FaArrowLeft />{" "}
            </button>{" "}
            <h2>{project?.title}</h2>{" "}
            <h3 className="text-gray-400 text-xl"> {project?.description} </h3>
          </div>

          <main>
            <h2 className="m-10 text-2xl pb-5 flex gap-6 font-semibold">
              here you will have the info of your project, start to add files to
              it!
            </h2>
            <div className="m-10"> {project?.content}</div>
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
              href="dashboard/projects/"
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full  "
            >
              Collaborators
            </a>
            <a
              href="dashboard/projects/"
              className="flex items-center px-3 py-2.5 font-semibold hover:border hover:rounded-full  "
            >
              social
            </a>

            <button
              onClick={handleDelete}
              className="flex items-center px-3 py-2.5 font-semibold hover:border-2 hover:rounded-full border-red-950  "
            >
              delete project
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Page;
