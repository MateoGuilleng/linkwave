import React, { useState, useEffect } from "react";
import {
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFile,
  FaFileCode,
} from "react-icons/fa";
import { Label, Textarea } from "flowbite-react";

const SortableListReadOnly = ({ items = [], projectName }) => {
  console.log("items", items);
  const BoxDescription = ({ description }) => {
    const createMarkup = (htmlContent) => ({ __html: htmlContent });

    return (
      <div className="box-description w-full border-t-2 pt-2 border-white/45">
        <div dangerouslySetInnerHTML={createMarkup(description)} />
      </div>
    );
  };
  const [sortedItems, setSortedItems] = useState(
    Array.isArray(items)
      ? [...items].sort((a, b) => a.position - b.position)
      : []
  );

  useEffect(() => {
    setSortedItems(
      Array.isArray(items)
        ? [...items].sort((a, b) => a.position - b.position)
        : []
    );
  }, [items]);
  const Item = ({ item }) => (
    <li className="h-fit w-full lg:w-fit max-w-full p-5 bg-black text-white border-2 rounded-lg flex items-center mb-2">
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

        {item?.boxFiles?.length > 0 && (
          <div className="my-2 w-full">
            <Label className="text-lg font-semibold" value="Files:" />
            <ul className="mt-2">
              {item.boxFiles.map((file) => (
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
      </div>
    </li>
  );

  return (
    <div className="">
      <ul className="flex gap-3 flex-wrap justify-between mt-10 w-full">
        {sortedItems.map((item) => (
          <Item key={item.identifier} item={item} />
        ))}
      </ul>
    </div>
  );
};

export default SortableListReadOnly;
