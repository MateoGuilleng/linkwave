import React from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import { useRouter } from "next/navigation";

function Navbar({ using }) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const use = using;
  return (
    <div>
      {user ? (
        <div className="w-full h-16 backdrop-filter backdrop-blur-xl bg-opacity-20 border-b flex items-center justify-center   top-0 z-10 bg-fuchsia-950">
          <div className="max-w-7xl mx-10 w-full flex items-center justify-between p-4 backdrop-filter ">
            <Link
              className="hover:text-fuchsia-500 transition-colors text-xs sm:text-base"
              href="/"
            >
              Projectfully
            </Link>
            <ul className="flex gap-8 ">
              <li>
                <DarkThemeToggle className="p-0" />
              </li>
              <li>
                <Link
                  className={`hover:text-fuchsia-500 transition-colors text-xs sm:text-base ${
                    use == "feed"
                      ? "border-b-4 hover:border-fuchsia-500"
                      : "text-white"
                  }`}
                  href="/feed"
                >
                  feed
                </Link>
              </li>

              <li>
                <Link
                  className={`hover:text-fuchsia-500 border-2 p-2 hover:border-fuchsia-500 transition-colors text-xs sm:text-base px-3 py-1 rounded  ${
                    use == "dashboard"
                      ? "border-b-4 hover:border-fuchsia-500"
                      : "text-white"
                  }`}
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="w-full h-16 backdrop-filter backdrop-blur-xl bg-opacity-20 border-b flex items-center justify-center sticky  top-0 z-10 bg-fuchsia-950">
          <div className="max-w-7xl w-full flex items-center justify-between p-4 backdrop-filter ">
            <Link
              className="hover:text-fuchsia-500 transition-colors text-xs sm:text-base"
              href="/"
            >
              Insightful
            </Link>
            <ul className="flex gap-8 align-middle items-center">
              <li>
                <Link
                  className="hover:text-fuchsia-500 transition-colors text-xs sm:text-base"
                  href="/feed"
                >
                  Explore
                </Link>
              </li>
              <li>
                <button
                  className="hover:text-fuchsia-500 hover:border-fuchsia-500 transition-colors text-xs sm:text-base border-2 px-3 py-1 rounded"
                  onClick={() => router.push("/api/auth/login")}
                >
                  Log in
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
