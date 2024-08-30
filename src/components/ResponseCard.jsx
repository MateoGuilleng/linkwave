"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "flowbite-react";
import { FaEdit } from "react-icons/fa";

const ResponseCard = ({ response, requestTitle }) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(response.response);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteResponse = async () => {
    const responseID = await response.id;
    const deletePromise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(
            `/api/response/${requestTitle}/${responseID}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (res.ok) {
            console.log(`Response with ID ${response.id} has been deleted`);
            resolve();
          } else {
            console.error("Failed to delete response");
            reject(new Error("Failed to delete response"));
          }
        } catch (error) {
          console.error(
            "An error occurred while deleting the response:",
            error
          );
          reject(error);
        }
      });

    toast.promise(deletePromise(), {
      loading: "Deleting response...",
      success: "Response deleted successfully!",
      error: "Failed to delete response",
    });

    setIsEditing(false);
  };

  const handleUpdateResponse = async () => {
    const updatePromise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`/api/response/${requestTitle}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: response.id,
              response: editText,
              author: user.email,
            }),
          });

          if (res.ok) {
            console.log(
              `Response with ID ${response.id} has been updated to: ${editText}`
            );
            setIsEditing(false);
            resolve();
          } else {
            console.error("Failed to update response");
            reject(new Error("Failed to update response"));
          }
        } catch (error) {
          console.error(
            "An error occurred while updating the response:",
            error
          );
          reject(error);
        }
      });

    toast.promise(updatePromise(), {
      loading: "Updating response...",
      success: "Response updated successfully!",
      error: "Failed to update response",
    });
  };

  const handleInputChange = (e) => {
    setEditText(e.target.value);
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg my-2">
      <div className="flex items-center mb-2">
        <img
          src={response.authorProfileImage}
          alt={`${response.authorFN} ${response.authorLN}`}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold text-black dark:text-white">
            {response.nickname}
          </p>
          <a
            className="font-light text-black dark:text-white"
            href={`/${response.author}`}
          >
            {response.author}
          </a>
          <p className="text-xs text-gray-400">
            {new Date(response.createdAt).toLocaleDateString()}
          </p>
        </div>
        {user && user.email === response.author && (
          <Button
            onClick={handleEditClick}
            className="ml-auto text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            size="xs"
          >
            <FaEdit />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center">
          <input
            type="text"
            value={editText}
            onChange={handleInputChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 mr-2 w-1/2 md:w-full"
          />
          <Button
            onClick={handleUpdateResponse}
            className="ml-2 text-white dark:text-black bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400"
            size="xs"
          >
            Save
          </Button>

          <Button
            onClick={handleDeleteResponse}
            className="ml-2 text-white dark:text-black bg-red-500 hover:bg-red-600 dark:hover:bg-red-400"
            size="xs"
          >
            Delete
          </Button>

          <Button
            onClick={() => {
              setIsEditing(false);
            }}
            className="ml-2 text-white dark:text-black bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400"
            size="xs"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <p className="text-black dark:text-white break-words max-w-full">
          {response.response}
        </p>
      )}
    </div>
  );
};

export default ResponseCard;
