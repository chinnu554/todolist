import "./Todocard.css";
import { useState } from "react";
import { Check, Pencil, Trash, Save, X } from "lucide-react";
function Todocard({ description, isCompleted, onDelete, onToggleComplete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(description || "");

  const handleSave = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onUpdate(trimmed);
    setIsEditing(false);
  };

  return (
    <div className={`todo-card ${isCompleted ? "completed" : ""}`}>
      <div className="todo-card-header">
        {isEditing ? (
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        ) : (
          <p>{description}</p>
        )}
      </div>
      <div className="todo-card-footer">
        <button onClick={onToggleComplete}>
          {isCompleted ? <X /> : <Check />}
        </button>
        {isEditing ? (
          <Save onClick={handleSave} />
        ) : (
          <Pencil onClick={() => setIsEditing(true)} />
        )}
       <Trash onClick={onDelete} />
      </div>
    </div>
  );
}

export default Todocard;
