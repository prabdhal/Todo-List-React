import React from "react";
import Task from "./Task";

function TaskList({ tasks, toggleTask }) {
  if (tasks === undefined || tasks === null) return null;
  console.log("rendering task");
  return tasks.map((task) => {
    return <Task key={task.id} toggleTask={toggleTask} task={task} />;
  });
}

export default TaskList;
