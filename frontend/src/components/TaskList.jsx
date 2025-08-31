import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS } from "../graphql/queries";
import { TOGGLE_TASK, DELETE_TASK, CREATE_TASK } from "../graphql/mutations";
import TaskForm from "./TaskForm";

export default function TaskList() {
  const [title, setNewTitle] = useState("");
  const [description, setNewDesc] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  const { loading, error, data } = useQuery(GET_TASKS);
  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: (data) => {
      console.log("Created task:", data.createTask.task);
      // reset form
      setTitle("");
      setDescription("");
      setDueDate("");
    },
  });

  const [toggleTask] = useMutation(TOGGLE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks: {error.message}</p>;

  // Add safety checks for data structure
  if (!data) {
    return <p>No data received from server</p>;
  }

  // Handle different possible property names
  const tasks = data.allTasks;

  if (!tasks) {
    return (
      <div>
        <p>No tasks property found in data</p>
        <p>Available properties: {Object.keys(data).join(', ')}</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  if (!Array.isArray(tasks)) {
    return <p>Tasks data is not an array: {typeof tasks}</p>;
  }

  const handleAdd = (e) => {
    e.preventDefault(); // prevent page reload
    createTask({
      variables: {
        title,
        description,
        dueDate: dueDate,
      },
    })
      .then(() => {
        // Reset form
        setTitle("");
        setDescription("");
        setDueDate("");
      })
      .catch((err) => console.error("Create error:", err));
  };

  const handleToggle = (task) => {
    toggleTask({
      variables: { id: task.id, isComplete: !task.isComplete },
    });
  };

  const handleDelete = (id) => {
  deleteTask({ variables: { id } })
    .then((res) => {
      if (!res.data.deleteTask.ok) {
        console.error("Failed to delete task");
      }
    })
    .catch((err) => console.error("Delete error:", err));
  };

  if (tasks.length === 0) {
    return(
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
        <TaskForm onSubmit={handleAdd} />
        <p>No tasks found</p>;
      </div>
      
    );   
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      {/* --- Add Task Form --- */}
      <TaskForm onSubmit={handleAdd} />

      {/* Table */}
      <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm border-collapse">
          {/* Table Head */}
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="w-10 px-4 py-2 text-center">✓</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t border-gray-200">
                {/* Checkbox */}
                <td>
                  <button
                    onClick={() => handleToggle(task)}
                    className={`toggle-btn ${task.isComplete ? "completed" : ""}`}
                  >
                    {task.isComplete && (
                      <span>✓</span>
                    )}
                  </button>
                </td>

                {/* Title */}
                <td>
                  {task.title}
                </td>

                {/* Description */}
                <td className="px-4 py-2 text-gray-500">{task.description}</td>

                {/* Due Date */}
                <td className="px-4 py-2 text-gray-500">
                  {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                </td>

                {/* Delete Button */}
                <td className="px-4 py-2 text-center">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
}
