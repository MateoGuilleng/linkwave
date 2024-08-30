// components/RequestCard.js
"use client";

import React from "react";
import { useEffect } from "react";
import { Card } from "flowbite-react";
import AOS from "aos";
import { useRouter } from "next/navigation";

const RequestCard = ({ title, category, content, createdAt, updatedAt }) => {
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 1000, // Duración de la animación en milisegundos
    });
  }, []);

  return (
    <Card
      data-aos="fade-up"
      onClick={() => {
        router.push(`/requests/${title}`);
      }}
      className="mb-4 bg-white w-full dark:bg-gray-800 hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
    >
      <div className="flex justify-around">
        <div>
          <h5 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Category: {category}
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{content}</p>
        </div>
        <div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Created: {new Date(createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Updated: {new Date(updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RequestCard;
