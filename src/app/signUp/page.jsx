"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function Page() {
  const [error, setError] = useState("");
  const router = useRouter();

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
            <li>Already have an account?</li>
            <li>
              <Link
                className="hover:text-fuchsia-500 hover:border-fuchsia-500 transition-colors text-xs sm:text-base border-2 px-3 py-1 rounded"
                href="signIn"
              >
                Sign in
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    const email = e.target[2].value;
    const password = e.target[3].value;

    if (!isValidEmail(email)) {
      setError("The email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("The password must be at least 8 characters long");
      return;
    }

    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch("/api/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              password,
            }),
          });

          if (res.status === 400) {
            setError("This email is already in use");
            reject(new Error("This email is already in use"));
          }

          if (res.status === 201) {
            setError("");
            router.push("/dashboard");
            resolve();
          } else {
            reject(new Error("Failed to register user"));
          }
        } catch (error) {
          setError("Something went wrong, try again");
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Registering...",
      success: "User registered successfully",
      error: "Failed to register user",
    });
  };

  function Form() {
    return (
      <div className="p-10">
        <h1 className="mb-8 font-extrabold text-4xl">Register</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block font-semibold" htmlFor="name">
                First Name
              </label>
              <input
                className="w-full shadow-inner bg-slate-900 rounded-lg text-black text-2xl p-4 border-none block mt-1 "
                placeholder="Gumball"
                id="name"
                type="text"
                name="FisrtName"
                required="required"
                autofocus="autofocus"
              />
            </div>
            <div className="mt-4">
              <label className="block font-semibold" htmlFor="name">
                Last Name
              </label>
              <input
                className="w-full shadow-inner bg-slate-900 text-black rounded-lg  text-2xl p-4 border-none block mt-1 "
                placeholder="Waterson"
                id="name"
                type="text"
                name="lastName"
                required="required"
                autofocus="autofocus"
              />
            </div>
            <div className="mt-4">
              <label className="block font-semibold" htmlFor="email">
                Email
              </label>
              <input
                className="w-full shadow-inner bg-slate-900 text-black rounded-lg  text-2xl p-4 border-none block mt-1 "
                placeholder="example@example.com"
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
                className="w-full shadow-inner bg-slate-900 text-black rounded-lg  text-2xl p-4 border-none block mt-1 "
                id="password"
                type="password"
                name="password"
                required="required"
                autoComplete="new-password"
                placeholder="12345678"
              />
            </div>

            <p className="text-red-600 text-[16px] mb-4">{error && error}</p>

            <div className="flex items-center justify-between mt-8">
              <button
                type="submit"
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 md:py-4 md:text-lg md:px-10"
              >
                Register
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

  return (
    <div>
      <Navbar />
      <section>
        <Form />
      </section>
    </div>
  );
}
