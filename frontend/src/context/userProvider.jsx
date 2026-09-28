import userContext from "./Context.jsx";
import { useState } from "react";
function UserProvider({children}){
    const [username,setUsername] = useState("");
    const [token,setToken] = useState("");
    const [todos,setTodos] = useState([]);
    const[error,setError] = useState(null);

    return(
        <userContext.Provider value={{username,setUsername,token,setToken,todos,setTodos,error,setError}}>
            {children}
        </userContext.Provider>
    )

}

export default UserProvider;