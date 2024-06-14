import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFile,
  FaFileCode,
  FaEdit,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import {
  Label,
  TextInput,
  FileInput,
  Button,
  Modal,
  Select,
  Textarea,
} from "flowbite-react";
import { useSession } from "next-auth/react";

const SortableRequestListReadOnly = ({ items = [], projectName }) => {
  const [currentBoxId, setCurrentBoxId] = useState(null); // Nuevo estado para almacenar el ID del box actualmente editado
  const [filesPreview, setFilesPreview] = useState([]); // Estado para la vista previa del archivo
  const [boxCategory, setBoxCategory] = useState("");
  const [boxTitle, setBoxTitle] = useState("");
  const [boxDescription, setBoxDescription] = useState("");
  const [editBoxModal, setEditBoxModal] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const { data: session, status } = useSession();

  const handleTitleChange = (e) => setBoxTitle(e.target.value);
  const handleCategoryChange = (e) => setBoxCategory(e.target.value);
  const handleBoxDescriptionChange = (e) => {
    const text = e.target.value;
    setBoxDescription(text);
  };
  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
  };

  const handleDeleteBox = async (item) => {
    if (item.requestBoxFiles && item.requestBoxFiles.length > 0) {
      console.error("Cannot delete box with existing files");
      setMessage("Cannot delete box with existing files");
      toast.error("Cannot delete box with existing files", {
        description:
          "Please delete all existing files in order to delete the box.",
      });
      return; // Exit the function if there are files in requestBoxFiles
    }

    setCurrentBoxId(item.identifier); // Set the ID of the current box

    try {
      const response = await fetch(`/api/boxes/request/edit/${projectName}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: item.identifier }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete the box");
      }

      const result = await response.json();
      console.log("Box deleted successfully:", result);
      toast.success("Box deleted successfully");
      // Handle client-side state update for box deletion if needed
    } catch (error) {
      console.error("Error deleting box:", error);
      toast.error("Error deleting box", {
        description: error.message,
      });
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectName", projectName);
    formData.append("title", boxTitle);

    try {
      const promise = () =>
        new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(
              `/api/files/requestFiles/${currentBoxId}`,
              {
                method: "PUT",
                body: formData,
              }
            );

            const result = await response.json();
            if (response.ok) {
              console.log("File uploaded successfully", result);
              setMessage("File uploaded successfully");
              resolve(result);
            } else {
              console.error("Error uploading file:", result);
              reject(new Error("Error uploading file"));
            }
          } catch (error) {
            console.error("Error uploading file:", error);
            reject(error);
          }
        });

      toast.promise(promise(), {
        loading: "Uploading file...",
        success: "File uploaded successfully",
        error: "Error uploading file",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

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
  const handleUpdateBoxSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    formData.append("projectID", currentBoxId); // Ensure to add the ID of the currently edited box

    let title = formData.get("title");
    let description = formData.get("description");
    let category = formData.get("type");

    // Check if the field is empty and replace with the placeholder value
    if (!title.trim()) {
      title = e.target.querySelector("#Title").getAttribute("placeholder");
    }
    if (!description.trim()) {
      description = e.target
        .querySelector("#Description")
        .getAttribute("placeholder");
    }
    if (!category?.trim()) {
      category = e.target.querySelector("#type").getAttribute("placeholder");
    }

    formData.set("title", title);
    formData.set("description", description);
    formData.set("category", category);

    try {
      const promise = () =>
        new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(
              `/api/boxes/request/edit/${projectName}`,
              {
                method: "PUT",
                body: formData,
              }
            );

            const result = await response.json();
            if (response.ok) {
              console.log("Box updated successfully", result);
              setMessage("Box updated successfully");

              const newBox = {
                id: currentBoxId,
                title,
                category,
                description,
                filename: result.filename,
                filetype: result.filetype,
              };
              resolve(result);
            } else {
              console.error("Error updating box:", result);
              reject(new Error("Error updating box"));
            }
          } catch (error) {
            console.error("Error updating box:", error);
            reject(error);
          }
        });

      toast.promise(promise(), {
        loading: "Updating box...",
        success: "Box updated successfully",
        error: "Error updating box",
      });
    } catch (error) {
      console.error("Error updating box:", error);
    }
  };

  const handleEditRequestBoxClick = async (item) => {
    setCurrentBoxId(item.identifier); // Establecer el ID del box actual

    // Manejar la vista previa de los archivos de la caja seleccionada
    if (
      item?.requestBoxFiles &&
      Array.isArray(item.requestBoxFiles) &&
      item.requestBoxFiles.length > 0
    ) {
      const files = item.requestBoxFiles.map((file) => ({
        id: file.fileId,
        name: file.filename,
        type: file.filetype,
        url: `/api/files/downloadFile/${file.fileId}`, // URL para descargar el archivo
      }));

      setFilesPreview(files); // Establecer la vista previa de los archivos de la caja
    } else {
      setFilesPreview([]); // Limpiar la vista previa si no hay archivos
    }

    setBoxTitle(item.title); // Establecer el título actual
    setBoxCategory(item.category); // Establecer la categoría actual
    setBoxDescription(item.description); // Establecer la descripción actual

    setEditBoxModal(true); // Abrir el modal de edición
  };

  const handleDeleteFile = async (fileId) => {
    console.log("file Id", fileId);

    const deleteFileFromProject = async () => {
      try {
        console.log(projectName);

        const response = await fetch(`/api/files/requestFiles/${fileId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectTitle: projectName,
          }),
        });

        if (response.ok) {
          console.log("File deleted successfully from project and box");
          return { success: true };
        } else {
          console.error(
            "Failed to delete file from project and box:",
            await response.text()
          );
          return { success: false };
        }
      } catch (error) {
        console.error("Failed to delete file from project and box", error);
        throw error;
      }
    };

    const deleteFileFromUploads = async () => {
      try {
        const response = await fetch(`/api/files/uploadFile`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileId,
          }),
        });

        if (response.ok) {
          console.log("File deleted successfully from uploads");
          return { success: true };
        } else {
          console.error("Failed to delete file:", await response.text());
          return { success: false };
        }
      } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
      }
    };

    toast.promise(
      Promise.all([deleteFileFromProject(), deleteFileFromUploads()]),
      {
        loading: "Deleting file...",
        success: (results) => {
          const [projectResult, uploadsResult] = results;
          if (projectResult.success && uploadsResult.success) {
            return "File deleted successfully";
          } else {
            return "File deleted from project and box, but failed to delete from uploads";
          }
        },
        error: "Failed to delete file",
      }
    );
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
        {message}
        {session?.user?.email === item?.author && (
          <div>
            <button
              className="hover:border-white bg-green-700 mt-5 p-2 rounded-md"
              onClick={() => {
                handleEditRequestBoxClick(item);
              }}
            >
              <div className="flex gap-5 align-middle">
                <FaEdit />
              </div>
            </button>
            <button
              className="hover:border-white ml-4 bg-red-700 mt-5 p-2 rounded-md"
              onClick={() => {
                toast.warning(
                  "Are you sure you want to delete this request box?",
                  {
                    action: {
                      label: "Confirm Delete",
                      onClick: () => handleDeleteBox(item),
                    },
                  }
                );
              }}
            >
              <div className="flex gap-5 align-middle">
                <FaTrash />
              </div>
            </button>
          </div>
        )}
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
      <Modal
        className="bg-black/50"
        show={editBoxModal}
        onClose={() => setEditBoxModal(false)}
      >
        <div className="bg-black border-2 border-white/50 rounded-md">
          <Modal.Header>Edit Request Box</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleUpdateBoxSubmit}>
              <div className="overflow-y-auto max-h-[70vh]">
                <div className="flex gap-10">
                  <div className="mt-5 w-full ">
                    <div className="mb-2 block">
                      <Label htmlFor="Title" value="Title" />
                    </div>
                    <TextInput
                      id="Title"
                      type="text"
                      placeholder={boxTitle} // Usar el título actual como placeholder
                      name="title"
                      autoComplete="off"
                      onChange={handleTitleChange}
                    />
                  </div>
                  <div className="w-full">
                    <div className="mb-2 mt-6 block">
                      <Label htmlFor="Category" value="Category:" />
                    </div>
                    <Select
                      id="type"
                      name="type"
                      value={boxCategory} // Usar value en lugar de selected
                      onChange={handleCategoryChange}
                    >
                      <option value="" disabled>
                        Choose a category
                      </option>
                      <option value="fileVanilla">File</option>
                      <option value="File">Code</option>
                      <option value="Picture">Image</option>
                      <option value="Video">Video</option>
                      <option value="Text">Word</option>
                      <option value="Audio">Audio</option>
                    </Select>
                  </div>
                </div>
                <div className="mt-5 w-full">
                  <div className="mb-2 block">
                    <Label htmlFor="file" value="Upload File" />
                  </div>
                  <div className="flex justify-between">
                    <FileInput
                      id="file"
                      type="file"
                      placeholder="Upload a file"
                      name="file"
                      autoComplete="off"
                      onChange={handleFileChange}
                      className="mr-2 p-2 rounded-lg w-full"
                    />
                    <button
                      onClick={handleFileUpload}
                      disabled={!file}
                      className={`flex items-center justify-center bg-${
                        file ? "blue" : "gray"
                      }-600 text-white py-2 px-4 rounded-lg cursor-${
                        file ? "pointer" : "not-allowed"
                      }`}
                    >
                      <FaUpload className="mr-2" size={20} />
                      Upload
                    </button>
                  </div>

                  <div className="mt-5 w-full flex">
                    <Label value="Current Files:" />
                    {filesPreview &&
                    Array.isArray(filesPreview) &&
                    filesPreview.length > 0 ? (
                      filesPreview.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-2 ml-10"
                        >
                          {file.type && file.type.startsWith("image/") ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                              }}
                            />
                          ) : (
                            <a
                              href={`/api/files/downloadFile/${file.id}`}
                              download={file.name}
                            >
                              {file.name}
                            </a>
                          )}
                          <button
                            type="button"
                            className="text-red-500"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            &times;
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="ml-10">No files uploaded</p>
                    )}
                  </div>
                </div>
                <div className="mt-5 w-full">
                  <div className="mb-2 block">
                    <Label
                      htmlFor="Description"
                      value="Description: (Description Suports HTML Embeded!)"
                    />
                  </div>
                  <Textarea
                    id="Description"
                    type="text"
                    placeholder={boxDescription} // Usar la descripción actual como placeholder
                    name="description"
                    autoComplete="off"
                    value={boxDescription}
                    onChange={handleBoxDescriptionChange}
                    className="w-full min-h-[3rem] p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    style={{
                      minHeight: "3rem", // Altura mínima inicial
                      height: "6rem", // Altura se ajusta automáticamente
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  />
                </div>

                <div className="mt-5 w-full">
                  <Button type="submit" className="bg-slate-800">
                    <div className="self-center">
                      <FaEdit />
                    </div>
                    <p className="p-2">Edit</p>
                  </Button>
                </div>
              </div>
            </form>
          </Modal.Body>
        </div>
      </Modal>
    </div>
  );
};

export default SortableRequestListReadOnly;
