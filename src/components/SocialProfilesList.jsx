import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { Modal, Button, TextInput } from "flowbite-react";

// Mapa de perfiles sociales a íconos
const socialIcons = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  github: FaGithub,
};

const SocialProfilesList = ({ socialProfiles, userEmail }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedIndex, setEditedIndex] = useState(null);
  const [editedUrl, setEditedUrl] = useState("");

  const handleEdit = (index) => {
    setEditedIndex(index);
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/${userEmail}/socialProfiles`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          editedUrl,
          editedIndex,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update social profile");
      }

      setEditMode(false);
      setEditedIndex(null);
      setEditedUrl("");
    } catch (error) {
      console.error("Error updating social profile:", error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedIndex(null);
    setEditedUrl("");
  };

  const handleDelete = async (index) => {
    try {
      const response = await fetch(`/api/${index}/socialProfiles`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(index),
      });

      if (!response.ok) {
        throw new Error("Failed to delete social profile");
      }
      console.log("Perfil social eliminado correctamente");
    } catch (error) {
      console.error("Error deleting social profile:", error);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Your Social Profiles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {socialProfiles?.map((profile, index) => {
          const Icon = socialIcons[profile.social.toLowerCase()];
          return (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-md bg-black"
            >
              <h3 className="text-xl font-semibold text-white flex items-center">
                {Icon && <Icon className="mr-2" />}
                {profile.social}
              </h3>
              <p className="text-sm text-white break-words">{profile.url}</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleEdit(profile._id)}
                  className="p-2 bg-blue-600 text-white rounded-full"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(profile._id)}
                  className="p-2 bg-red-600 text-white rounded-full"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        className="bg-black/75"
        show={editMode}
        size="md"
        onClose={handleCancel}
        popup
      >
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 mt-10 dark:text-white">
              Edit Social Profile URL
            </h3>
            <div>
              <TextInput
                id="editedUrl"
                placeholder="Enter new URL"
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCancel} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleSave} className="ml-2">
                Save
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SocialProfilesList;
