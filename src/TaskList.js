import React from "react";
import Task from "./Task";

function TaskList({
  tasks,
  toggleTask,
  renameTask,
  applyRenameTask,
  cancelRenameTask,
}) {
  console.log(tasks);
  if (tasks === undefined || tasks === null) return null;
  return tasks.map((task) => {
    return (
      <Task
        key={task.id}
        toggleTask={toggleTask}
        renameTask={renameTask}
        applyRenameTask={applyRenameTask}
        cancelRenameTask={cancelRenameTask}
        task={task}
      />
    );
  });
}

export default TaskList;
