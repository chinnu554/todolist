import { useState, useContext } from "react";
import { register, login } from "../../services/authServices";
import userContext from "../../context/Context.jsx";
import {Navigate, useNavigate} from "react-router-dom"
import "./Loginpage.css"

function Loginpage() {
  const { setUser, token, setToken } = useContext(userContext);
  if(token){
    return <Navigate to="/" replace />
  }
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

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
    <section className="loginpage">
      <div className="login-card">
        <h1>{isLogin ? "Login" : "Register"}</h1>
        <div className="login-form">
            <input
              type="text"
              value={username}
              placeholder="Username"
              className="login-input"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              value={password}
              placeholder="Password"
              className="login-input"
              onChange={(e) => setPassword(e.target.value)}
            />
          <div className="login-toggle">
            <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
            <button className="login-toggle-button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "register" : "login"}
          </button>
          </div>
          <button className="login-button" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </section>
  );
}
export default Loginpage;
