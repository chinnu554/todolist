import API_URL from "../api.js";

export const getTodos = async (token) => {
    try {
        const response = await fetch(`${API_URL}/todos`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const createTodo = async (token, description) =>{
    try{
        const response = await fetch(`${API_URL}/todos`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ description })
        })
        const data = await response.json();
        return data;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export const updateTodo = async (token, todoId, description) =>{
    try{
        const response = await fetch(`${API_URL}/todos/${todoId}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ description })
        })
        const data = await response.json();
        return data;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export const deleteTodo = async (token, todoId) =>{
    try{
        const response = await fetch(`${API_URL}/todos/${todoId}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        const data = await response.json();
        return data;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export const toggleTodoCompletion = async (token, todoId) =>{
    try{
        const response = await fetch(`${API_URL}/todos/${todoId}/toggle`, {
            method: "PATCH",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    }
    catch(err){
        console.log(err);
        throw err;
    }
}