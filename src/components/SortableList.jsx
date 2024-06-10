import React, { useState, useEffect } from "react";
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
  const [boxType, setBoxType] = useState(""); // Nuevo estado para type
  const [currentBoxId, setCurrentBoxId] = useState(null); // Nuevo estado para almacenar el ID del box actualmente editado
  const [editBoxModal, setEditBoxModal] = useState(false);

  const handleTitleChange = (e) => setBoxTitle(e.target.value);
  const handleCategoryChange = (e) => setBoxCategory(e.target.value);

  const handleFileUpload = async (e) => {
    e.preventDefault();

    console.log("project name", projectName, boxTitle);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectName", projectName);
    formData.append("title", boxTitle);

    try {
      const response = await fetch(`/api/files/${projectName}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        console.log("File uploaded successfully", result);
        setMessage("File uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    setFile(newFile);
  };

  const handleDeleteFile = async (fileId) => {
    try {
      console.log(projectName); // Imprime el nombre correctamente

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
      } else {
        console.error("Failed to delete file:", await response.text());
      }
    } catch (error) {
      console.error("Failed to delete file from project and box", error);
    }
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
        console.log("File deleted successfully");
        setFilesPreview((prevFiles) =>
          prevFiles.filter((file) => file.id !== fileId)
        ); // Cambio: eliminar el archivo del estado de vista previa
        setFile(null);
      } else {
        console.error("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleBoxDescriptionChange = (e) => {
    const text = e.target.value;
    setBoxDescription(text);
  };

  const [sortedItems, setSortedItems] = useState(
    Array.isArray(items) ? [...items].sort((a, b) => a.id - b.id) : []
  );

  const handleEditBoxClick = async (item) => {
    setCurrentBoxId(item.id); // Establecer el ID del box actual

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

  console.log("file preview", filesPreview);

  const handleUpdateBoxSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    let title = formData.get("title");
    let description = formData.get("description");
    let category = formData.get("type");

    // Verificar si el campo está vacío y reemplazar con el valor del placeholder
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
    formData.append("projectID", currentBoxId); // Asegurarse de añadir el ID del box actualmente editado

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
      } else {
        console.error("Error updating box:", result);
      }
    } catch (error) {
      console.error("Error updating box:", error);
    }
  };

  useEffect(() => {
    setSortedItems(
      Array.isArray(items) ? [...items].sort((a, b) => a.id - b.id) : []
    );
  }, [items]);

  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = sortedItems[dragIndex];
    const newSortedItems = [...sortedItems];
    newSortedItems.splice(dragIndex, 1);
    newSortedItems.splice(hoverIndex, 0, draggedItem);
    setSortedItems(newSortedItems);
  };

  const updatePosition = async (newSortedItems) => {
    for (let i = 0; i < newSortedItems.length; i++) {
      try {
        const response = await fetch(`/api/boxes/position/${projectName}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemId: newSortedItems[i].id,
            newPosition: i + 1,
            newId: i + 1,
          }),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log(result); // Imprime la respuesta de la API

        console.log(
          `Successfully updated position and ID for item with ID ${newSortedItems[i].id}`
        );
      } catch (error) {
        console.error("Error updating position and ID:", error);
      }
    }
  };

  const Item = ({ item, index }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.CARD,
      item: { type: ItemTypes.CARD, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: ItemTypes.CARD,
      hover: (draggedItem) => {
        const dragIndex = draggedItem.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        moveItem(dragIndex, hoverIndex);
        draggedItem.index = hoverIndex;
      },
      drop: async () => {
        // Actualizar posiciones en el backend después de soltar el item
        updatePosition(sortedItems);
      },
    });

    const opacity = isDragging ? 0.5 : 1;

    return (
      <li
        ref={(node) => drag(drop(node))}
        className={`h-fit w-full p-5 bg-black text-white border-2 rounded-lg flex items-center mb-2 ${
          isDragging ? "opacity-50" : ""
        }`}
        style={{ cursor: "move", opacity }}
      >
        <div className="ml-4">
          <h2 className="text-2xl mb-2">
            <span className="text-gray-500 mr-2">{item.id}.</span>
            <span className="text-3xl font-bold">{item.title}</span>
          </h2>
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
          <div className="mt-2 w-full">
            <Label className="text-lg font-semibold" value="Files:" />
            <ul className="mt-2">
              {item?.boxFiles?.map((file) => (
                <li
                  key={file.fileId}
                  className="flex items-center gap-2 hover:border-b-2"
                >
                  <a href={`/api/files/downloadFile/${file.fileId}`}>
                    {file.filename}
                  </a>
                  {file?.filetype === "application/pdf" && <FaFilePdf />}
                  {file?.filetype?.startsWith("image/") && <FaFileImage />}
                  {file?.filetype?.startsWith("video/") && <FaFileVideo />}
                  {file?.filetype?.startsWith("audio/") && <FaFileAudio />}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4">Description: {item.description}</p>
          <button
            className="hover:border-white bg-green-700 mt-5 p-2 rounded-md"
            onClick={() => {
              handleEditBoxClick(item);
            }}
          >
            <div className="flex gap-5 align-middle">
              <FaEdit />
            </div>
          </button>
        </div>
        <div className="ml-auto flex items-center text-6xl">
          {item?.category === "fileVanilla" && <FaFile />}
          {item?.category === "File" && <FaFileCode />}
          {item?.category === "Picture" && <FaFileImage />}
          {item?.category === "Video" && <FaFileVideo />}
          {item?.category === "Text" && <FaFileWord />}
          {item?.category === "Audio" && <FaFileAudio />}
        </div>
      </li>
    );
  };

  const updateManuallyPosition = async (newPosition, newId) => {
    try {
      const response = await fetch(`/api/boxes/position/${projectName}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: currentBoxId, // ID actual del box que está siendo movido
          newPosition, // Nueva posición seleccionada desde el Select
          newId, // Nuevo ID asignado manualmente
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(result); // Imprimir respuesta de la API

      // Actualizar la lista de items con la nueva posición y ID actualizados
      const newSortedItems = sortedItems.map((item) => {
        if (item.id === currentBoxId) {
          return { ...item, id: newId }; // Actualizar el ID del box que está siendo movido
        } else if (item.id === newId) {
          return { ...item, id: currentBoxId }; // Actualizar el ID del box que ocupa la nueva posición
        } else {
          return item;
        }
      });

      // Ordenar los items según la nueva posición
      newSortedItems.sort((a, b) => {
        if (a.id === newId) return -1; // Colocar el item actualizado en la nueva posición
        if (b.id === newId) return 1;
        return a.id - b.id; // Ordenar los demás items por ID
      });

      setSortedItems(newSortedItems);

      console.log(
        `Successfully updated position to ${newPosition} and ID to ${newId} for item with current ID ${currentBoxId}`
      );
    } catch (error) {
      console.error("Error updating position and ID:", error);
      // Manejar el error según sea necesario
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <ul className="w-full p-10 ">
          {
            /* Corrige la advertencia de "Each child in a list should have a unique 'key' prop." */
            sortedItems.map((item, index) => (
              <Item key={item.id} item={item} index={index} />
            ))
          }
        </ul>
        <Modal
          className="bg-black/75"
          show={editBoxModal}
          onClose={() => setEditBoxModal(false)}
        >
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
                      required={true}
                      value={currentBoxId} // Establecer el valor seleccionado basado en currentBoxId
                      onChange={(e) => {
                        const newId = parseInt(e.target.value);
                        const newPosition =
                          sortedItems.findIndex((item) => item.id === newId) +
                          1;
                        updateManuallyPosition(newPosition, newId);
                      }}
                    >
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
                      required={true}
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
                  {message && <p>{message}</p>}
                  <div className="mt-5 w-full">
                    <Label value="Current Files" />
                    {filesPreview &&
                    Array.isArray(filesPreview) &&
                    filesPreview.length > 0 ? (
                      filesPreview.map((file) => (
                        <div key={file.id} className="flex items-center gap-2">
                          {file.type && file.type.startsWith("image/") ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              style={{ maxWidth: "200px", maxHeight: "200px" }}
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
                      <p>No files uploaded</p>
                    )}
                  </div>
                </div>
                <div className="mt-5 w-full">
                  <div className="mb-2 block">
                    <Label htmlFor="Description" value="Description" />
                  </div>
                  <Textarea
                    id="Description"
                    type="text"
                    placeholder={boxDescription} // Usar la descripción actual como placeholder
                    name="description"
                    autoComplete="off"
                    onChange={handleBoxDescriptionChange}
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
        </Modal>
      </div>
    </DndProvider>
  );
};

export default SortableList;
