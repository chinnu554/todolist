import { useState, useContext } from "react";
import { register, login } from "../../services/authServices";
import userContext from "../../context/Context.jsx";
import {Navigate, useNavigate} from "react-router-dom"

function Loginpage() {
  const { setUser, token, setToken } = useContext(userContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  async function handleSubmit() {
    try {
      if (isLogin) {
        const result = await login(username, password);
        setUser(result.user);
        setToken(result.token);
        navigate("/");
      } else {
        await register(username, password);
        setIsLogin(true);
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <section>
      <div>
        <h1>Login Page</h1>
        <div>
          <h2>{isLogin ? "Login" : "Register"}</h2>
          <form>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "register" : "login"}
          </button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </section>
  );
}
export default Loginpage;
