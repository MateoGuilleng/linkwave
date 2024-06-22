"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/config/firebase";
import { ref, onValue, set, update, remove } from "firebase/database";

function Page() {
  const [data, setData] = useState({});
  const [newField, setNewField] = useState("");
  const [editId, setEditId] = useState(null);
  const [editField, setEditField] = useState("");

  useEffect(() => {
    const dataRef = ref(db, "your-collection-name");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        setData({});
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = () => {
    const newId = Date.now().toString();
    set(ref(db, `your-collection-name/${newId}`), {
      field: newField,
    });
    setNewField("");
  };

  const handleUpdate = (id) => {
    update(ref(db, `your-collection-name/${id}`), {
      field: editField,
    });
    setEditId(null);
    setEditField("");
  };

  const handleDelete = (id) => {
    remove(ref(db, `your-collection-name/${id}`));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Firebase Realtime Database CRUD
      </h1>

      <div className="mb-4">
        <input
          type="text"
          value={newField}
          onChange={(e) => setNewField(e.target.value)}
          placeholder="New Field"
          className="border p-2 mr-2"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white p-2">
          Add
        </button>
      </div>

      <div>
        {Object.entries(data).map(([id, value]) => (
          <div key={id} className="mb-4 p-4 border rounded">
            {editId === id ? (
              <div>
                <input
                  type="text"
                  value={editField}
                  onChange={(e) => setEditField(e.target.value)}
                  className="border p-2 mr-2"
                />
                <button
                  onClick={() => handleUpdate(id)}
                  className="bg-green-500 text-white p-2 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="bg-gray-500 text-white p-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <span className="mr-4">{value.field}</span>
                <button
                  onClick={() => {
                    setEditId(id);
                    setEditField(value.field);
                  }}
                  className="bg-yellow-500 text-white p-2 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  className="bg-red-500 text-white p-2"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;
