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

const SortableRequestList = ({ items = [], projectName }) => {
  console.log("items", items);
  const BoxDescription = ({ description }) => {
    const createMarkup = (htmlContent) => ({ __html: htmlContent });

    return (
      <div className="box-description w-full">
        <div dangerouslySetInnerHTML={createMarkup(description)} />
      </div>
    );
  };

  const handleAccept = async (item) => {
    const formData = new FormData();
    formData.append("projectID", item.projectID);
    formData.append("title", item.title);
    formData.append("category", item.category);
    formData.append("description", item.description);
    formData.append("file", item); // Aquí podrías incluir el archivo si es necesario

    try {
      const response = await fetch("/api/boxes/uploadBox", {
        method: "POST",
        body: formData,
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

  const handleDeny = (item) => {
    console.log("Denied:", item);
    // Aquí podrías implementar la lógica para denegar el item
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
            <p className="text-sm ml-5">(Request Box Only)</p>
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

        <div className="mt-2 w-full">
          <Label className="text-lg font-semibold" value="Files:" />
          <ul className="mt-2">
            {item.boxFiles?.map((file) => (
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
