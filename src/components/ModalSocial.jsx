import React, { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { toast } from "sonner";

const ModalSocial = ({ social, onClose }) => {
  const [url, setUrl] = useState("");
  const { user, isLoading } = useUser();

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(`/api/${user.email}/socialProfiles`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              socialProfile: { social, url },
            }),
          });

          if (response.ok) {
            onClose();
            resolve("Profile updated successfully"); // Mensaje de éxito
          } else {
            console.error("Failed to update social profile");
            reject(new Error("Failed to update social profile", response.text)); // Mensaje de error
          }
        } catch (error) {
          console.error("Error updating social profile:", error);
          reject(error); // Mensaje de error
        }
      });

    toast.promise(promise(), {
      loading: "Updating social profile...",
      success: "Social profile updated successfully",
      error: `Failed to update social profile: url already exists`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex justify-center items-center">
      <div className="bg-black border p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Add your {social} profile</h2>
        <div>
          <div className="mb-4">
            <label
              htmlFor="profileUrl"
              className="block mb-2 text-sm font-medium text-white"
            >
              Profile URL
            </label>
            <input
              type="url"
              id="profileUrl"
              name="profileUrl"
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              placeholder={`https://${social.toLowerCase()}.com/your-profile`}
              value={url}
              onChange={handleUrlChange}
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSocial;
