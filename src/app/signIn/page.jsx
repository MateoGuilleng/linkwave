import Link from "next/link";
import Image from "next/image";
export default function page() {
  return (
    <div>
      <Navbar />
      <section>
        <Form />
      </section>
    </div>
  );
}

function Navbar() {
  return (
    <div className="w-full h-16 backdrop-filter backdrop-blur-xl bg-opacity-20 border-b flex items-center justify-center sticky  top-0 z-10 bg-fuchsia-950">
      <div className="max-w-7xl w-full flex items-center justify-between p-4 backdrop-filter ">
        <Link
          className="hover:text-fuchsia-500 transition-colors text-xs sm:text-base"
          href="/"
        >
          Insightful
        </Link>
        <ul className="flex gap-8">
          <li>Doesn't have an account yet?</li>
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

function Form() {
  return (
    <div className="p-10 w-full items-center">
      <h1 className="mb-8 font-extrabold text-4xl w-full items-center justify-center">
        Sign in
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form>
          <div className="mt-4">
            <label className="block font-semibold" htmlFor="email">
              Email
            </label>
            <input
              className="w-full shadow-inner bg-slate-900 rounded-lg text-black placeholder-black text-2xl p-4 border-none block mt-1"
              id="email"
              type="email"
              name="email"
              required="required"
            />
          </div>
          <div className="mt-4">
            <label className="block font-semibold" htmlFor="password">
              Password
            </label>
            <input
              className="w-full shadow-inner bg-slate-900 rounded-lg placeholder-black text-2xl p-4 border-none block mt-1 "
              id="password"
              type="password"
              name="password"
              required="required"
              autoComplete="new-password"
            />
          </div>
          <div className="flex items-center justify-between mt-8">
            <button
              type="submit"
              className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 md:py-4 md:text-lg md:px-10"
            >
              Sign in
            </button>
          </div>
        </form>
        <aside className="">
          <div className="bg-slate-900 p-8 rounded backdrop-filter">
            <h2 className="font-bold text-2xl ">Instructions</h2>
            <ul className="list-disc mt-4 list-inside text-gray-500 ">
              <li>
                All users must provide a valid email address and password to
                create an account.
              </li>
              <li>
                Users must not use offensive, vulgar, or otherwise inappropriate
                language in their username or profile information
              </li>
              <li>
                Users must not create multiple accounts for the same person.
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
