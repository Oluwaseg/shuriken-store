import React, { useState, FormEvent } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateCategory: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post("/api/category", { name, description });
      toast.success("Category created successfully!");
      setName("");
      setDescription("");
      setTimeout(() => navigate("/categories"), 1000);
    } catch (error) {
      toast.error("Error creating category. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold dark:text-white mb-4">
        Create Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter Category Name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm bg-primary dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Category Description"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm bg-primary dark:bg-gray-800 dark:text-white"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-secondary text-white font-semibold rounded-md shadow-sm hover:bg-secondary hover:bg-opacity-50 duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Create Category
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
