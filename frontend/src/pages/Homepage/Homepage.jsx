import { useState, useEffect, useContext } from "react";
import userContext from "../../context/Context.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Todocard from "../../components/Todocard/Todocard.jsx";
import "./Homepage.css";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoCompletion,
} from "../../services/todoService.js";
import {Menu} from "lucide-react";

function Homepage() {
  const { user, token } = useContext(userContext);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCloseSidebar = () => {
    setIsOpen(false);
  };

  const fetchTodos = async () => {
    if (!token) return;

    try {
      const data = await getTodos(token);
      setTodos(Array.isArray(data?.todos) ? data.todos : []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [token]);

  const filteredTodos = todos.filter((todo) => {
    const today = new Date();
    const createdDate = todo.createdAt ? new Date(todo.createdAt) : null;

    switch (filter) {
      case "today":
        return (
          createdDate &&
          createdDate.getFullYear() === today.getFullYear() &&
          createdDate.getMonth() === today.getMonth() &&
          createdDate.getDate() === today.getDate()
        );
      case "completed":
        return Boolean(todo.isCompleted);
      case "incomplete":
        return !todo.isCompleted;
      default:
        return true;
    }
  });

  const handleAddTodo = async () => {
    const trimmed = newTodo.trim();
    if (!trimmed || !token) return;

    try {
      const data = await createTodo(token, trimmed);
      if (data?.todo) {
        setTodos((prev) => [data.todo, ...prev]);
      }
      setNewTodo("");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    if (!token) return;

    try {
      await deleteTodo(token, todoId);
      setTodos((prev) => prev.filter((todo) => todo._id !== todoId));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleToggleTodo = async (todoId) => {
    if (!token) return;

    try {
      const data = await toggleTodoCompletion(token, todoId);
      if (data?.todo) {
        setTodos((prev) =>
          prev.map((todo) => (todo._id === todoId ? data.todo : todo))
        );
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleUpdateTodo = async (todoId, description) => {
    if (!token) return;

    try {
      const data = await updateTodo(token, todoId, description);
      if (data?.todo) {
        setTodos((prev) =>
          prev.map((todo) => (todo._id === todoId ? data.todo : todo))
        );
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const filterNames = {
    today: "Today's Todos",
    completed: "Completed Todos",
    incomplete: "Incomplete Todos",
    all: "All Todos",
  };

  return (
    <main>
      <Sidebar
      isMobile={isMobile}
        isOpen={isMobile && isOpen}
        onClose={handleCloseSidebar}
        activeFilter={filter}
        onFilterChange={setFilter}
      />
      <div className="homepage-content">
        <h1>Welcome, {user?.username || "Guest"}!</h1>
        {isMobile && <Menu className="open-btn" onClick={() => setIsOpen(true)} />}
        <h2>{filterNames[filter]}</h2>
        <div className="task-list">
          {filteredTodos.map((todo) => (
            <Todocard
              key={todo._id}
              description={todo.description}
              isCompleted={Boolean(todo.isCompleted)}
              onDelete={() => handleDeleteTodo(todo._id)}
              onToggleComplete={() => handleToggleTodo(todo._id)}
              onUpdate={(description) => handleUpdateTodo(todo._id, description)}
            />
          ))}
        </div>

        <div className="task-input">
          <input
            type="text"
            className="task-input-field"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="Add a todo"
          />
          <button className="task-add-button" onClick={handleAddTodo}>
            Add Task
          </button>
        </div>
      </div>
    </main>
  );
}

export default Homepage;
