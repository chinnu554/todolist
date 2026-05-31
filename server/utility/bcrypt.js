import bcrypt from "bcryptjs";

const hashPassword = async(password) =>{
    const hashedpassword = await bcrypt.hash(password,10);
    return hashedpassword;
}

const checkPassword = async(userPassword,storedPassword) =>{
    const result = await bcrypt.compare(userPassword,storedPassword);
    return result;
}
export {hashPassword,checkPassword};
