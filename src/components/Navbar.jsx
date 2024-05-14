import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
function Navbar({ using }) {
  const { data: session } = useSession();
  const use = using;
  return (
    <div>
      {session ? (
        <div className="w-full h-16 backdrop-filter backdrop-blur-xl bg-opacity-20 border-b flex items-center justify-center sticky  top-0 z-10 bg-fuchsia-950">
          <div className="max-w-7xl w-full flex items-center justify-between p-4 backdrop-filter ">
            <Link
              className="hover:text-fuchsia-500 transition-colors text-xs sm:text-base"
              href="/"
            >
              Insightful
            </Link>
            <ul className="flex gap-8">
              <DarkThemeToggle />
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
                  className={`hover:text-fuchsia-500 transition-colors text-xs sm:text-base ${
                    use == "dashboard"
                      ? "border-b-4 hover:border-fuchsia-500"
                      : "text-white"
                  }`}
                  href="/dashboard"
                >
                  dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={() => signOut()}
                  className="hover:text-fuchsia-500 transition-colors text-xs sm:text-base"
                >
                  Sign Out
                </button>
              </li>
              <li>
                <Link
                  className={`hover:text-fuchsia-500 hover:border-fuchsia-500 transition-colors text-xs sm:text-base px-3 py-1 rounded  ${
                    use == "projects"
                      ? "border-b-4 hover:border-fuchsia-500"
                      : "text-white"
                  }`}
                  href="/dashboard/projects"
                >
                  projects
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
            <ul className="flex gap-8">
              <li>
                <Link
                  className="hover:text-fuchsia-500 transition-colors text-xs sm:text-base"
                  href="home"
                >
                  Search proyects
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-fuchsia-500 transition-colors text-xs sm:text-base"
                  href="signIn"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-fuchsia-500 hover:border-fuchsia-500 transition-colors text-xs sm:text-base border-2 px-3 py-1 rounded"
                  href="signUp"
                >
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
