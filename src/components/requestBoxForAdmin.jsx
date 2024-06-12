import React, { useState, useEffect } from "react";
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
    try {
      // Clonar el objeto item y cambiar el nombre de la propiedad
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
      console.log(data.message); // Mensaje de éxito del servidor

      // Aquí podrías manejar la actualización de estado o cualquier otra lógica necesaria después de aceptar
    } catch (error) {
      console.error("Error accepting item:", error);
      // Aquí podrías manejar el error, por ejemplo, mostrar un mensaje al usuario
    }
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
    console.log("Desde deny", item.requestBoxFiles); // devuelve un array con objetos, cada objeto tiene un fileId
    const requestBoxId = item.identifier;

    try {
      // Eliminar cada archivo de requestBoxFiles antes de eliminar la box
      for (const file of item.requestBoxFiles) {
        const deleted = await handleDeleteFile(file.fileId);
        console.log("deleted", deleted);
        if (!deleted) {
          throw new Error(`Failed to delete file with ID ${file.fileId}`);
        }
      }

      const projectTitle = await projectName;
      // Después de eliminar los archivos, proceder a eliminar la box
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
      console.log(data.message); // Mensaje de éxito del servidor

      // Aquí podrías manejar la actualización de estado o cualquier otra lógica necesaria después de denegar
    } catch (error) {
      console.error("Error denying item:", error);
      // Aquí podrías manejar el error, por ejemplo, mostrar un mensaje al usuario
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
            onClick={() => handleAccept(item)}
          >
            <FaCheck className="mr-1" /> Accept
          </button>
          <button
            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => handleDeny(item)}
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
