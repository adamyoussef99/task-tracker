import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TASK } from "../graphql/mutations";
import { GET_TASKS } from "../graphql/queries";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createTask({ variables: { title, description, dueDate } });
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg mb-6">
      <h2 className="font-bold mb-2">Add New Task</h2>
      <input
        type="text"
        placeholder="Title"
        className="border p-2 rounded w-full mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        className="border p-2 rounded w-full mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        className="border p-2 rounded w-full mb-2"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Task
      </button>
    </form>
  );
}