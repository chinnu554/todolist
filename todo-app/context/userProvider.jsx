import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import userContext from "./userContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getErrorMessage(error) {
  return error.response?.data?.message || error.message || "Something went wrong";
}

function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("todo-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("todo-token") || "");
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: API_URL });

    instance.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    return instance;
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("todo-token", token);
    } else {
      localStorage.removeItem("todo-token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("todo-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("todo-user");
    }
  }, [user]);

  useEffect(() => {
    if (!token) return;

    let ignore = false;

    async function loadTasks() {
      setIsLoading(true);
      setMessage("");

      try {
        const { data } = await api.post("/task/list");

        if (!ignore) {
          setTasks(data.records || []);
        }
      } catch (error) {
        if (!ignore) {
          setMessage(getErrorMessage(error));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      ignore = true;
    };
  }, [api, token]);

  const login = useCallback(
    async (authForm) => {
      setIsLoading(true);
      setMessage("");

      try {
        const { data } = await api.post("/auth/login", authForm);

        if (!data.user || !data.token) {
          throw new Error(data.message || "Login failed");
        }

        setUser(data.user);
        setToken(data.token);
        return true;
      } catch (error) {
        setMessage(getErrorMessage(error));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [api]
  );

  const register = useCallback(
    async (authForm) => {
      setIsLoading(true);
      setMessage("");

      try {
        await api.post("/auth/register", authForm);
        setMessage("Account created. You can log in now.");
        return true;
      } catch (error) {
        setMessage(getErrorMessage(error));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [api]
  );

  const requestRegistrationOtp = useCallback(
    async (email) => {
      setIsLoading(true);
      setMessage("");

      try {
        await api.post("/otp/request-otp", { email });
        setMessage("OTP sent to your email.");
        return true;
      } catch (error) {
        setMessage(getErrorMessage(error));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [api]
  );

  const addTask = useCallback(
    async (task) => {
      setIsLoading(true);
      setMessage("");

      try {
        const { data } = await api.post("/task", { task, cleared: false });
        setTasks((currentTasks) => [data.task, ...currentTasks]);
        return true;
      } catch (error) {
        setMessage(getErrorMessage(error));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [api]
  );

  const updateTask = useCallback(
    async (taskId, newTask) => {
      await api.put(`/task/${taskId}`, { newTask });
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === taskId ? { ...task, task: newTask } : task
        )
      );
    },
    [api]
  );

  const completeTask = useCallback(
    async (taskId) => {
      await api.patch(`/task/${taskId}/clear`);
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === taskId ? { ...task, cleared: true } : task
        )
      );
    },
    [api]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      await api.delete(`/task/${taskId}`);
      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));
    },
    [api]
  );

  function logout() {
    setUser(null);
    setToken("");
    setTasks([]);
    setMessage("");
  }

  const value = {
    user,
    username: user?.username || "",
    token,
    tasks,
    message,
    isLoading,
    setMessage,
    login,
    register,
    requestRegistrationOtp,
    addTask,
    updateTask,
    completeTask,
    deleteTask,
    logout,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}

export default UserProvider;
