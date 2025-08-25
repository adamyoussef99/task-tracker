import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS } from "../graphql/queries";
import { TOGGLE_TASK } from "../graphql/mutations";

export default function TaskList() {
  const { loading, error, data } = useQuery(GET_TASKS);
  const [toggleTask] = useMutation(TOGGLE_TASK, {
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

  const handleToggle = (task) => {
    toggleTask({
      variables: { id: task.id, isComplete: !task.isComplete },
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      <ul className="space-y-4">
        {tasks.map((task) => (
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
