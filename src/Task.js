import React, { useRef } from "react";

function Task({
  task,
  toggleTask,
  renameTask,
  applyRenameTask,
  cancelRenameTask,
}) {
  const taskNameRef = useRef();

  function handleTaskClick() {
    toggleTask(task.id);
  }

  function handleRenameBtnClick() {
    renameTask(task.id);
  }

  function handleChangeBtnClick() {
    const name = taskNameRef.current.value;
    applyRenameTask(task.id, name);
  }

  function handleCancelBtnClick() {
    cancelRenameTask(task.id);
  }

  // Class toggle function
  function toggleRenameContainerClass() {
    let classes = "rename-container ";
    if (!task.rename) return (classes += "hide");
    return (classes = "rename-container");
  }

  function toggleRenameBtnClass() {
    let classes = "small-btn btn-primary ";
    if (task.rename) return (classes += "hide");
    return (classes = "small-btn btn-primary");
  }
  function toggleTaskCompletedClass() {
    let classes = "task-name ";
    if (task.complete) return (classes += "task-completed");
    return (classes = "task-name");
  }

  return (
    <div className="row">
      <div className="task">
        <span className={toggleRenameContainerClass()}>
          <input className="rename-input" ref={taskNameRef} type="text" />
          <span className="rename-btns">
            <button
              className="small-btn btn-success"
              onClick={handleChangeBtnClick}
            >
              Change
            </button>
            <button
              className="small-btn btn-danger"
              onClick={handleCancelBtnClick}
            >
              Cancel
            </button>
          </span>
        </span>
        <label>
          <input
            className="task-checkbox"
            type="checkbox"
            checked={task.complete}
            onChange={handleTaskClick}
          />
          <span className={toggleTaskCompletedClass()}>{task.name}</span>
        </label>
      </div>
      <button className={toggleRenameBtnClass()} onClick={handleRenameBtnClick}>
        Rename
      </button>
    </div>
  );
}

export default Task;
