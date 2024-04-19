import Link from "next/link";
export default function page() {
  return (
    <div>
      <Navbar />
    </div>
  );
}

function Navbar() {
  return (
    <div className="w-full h-16 backdrop-filter backdrop-blur-xl bg-opacity-20 border-b flex items-center justify-center sticky  top-0 z-10 bg-fuchsia-950">
      <div className="max-w-7xl w-full flex items-center justify-between p-4 backdrop-filter ">
        <h6 className="font-bold">Insightful</h6>
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
  );
}
