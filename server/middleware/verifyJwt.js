import jwt from "jsonwebtoken";

const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Login required", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "todo-secret");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", success: false });
  }
};

export default verifyJwt;
