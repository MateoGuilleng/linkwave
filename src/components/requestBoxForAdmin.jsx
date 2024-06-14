import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFile,
  FaFileCode,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { Label, Textarea } from "flowbite-react";

const SortableRequestList = ({ items = [], projectName, projectId }) => {
  console.log("projectName", projectName);
  const BoxDescription = ({ description }) => {
    const createMarkup = (htmlContent) => ({ __html: htmlContent });

    return (
      <div className="box-description w-full border-t-2 pt-2 border-white/45">
        <div dangerouslySetInnerHTML={createMarkup(description)} />
      </div>
    );
  };

  const handleAccept = async (item) => {
    return toast.promise(
      async () => {
        try {
          // Clone the item object and change the property name
          const box = {
            ...item,
            boxFiles: item.requestBoxFiles,
          };
          delete box.requestBoxFiles;
          const requestBoxId = item.identifier;
          const response = await fetch("/api/boxes/request/manageBox", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ box, projectId, requestBoxId }),
          });

          if (!response.ok) {
            throw new Error("Failed to create box");
          }

          const data = await response.json();
          console.log(data.message); // Server success message

          return data;
        } catch (error) {
          console.error("Error accepting item:", error);
          throw error;
        }
      },
      {
        loading: "Creating box...",
        success: (data) => {
          return `Box created successfully: ${data.message}`;
        },
        error: "Error accepting box",
      }
    );
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectTitle: projectName, // Asegúrate de que esta clave coincida con la que esperas en el backend
        }),
      });

      if (response.ok) {
        console.log("File deleted successfully");
        return true;
      } else {
        console.error("Failed to delete file:", await response.text());
        return false;
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  };

  const handleDeny = async (item) => {
    console.log("Desde deny", item.requestBoxFiles); // Returns an array with objects, each object has a fileId
    const requestBoxId = item.identifier;

    try {
      // Delete each file from requestBoxFiles before deleting the box
      for (const file of item.requestBoxFiles) {
        const deleted = await handleDeleteFile(file.fileId);
        console.log("deleted", deleted);
        if (!deleted) {
          throw new Error(`Failed to delete file with ID ${file.fileId}`);
        }
      }

      const projectTitle = await projectName;
      // After deleting the files, proceed to delete the box
      const promise = () =>
        new Promise(async (resolve, reject) => {
          try {
            const response = await fetch("/api/boxes/request/manageBox", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ projectTitle, requestBoxId }),
            });

            if (!response.ok) {
              throw new Error("Failed to deny box");
            }

            const data = await response.json();
            console.log(data.message); // Server success message
            resolve(data.message);
          } catch (error) {
            reject(error);
          }
        });

      toast.promise(promise(), {
        loading: "Denying box...",
        success: "Box denied successfully",
        error: "Error denying box",
      });
    } catch (error) {
      console.error("Error denying item:", error);
      toast.error("Error denying box");
    }
  };

  const Item = ({ item }) => (
    <li className="h-fit w-full lg:w-fit max-w-full p-5 bg-black text-white border-2 border-blue-700 rounded-lg flex items-center mb-2">
      <div className="ml-4 w-full">
        <h2 className="text-2xl mb-2 items-center">
          <div className="flex items-center">
            <span className="text-gray-500 mr-2 self-center">
              {item.position}.
            </span>
            <span className="text-3xl font-bold">{item.title}</span>{" "}
            <p className="text-sm ml-5">
              Uploaded by: {item.author ? item.author : "Admin"}
            </p>
            <span className="text-4xl ml-10">
              {item.category === "fileVanilla" && <FaFile />}
              {item.category === "File" && <FaFileCode />}
              {item.category === "Picture" && <FaFileImage />}
              {item.category === "Video" && <FaFileVideo />}
              {item.category === "Text" && <FaFilePdf />}
              {item.category === "Audio" && <FaFileAudio />}
            </span>
          </div>
        </h2>

        <span className="text-gray-500 ml-2 text-xs">{item.identifier}.</span>

        <div className="flex items-center gap-3">
          {item.filetype === "application/pdf" && <FaFilePdf />}
          {item.filetype?.startsWith("image/") && <FaFileImage />}
          {item.filetype?.startsWith("video/") && <FaFileVideo />}
          {item.filetype?.startsWith("audio/") && <FaFileAudio />}
          <a
            className="hover:border-b-2"
            href={`/api/files/downloadFile/${item.fileId}`}
            download={item.filename}
          >
            {item.filename}
          </a>
        </div>

        {item?.requestBoxFiles?.length > 0 && (
          <div className="mt-2 w-full">
            <Label className="text-lg font-semibold" value="Files:" />
            <ul className="mt-2">
              {item.requestBoxFiles.map((file) => (
                <li
                  key={file.fileId}
                  className="flex items-center gap-2 hover:border-b-2"
                >
                  <a href={`/api/files/downloadFile/${file.fileId}`}>
                    {file.filename}
                  </a>
                  {file.filetype === "application/pdf" && <FaFilePdf />}
                  {file.filetype?.startsWith("image/") && <FaFileImage />}
                  {file.filetype?.startsWith("video/") && <FaFileVideo />}
                  {file.filetype?.startsWith("audio/") && <FaFileAudio />}
                </li>
              ))}
            </ul>
          </div>
        )}

        <BoxDescription description={item.description} />

        <div className="flex gap-2 mt-3">
          <button
            className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => {
              toast.warning("Are you sure you want to accept this request?", {
                action: {
                  label: "Confirm",
                  onClick: () => handleAccept(item),
                },
              });
            }}
          >
            <FaCheck className="mr-1" /> Accept
          </button>
          <button
            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              toast.warning("Are you sure you want to deny this request?", {
                action: {
                  label: "Confirm",
                  onClick: () => handleDeny(item),
                },
              });
            }}
          >
            <FaTimes className="mr-1" /> Deny
          </button>
        </div>
      </div>
    </li>
  );

  return (
    <div className="">
      <ul className="flex gap-3 flex-wrap justify-between mt-10 w-full">
        {items.map((item) => (
          <Item key={item.identifier} item={item} />
        ))}
      </ul>
    </div>
  );
};

export default SortableRequestList;
