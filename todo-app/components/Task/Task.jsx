import { useState } from "react";

function Task({ task, onComplete, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.task);
  const [isBusy, setIsBusy] = useState(false);

  async function run(action) {
    setIsBusy(true);

    try {
      await action();
    } finally {
      setIsBusy(false);
    }
  }

  function cancelEdit() {
    setDraft(task.task);
    setIsEditing(false);
  }

  async function saveEdit(event) {
    event.preventDefault();
    const nextTask = draft.trim();

    if (!nextTask) return;

    await run(async () => {
      await onUpdate(task._id, nextTask);
      setIsEditing(false);
    });
  }

  return (
    <article className={`task-item ${task.cleared ? "is-done" : ""}`}>
      {isEditing ? (
        <form className="edit-form" onSubmit={saveEdit}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            autoFocus
          />
          <button type="submit" disabled={isBusy}>
            Save
          </button>
          <button type="button" className="ghost-button" onClick={cancelEdit}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <button
            className="check-button"
            type="button"
            disabled={task.cleared || isBusy}
            onClick={() => run(() => onComplete(task._id))}
            aria-label="Complete task"
          >
            {task.cleared ? "✓" : ""}
          </button>

          <p>{task.task}</p>

          <div className="task-actions">
            <button
              type="button"
              className="ghost-button"
              disabled={task.cleared || isBusy}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              type="button"
              className="danger-button"
              disabled={isBusy}
              onClick={() => run(() => onDelete(task._id))}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </article>
  );
}

export default Task;
