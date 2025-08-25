import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS } from "../graphql/queries";
import { TOGGLE_TASK } from "../graphql/mutations";

export default function TaskList() {
  const { loading, error, data } = useQuery(GET_TASKS);
  const [toggleTask] = useMutation(TOGGLE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

   // Debug logging (remove after fixing)
  console.log("Loading:", loading);
  console.log("Error:", error);
  console.log("Data:", data);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks: {error.message}</p>;

  // Add safety checks for data structure
  if (!data) {
    return <p>No data received from server</p>;
  }

  if (!data.tasks) {
    return <p>No tasks property in data</p>;
  }

  if (!Array.isArray(data.tasks)) {
    return <p>Tasks data is not an array</p>;
  }

  if (data.tasks.length === 0) {
    return <p>No tasks found</p>;
  }

  const handleToggle = (task) => {
    toggleTask({
      variables: { id: task.id, isComplete: !task.isComplete },
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <ul className="space-y-4">
        {data.tasks.map((task) => (
          <li
            key={task.id}
            className="p-4 bg-white rounded-lg shadow flex items-center justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
              {task.dueDate && (
                <p className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.isComplete}
                  onChange={() => handleToggle(task)}
                />
                <span className="ml-2">Complete</span>
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
