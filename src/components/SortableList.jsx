import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFile,
  FaFileCode,
  FaFileWord,
  FaPlus,
  FaUpload,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import {
  Label,
  TextInput,
  FileInput,
  Button,
  Modal,
  Select,
  Textarea,
  Popover,
} from "flowbite-react";

const ItemTypes = {
  CARD: "card",
};

const SortableList = ({ items = [], projectName }) => {
  const [filesPreview, setFilesPreview] = useState([]); // Estado para la vista previa del archivo

  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [boxDescription, setBoxDescription] = useState("");
  const [boxTitle, setBoxTitle] = useState("");
  const [boxCategory, setBoxCategory] = useState("");

  const [currentBoxId, setCurrentBoxId] = useState(null); // Nuevo estado para almacenar el ID del box actualmente editado
  const [editBoxModal, setEditBoxModal] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [hoverIdentifier, setHoverIdentifier] = useState(null);
  const content = (
    <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
      <div className="border-b  px-3 py-2 border-gray-600 bg-gray-700">
        <h3 className="font-semibold text-white">Use your own HTML!</h3>
      </div>
      <div className="px-3 py-2 bg-black">
        <p>
          In the description of any box, you can paste any HTML code, that
          means, you can upload and resize images, put Iframes from spotify,
          youtube or even Instagram posts! If you want to know how to do it
          click{" "}
          <a className="border-b-2" href="/docs/htmlEmbeded">
            here!
          </a>
        </p>
      </div>
    </div>
  );
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

  const handleTitleChange = (e) => setBoxTitle(e.target.value);
  const handleCategoryChange = (e) => setBoxCategory(e.target.value);

  const handleDeleteBox = async (item) => {
    if (item.boxFiles && item.boxFiles.length > 0) {
      console.error("Cannot delete box with existing files");
      setMessage("Cannot delete box with existing files");
      toast.error("Cannot delete box with existing files", {
        description:
          "Please delete all existing files in order to delete the box",
      });
      return; // Exit function if there are files in boxFiles
    }

    setCurrentBoxId(item.identifier); // Set current box ID

    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(`/api/boxes/edit/${projectName}`, {
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
          // Handle box deletion in client-side state if necessary

          resolve({ name: item.title });
        } catch (error) {
          console.error("Error deleting box:", error);
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Deleting...",
      success: (data) => {
        return `${data.name} deleted successfully`;
      },
      error: "Error deleting box",
    });
  };

  const handleUpdateBoxSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    formData.append("projectID", currentBoxId); // Ensure to add the ID of the currently edited box

    console.log("Project ID: " + typeof currentBoxId);

    let title = formData.get("title");
    let description = formData.get("description");
    let category = formData.get("type");

    // Verify if the field is empty and replace with placeholder value
    if (!title.trim()) {
      title = e.target.querySelector("#Title").getAttribute("placeholder");
    }
    if (!description.trim()) {
      description = e.target
        .querySelector("#Description")
        .getAttribute("placeholder");
    }
    if (!category.trim()) {
      category = e.target.querySelector("#type").getAttribute("placeholder");
    }

    formData.set("title", title);
    formData.set("description", description);
    formData.set("category", category);

    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(`/api/boxes/edit/${projectName}`, {
            method: "PUT",
            body: formData,
          });

          const result = await response.json();
          if (response.ok) {
            console.log("File updated successfully", result);
            setMessage("Box updated successfully");

            const newBox = {
              id: currentBoxId,
              title,
              category,
              description,
              filename: result.filename,
              filetype: result.filetype,
            };

            resolve({ name: title });
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
      loading: "Updating...",
      success: (data) => {
        return `${data.name} updated successfully`;
      },
      error: "Error updating box",
    });
  };

  const handleEditBoxClick = async (item) => {
    setCurrentBoxId(item.identifier); // Establecer el ID del box actual

    // Manejar la vista previa de los archivos de la caja seleccionada
    if (
      item?.boxFiles &&
      Array.isArray(item.boxFiles) &&
      item.boxFiles.length > 0
    ) {
      const files = item.boxFiles.map((file) => ({
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

  const handleFileUpload = async (e) => {
    e.preventDefault();

    console.log("project name", projectName, boxTitle);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectName", projectName);
    formData.append("title", boxTitle);

    console.log("identifier", currentBoxId);

    const promise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const timer = setTimeout(() => {
            toast("Please be patient, the uploading file is big", {
              icon: "⌛",
            });
          }, 5000); // 5 seconds

          const response = await fetch(`/api/files/${currentBoxId}`, {
            method: "PUT",
            body: formData,
          });

          clearTimeout(timer);

          const result = await response.json();
          if (response.ok) {
            console.log("File uploaded successfully", result);
            setMessage("File uploaded successfully");
            resolve({ name: result.filename });
          } else {
            throw new Error(`Error uploading file: ${response.statusText}`);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          reject(error);
        }
      });

    toast.promise(promise(), {
      loading: "Uploading file...",
      success: (data) => {
        return `${data.name} uploaded successfully`;
      },
      error: "Error uploading file",
    });
  };

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
  };

  const updatePosition = async (
    currentBoxId,
    newPosition,
    hoverBoxId,
    newHoverBoxPos
  ) => {
    try {
      const response = await fetch(
        `/api/boxes/position/replacePos/${projectName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemId: currentBoxId,
            newPosition,
            hoverId: hoverBoxId,
            newHoverBoxPosition: newHoverBoxPos,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        setMessage(errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(result); // Imprimir respuesta de la API

      // Actualizar la lista de items con la nueva posición y ID actualizados
      const newSortedItems = sortedItems.map((item) => {
        if (item.identifier === currentBoxId) {
          return { ...item, position: newPosition }; // Actualizar la posición del box que está siendo movido
        }
        return item;
      });

      // Ordenar los items según la nueva posición
      newSortedItems.sort((a, b) => a.position - b.position);

      setSortedItems(newSortedItems);

      console.log(
        `Successfully updated position to ${newPosition} for item with current identifier ${currentBoxId}`
      );
      let message = `Successfully updated position to ${newPosition} for item with current identifier ${currentBoxId}`;
      setMessage(message);
    } catch (error) {
      console.error("Error updating position and identifier:", error);
      setMessage(error.message);
      // Manejar el error según sea necesario
    }
  };

  const updateManuallyPosition = async (newPosition) => {
    console.log("desde updateManuallyPosition", currentBoxId, newPosition);
    try {
      const response = await fetch(`/api/boxes/position/${projectName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: currentBoxId, // Usar currentBoxId en lugar de currentBoxIdentifier
          newPosition, // Nueva posición asignada manualmente
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setMessage(errorMessage);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(result); // Imprimir respuesta de la API

      // Actualizar la lista de items con la nueva posición y ID actualizados
      const newSortedItems = sortedItems.map((item) => {
        if (item.identifier === currentBoxId) {
          return { ...item, position: newPosition }; // Actualizar la posición del box que está siendo movido
        }
        return item;
      });

      // Ordenar los items según la nueva posición
      newSortedItems.sort((a, b) => a.position - b.position);

      setSortedItems(newSortedItems);

      console.log(
        `Successfully updated position to ${newPosition} for item with current identifier ${currentBoxId}`
      );
      let message = `Successfully updated position to ${newPosition} for item with current identifier ${currentBoxId}`;
      setMessage(message);
    } catch (error) {
      console.error("Error updating position and identifier:", error);
      setMessage(error.message);
      // Manejar el error según sea necesario
    }
  };

  const handleDeleteFile = async (fileId) => {
    console.log("file Id", fileId);

    const deleteFileFromProject = async () => {
      try {
        console.log(projectName);

        const response = await fetch(`/api/files/${fileId}`, {
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
          setFilesPreview((prevFiles) =>
            prevFiles.filter((file) => file.id !== fileId)
          ); // Eliminar el archivo del estado de vista previa
          setFile(null);
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

  const handleBoxDescriptionChange = (e) => {
    const text = e.target.value;
    setBoxDescription(text);
  };

  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = sortedItems[dragIndex];
    const newSortedItems = [...sortedItems];
    newSortedItems.splice(dragIndex, 1);
    newSortedItems.splice(hoverIndex, 0, draggedItem);

    // Actualizar las posiciones después de reordenar
    newSortedItems.forEach((item, index) => {
      item.position = index + 1;
    });

    setSortedItems(newSortedItems);
  };

  const Item = ({ item, index }) => {
    const descriptionLength = item?.description?.length;
    const isDescriptionLong = descriptionLength > 400; // Cambiar 100 según sea necesario

    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.CARD,
      item: { type: ItemTypes.CARD, index, identifier: item.identifier }, // Capture item.identifier here
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: ItemTypes.CARD,
      hover: (draggedItem, monitor) => {
        const dragIndex = draggedItem.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        // Obtain the box identifier of the item being hovered over
        const hoverItem = sortedItems[hoverIndex];

        moveItem(dragIndex, hoverIndex);

        draggedItem.index = hoverIndex;

        setCurrentBoxId(draggedItem.identifier);
        setHoverIndex(hoverIndex + 1);
        setHoverIdentifier(hoverItem.identifier);
        setDragIndex(dragIndex + 1);
      },

      drop: async () => {
        console.log(
          "desde drop",
          currentBoxId,
          hoverIndex,
          hoverIdentifier,
          dragIndex
        );
        updatePosition(currentBoxId, hoverIndex, hoverIdentifier, dragIndex);
      },
    });
    const opacity = isDragging ? 0.5 : 1;

    const BoxDescription = ({ description }) => {
      // Función para renderizar el contenido HTML de manera segura
      const createMarkup = (htmlContent) => {
        return { __html: htmlContent };
      };

      return (
        <div className="box-description w-full border-t-2 pt-2 border-white/45">
          {/* Renderización segura del contenido HTML */}
          <div
            className="prose prose-sm md:prose-lg lg:prose-xl max-w-full"
            dangerouslySetInnerHTML={createMarkup(description)}
          />
        </div>
      );
    };

    return (
      <li
        ref={(node) => drag(drop(node))}
        className={`h-fit w-full lg:w-${
          isDescriptionLong ? "full" : "fit"
        } max-w-full p-5 bg-white dark:bg-black text-black dark:text-white border-2 rounded-lg flex items-center mb-2 ${
          isDragging ? "opacity-50" : ""
        }`}
        style={{ cursor: "move", opacity }}
      >
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
            {item?.filetype === "application/pdf" && <FaFilePdf />}
            {item?.filetype?.startsWith("image/") && <FaFileImage />}
            {item?.filetype?.startsWith("video/") && <FaFileVideo />}
            {item?.filetype?.startsWith("audio/") && <FaFileAudio />}
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

          <button
            className="hover:border-white bg-green-700 mt-5 p-2 rounded-md"
            onClick={() => {
              handleEditBoxClick(item);
            }}
          >
            <div className="flex gap-5 align-middle text-white">
              <FaEdit />
            </div>
          </button>
          <button
            className="hover:border-white ml-4 bg-red-700 mt-5 p-2 rounded-md"
            onClick={() => {
              toast.warning("Are you sure you want to delete this box?", {
                action: {
                  label: "Confirm Delete",
                  onClick: () => handleDeleteBox(item),
                },
              });
            }}
          >
            <div className="flex gap-5 align-middle text-white">
              <FaTrash />
            </div>
          </button>
        </div>
      </li>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="">
        <ul className="flex gap-3 flex-wrap justify-between mt-10 w-full">
          {sortedItems.map((item, index) => (
            <Item key={item.identifier} index={index} item={item} />
          ))}
        </ul>
        <Modal
          className="bg-black/75"
          show={editBoxModal}
          onClose={() => setEditBoxModal(false)}
        >
          <div className="bg-white dark:bg-black border-2 border-white/50 rounded-md">
            <Modal.Header>Edit Box</Modal.Header>
            <Modal.Body>
              <form onSubmit={handleUpdateBoxSubmit}>
                <div className="overflow-y-auto max-h-[70vh]">
                  <div className="flex gap-10">
                    <div className="mt-5 w-full ">
                      <div className="mb-2 block">
                        <Label htmlFor="id" value="Position:" />
                      </div>
                      <Select
                        id="id"
                        name="id"
                        value={currentBoxId} // Asegúrate de que currentBoxId esté inicializado correctamente
                        onChange={(e) => {
                          const newPosition = parseInt(e.target.value);
                          if (newPosition !== 0) {
                            updateManuallyPosition(newPosition);
                          }
                        }}
                      >
                        <option value={0}>change position</option>
                        {[...Array(sortedItems.length)].map((_, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </Select>
                    </div>
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

                    <div className="mt-5 w-full flex text-black dark:text-white">
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
                    <div className="flex items-center">
                      <div className="mb-2 block">
                        <Label
                          htmlFor="Description"
                          value="Description: (Description Suports HTML Embeded!)"
                        />
                      </div>
                      <Popover content={content} className="" placement="right">
                        <Button className="align-middle mb-2 border-2 ml-3 text-black dark:text-white border-white/35">
                          Learn More
                        </Button>
                      </Popover>
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
                    <Button
                      type="submit"
                      className="bg-slate-800 text-black dark:text-white"
                    >
                      <div className="self-center ">
                        <FaEdit className="" />
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
    </DndProvider>
  );
};

export default SortableList;
