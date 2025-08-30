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

  const [toggleTask] = useMutation(TOGGLE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });
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

  if (tasks.length === 0) {
    return <p>No tasks found</p>;
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      {/* --- Add Task Form --- */}
      <TaskForm onSubmit={handleAdd} />

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-white rounded-lg shadow flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleToggle(task)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  task.isCompleted
                    ? "bg-green-500 border-green-500"
                    : "border-gray-400"
                }`}
              >
                {task.completed && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* --- Task Info --- */}
              <div>
                <span
                  className={
                    task.isCompleted ? "line-through" : ""
                  }
                >
                  {task.title}
                </span>
                <p className="text-sm text-gray-500">{task.description}</p>
                {task.dueDate && (
                  <p className="text-sm text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* --- Delete Button --- */}
            <div className="flex items-center space-x-2">
              <button
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
