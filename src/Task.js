import React, { useRef } from "react";

function Task({
  task,
  toggleTask,
  renameTask,
  applyRenameTask,
  cancelRenameTask,
  getTaskRenameDefaultValue,
}) {
  const renameNameRef = useRef();

  function listKeyPress(e) {
    if (e.keyCode === 13) {
      handleChangeBtnClick();
    }
  }

  function handleTaskClick() {
    toggleTask(task.id);
  }

  function handleRenameBtnClick() {
    renameTask(task.id);
  }

  function handleChangeBtnClick() {
    const name = renameNameRef.current.value;
    applyRenameTask(task.id, name);
  }

  function handleCancelBtnClick() {
    cancelRenameTask(task.id);
  }

  // Class toggle function
  function toggleRenameContainerClass() {
    let classes = "rename-container ";
    if (!task.rename) return (classes += "hide");
    return classes;
  }

  function toggleTaskContainerClass() {
    let classes = "task-label ";
    if (task.rename) return (classes += "hide");
    return classes;
  }

  function toggleRenameBtnClass() {
    let classes = "small-btn btn-primary ";
    if (task.rename) return (classes += "hide");
    return classes;
  }

  function toggleTaskCompletedClass() {
    let classes = "task-name ";
    if (task.complete) return (classes += "task-completed");
    return classes;
  }

  function handleRenameDefaultValue() {
    console.log(getTaskRenameDefaultValue(task.id));

    return getTaskRenameDefaultValue(task.id);
  }

  return (
    <div className="row">
      <div className="task">
        <span className={toggleRenameContainerClass()}>
          <input
            className="task-rename-input"
            onKeyDown={listKeyPress}
            ref={renameNameRef}
            defaultValue={handleRenameDefaultValue()}
            type="text"
          />
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
        <label className={toggleTaskContainerClass()}>
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
