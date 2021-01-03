import React from "react";

function Task({ task, toggleTask }) {
  function handleTaskClick() {
    toggleTask(task.id);
  }

  function toggleTaskCompletedClass() {
    let classes = "task-name ";
    if (task.complete) return (classes += "task-completed");
    return (classes = "task-name");
  }

  return (
    <div>
      <label className="task">
        <input
          className="task-checkbox"
          type="checkbox"
          checked={task.complete}
          onChange={handleTaskClick}
        />
        <span className={toggleTaskCompletedClass()}>{task.name}</span>
      </label>
    </div>
  );
}

export default Task;
