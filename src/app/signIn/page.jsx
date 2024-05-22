"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();
  const [error, setError] = useState("");
  // const session = useSession();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      if (res?.url) router.replace("/dashboard");
    } else {
      setError("");
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }
  function Form() {
    return (
      <div className="p-10 w-full items-center">
        <h1 className="mb-8 font-extrabold text-4xl w-full items-center justify-center">
          Sign in
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit}>
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
                className="w-full shadow-inner bg-slate-900 rounded-lg text-black placeholder-black text-2xl p-4 border-none block mt-1 "
                id="password"
                type="password"
                name="password"
                required="required"
                autoComplete="new-password"
              />
            </div>
            <div className="flex items-center justify-between mt-8">
              {error}
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
                  Users must not use offensive, vulgar, or otherwise
                  inappropriate language in their username or profile
                  information
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
  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div>
        <Navbar />
        <section>
          <Form />
          <button
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            onClick={() => {
              signIn("github");
            }}
          >
            Sign In with Github
          </button>
        </section>
      </div>
    )
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
          <li>Doesnt have an account yet?</li>
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
