import userContext from "../../context/Context.jsx";
import { useContext } from "react";
import "./Sidebar.css";

function Sidebar({ isMobile, isOpen, onClose, activeFilter, onFilterChange }) {
    const { user } = useContext(userContext);
    if (!user) return null;

    const filters = [
        { key: "today", label: "Today's Todos" },
        { key: "completed", label: "Completed Todos" },
        { key: "incomplete", label: "Incomplete Todos" },
        { key: "all", label: "All Todos" },
    ];

    return (
        <aside className={`sidebar ${isMobile ? "mobile" : ""} ${isOpen ? "open" : ""}`}>
            <nav>
                {isMobile && (
                    <button type="button" className="close-btn" onClick={onClose} aria-label="Close sidebar">
                        X
                    </button>
                )}

                <h2>Navigation</h2>
                <ul>
                    {filters.map(({ key, label }) => (
                        <li key={key}>
                            <button
                                type="button"
                                className={activeFilter === key ? "sidebar-link active" : "sidebar-link"}
                                onClick={() => {
                                    onFilterChange(key);
                                    if (isMobile && onClose) onClose();
                                }}
                            >
                                {label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;