import { useContext } from "react";
import userContext from "../../context/userContext.jsx";

function Header() {
  const { username, logout, tasks } = useContext(userContext);
  const doneCount = tasks.filter((task) => task.cleared).length;

  return (
    <header className="site-header">
      <div>
        <p className="eyebrow">Todo List</p>
        <h2>Hi, {username}</h2>
      </div>

      <div className="header-actions">
        <span>{doneCount}/{tasks.length} done</span>
        <button className="logout-button" type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
