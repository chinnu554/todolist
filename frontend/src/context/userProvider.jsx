import userContext from "./Context.jsx";
import { useState, useEffect } from "react";
import { getMe } from "../services/authServices.js";
function UserProvider({ children }) {
  const [user, setUser] = useState({});
  const [todos, setTodos] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await getMe(token);
        setUser(response.data.user);
        setError(null);
      } catch (err) {
        console.log(err);
        if (err.response?.status === 401) {
                localStorage.removeItem("token");
                setToken("");
                setUser(null);
            }

            setError(err.message);
      }
    };

    fetchData();
  }, [token]);

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        todos,
        setTodos,
        error,
        setError,
      }}
    >
      {children}
    </userContext.Provider>
  );
}

export default UserProvider;
