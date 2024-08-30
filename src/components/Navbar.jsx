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
        <div className="w-full h-16 backdrop-filter backdrop-blur-xl bg-opacity-20 border-b border-black dark:border-white flex items-center justify-center text-black dark:text-white sticky top-0 z-10 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-10 w-full flex items-center justify-between p-4">
            <Link
              className="text-lg font-bold hover:text-fuchsia-600 transition-colors"
              href="/"
            >
              Linkwave
            </Link>
            <ul className="flex gap-8 text-gray-700 dark:text-gray-300">
              <li>
                <DarkThemeToggle className="p-0" />
              </li>
              <li>
                <Link
                  className={`hover:text-fuchsia-600 transition-colors ${
                    use == "feed"
                      ? "border-b-4 border-fuchsia-600"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  href="/feed"
                >
                  Feed
                </Link>
              </li>
              <li>
                <Link
                  className={`hover:text-fuchsia-600 border-2 p-2 transition-colors rounded ${
                    use == "dashboard"
                      ? "border-fuchsia-600 text-fuchsia-600"
                      : "text-gray-700 dark:text-gray-300 border-gray-700 dark:border-gray-300"
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
        <div className="w-full h-16 backdrop-filter backdrop-blur-xl bg-opacity-20 border-b flex items-center justify-center sticky top-0 z-10 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-10 w-full flex items-center justify-between p-4">
            <Link
              className="text-lg font-bold text-black dark:text-white hover:text-fuchsia-600 transition-colors"
              href="/"
            >
              Linkwave
            </Link>
            <ul className="flex gap-8 align-middle items-center">
              <li>
                <DarkThemeToggle className="p-0" />
              </li>
              <li>
                <Link
                  className="hover:text-fuchsia-600 transition-colors text-gray-700 dark:text-gray-300"
                  href="/feed"
                >
                  Discover
                </Link>
              </li>
              <li>
                <button
                  className="hover:text-fuchsia-600 hover:border-fuchsia-600 transition-colors text-gray-700 dark:text-gray-300 border-2 px-3 py-1 rounded border-gray-700 dark:border-gray-300"
                  onClick={() => router.push("/")}
                >
                  Welcome
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
