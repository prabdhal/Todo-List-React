import React from "react";
import Task from "./Task";

function TaskList({
  tasks,
  toggleTask,
  renameTask,
  applyRenameTask,
  cancelRenameTask,
  getTaskRenameDefaultValue,
}) {
  if (tasks === undefined || tasks === null) return null;
  return tasks.map((task) => {
    return (
      <Task
        key={task.id}
        toggleTask={toggleTask}
        renameTask={renameTask}
        getTaskRenameDefaultValue={getTaskRenameDefaultValue}
        applyRenameTask={applyRenameTask}
        cancelRenameTask={cancelRenameTask}
        task={task}
      />
    );
  });
}

export default TaskList;
