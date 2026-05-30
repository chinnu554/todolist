import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Task from "../components/Task/Task.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({ baseURL: API_URL });

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || "Something went wrong";
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("todo-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const remainingTasks = useMemo(
    () => tasks.filter((task) => !task.cleared).length,
    [tasks]
  );

  const loadTasks = useCallback(async (userId) => {
    await Promise.resolve();

    setIsLoading(true);
    setMessage("");

    try {
      const { data } = await api.post("/task/list", { userId });
      setTasks(data.records || []);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?._id) {
      const timer = setTimeout(() => loadTasks(user._id), 0);
      return () => clearTimeout(timer);
    }
  }, [loadTasks, user]);

  async function handleAuth(event) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const { data } = await api.post(`/auth/${authMode}`, authForm);

      if (authMode === "register") {
        setAuthMode("login");
        setMessage("Account created. You can log in now.");
        return;
      }

      if (!data.user) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("todo-user", JSON.stringify(data.user));
      setUser(data.user);
      setAuthForm({ username: "", password: "" });
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function addTask(event) {
    event.preventDefault();
    const task = taskText.trim();

    if (!task) return;

    setIsLoading(true);
    setMessage("");

    try {
      const { data } = await api.post("/task", {
        task,
        cleared: false,
        userId: user._id,
      });
      setTasks((currentTasks) => [data.task, ...currentTasks]);
      setTaskText("");
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function updateTask(taskId, newTask) {
    await api.put(`/task/${taskId}`, { newTask, userId: user._id });
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === taskId ? { ...task, task: newTask } : task
      )
    );
  }

  async function completeTask(taskId) {
    await api.patch(`/task/${taskId}/clear`);
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === taskId ? { ...task, cleared: true } : task
      )
    );
  }

  async function deleteTask(taskId) {
    await api.delete(`/task/${taskId}`);
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task._id !== taskId)
    );
  }

  function logout() {
    localStorage.removeItem("todo-user");
    setUser(null);
    setTasks([]);
    setMessage("");
  }

  if (!user) {
    return (
      <main className="app-shell auth-shell">
        <section className="panel auth-panel">
          <p className="eyebrow">Todo List</p>
          <h1>{authMode === "login" ? "Welcome back" : "Create account"}</h1>

          <form className="stack" onSubmit={handleAuth}>
            <input
              type="text"
              placeholder="Username"
              value={authForm.username}
              onChange={(event) =>
                setAuthForm({ ...authForm, username: event.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={(event) =>
                setAuthForm({ ...authForm, password: event.target.value })
              }
            />
            <button type="submit" disabled={isLoading}>
              {isLoading
                ? "Please wait..."
                : authMode === "login"
                  ? "Login"
                  : "Register"}
            </button>
          </form>

          <button
            className="link-button"
            type="button"
            onClick={() =>
              setAuthMode((mode) => (mode === "login" ? "register" : "login"))
            }
          >
            {authMode === "login"
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>

          {message && <p className="message">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="panel todo-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Signed in as {user.username}</p>
            <h1>Today's tasks</h1>
          </div>
          <button className="ghost-button" type="button" onClick={logout}>
            Logout
          </button>
        </header>

        <form className="add-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Add a new task"
            value={taskText}
            onChange={(event) => setTaskText(event.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            Add
          </button>
        </form>

        <div className="summary">
          <span>{tasks.length} total</span>
          <span>{remainingTasks} left</span>
          <span>{tasks.length - remainingTasks} done</span>
        </div>

        {message && <p className="message">{message}</p>}

        <div className="task-list">
          {isLoading && tasks.length === 0 ? (
            <p className="empty-state">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty-state">No tasks yet. Add your first one.</p>
          ) : (
            tasks.map((task) => (
              <Task
                key={task._id}
                task={task}
                onComplete={completeTask}
                onDelete={deleteTask}
                onUpdate={updateTask}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
