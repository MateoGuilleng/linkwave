"use client";
import { useState } from "react";

export default function Page() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploadFile", {
        method: "POST",
        body: formData,
      });

      // Verifica si la respuesta tiene contenido
      const data = await res.text();
      const jsonData = data ? JSON.parse(data) : {};

      if (res.ok) {
        setMessage("File uploaded successfully");
      } else {
        setMessage(`Upload failed: ${jsonData.message}`);
      }
    } catch (error) {
      setMessage(`Upload failed: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} required />
      <button type="submit">Upload</button>
      {message && <p>{message}</p>}
    </form>
  );
}
