'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <div>
      <Navbar using={"feed"} />
      <h1>Lista de Usuarios</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>Nombre:</strong> {user.name}, <strong>Correo:</strong>{" "}
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
