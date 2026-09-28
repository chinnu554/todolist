import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import userContext from "../../context/Context.jsx";
import { logout } from "../../services/authServices.js";
function Header(){
    const {user, token, setToken, setUser} = useContext(userContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        setToken("");
        setUser(null);
    };
    return(
        <header>
            <h1>Todolist</h1>
             <div>
               {
                token ? <div>
                    <div>
                        <h3>{user?.username}</h3>
                    </div>
                    <button onClick={handleLogout}>Logout</button>
                </div> : 
                <div>
                     <button onClick={() =>navigate("/auth")}>Login</button>
                </div>
               }
             </div>
        </header>
    )
}
export default Header;