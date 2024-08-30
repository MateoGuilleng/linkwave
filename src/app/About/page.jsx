"use client";

import { useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import AOS from "aos"; // Import AOS
import { useRouter } from "next/navigation";
import { HiArchive, HiPaperClip, HiPencil } from "react-icons/hi";
import "aos/dist/aos.css"; // Import AOS styles

export default function About() {
  const router = useRouter();
  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration of animations in milliseconds
    });
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
      {/* Navbar Component */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Hero Section */}
      <header
        className="flex flex-col items-center justify-center w-full h-[80vh] bg-white dark:bg-black text-gray-900 dark:text-white p-8"
        data-aos="fade-down"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">About Linkwave</h1>
        <p className="text-md md:text-xl text-center max-w-2xl">
          Linkwave is an innovative platform created to foster collaboration,
          feedback, and the development of academic projects. It is designed
          specifically to enhance the skills of 10th and 11th-grade students,
          providing a unique space for sharing, learning, and growing together.
        </p>
      </header>

      {/* Objective Section */}
      <section
        className="flex flex-col items-center justify-center w-full py-16 bg-gray-100 dark:bg-gray-900 px-8"
        data-aos="fade-up"
      >
        <div className="flex flex-col items-center max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our Objective
          </h2>
          <p className="text-center text-gray-700 dark:text-gray-300 text-md md:text-lg">
            Linkwave aims to address the lack of motivation and support among
            students by creating a social network that promotes contribution,
            development, and feedback on any academic or creative project. This
            platform is built to be a comfortable space where students can
            interact, improve their skills, and find others who share the same
            interests and goals.
          </p>
          <p className="text-center text-gray-700 dark:text-gray-300 text-md md:text-lg mt-4">
            Our mission is to optimize communication, facilitate collaboration,
            and create a strong educational community by leveraging
            technological tools to support students in achieving their academic
            objectives.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="flex flex-wrap items-start justify-center w-full gap-8 py-16 px-8 bg-white dark:bg-black"
        data-aos="fade-up"
      >
        <div className="max-w-7xl">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            What You Can Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
              <HiArchive className="text-fuchsia-600 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Discover Projects
              </h3>
              <p className="text-center text-gray-700 dark:text-gray-300">
                Explore a wide range of academic projects from different
                subjects and learn from innovative solutions shared by your
                peers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
              <HiPaperClip className="text-fuchsia-600 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Share Your Work
              </h3>
              <p className="text-center text-gray-700 dark:text-gray-300">
                Upload your projects, get constructive feedback, and connect
                with others who share your academic interests.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
              <HiPencil className="text-fuchsia-600 text-4xl mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Collaborate and Learn
              </h3>
              <p className="text-center text-gray-700 dark:text-gray-300">
                Engage in meaningful discussions, offer advice, and learn from
                others. Our platform is built to foster collaboration and mutual
                growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        className="flex flex-col items-center justify-center w-full py-16 bg-gray-100 dark:bg-gray-900 px-8"
        data-aos="fade-up"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Join Us Today!
        </h2>
        <p className="text-center text-gray-700 dark:text-gray-300 text-md md:text-lg max-w-2xl mb-8">
          Become a part of Linkwave and start your journey of growth,
          collaboration, and creativity. Whether you're here to share or to
          discover, there's a place for you at Linkwave.
        </p>
        <button
          className="w-48 h-12 text-sm md:text-base rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-800"
          onClick={() => router.push("/")}
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="w-full py-4 bg-white dark:bg-black text-center text-gray-700 dark:text-gray-300">
        © 2024 Linkwave. All Rights Reserved.
      </footer>
    </main>
  );
}
