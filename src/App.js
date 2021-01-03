import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import TodoList from "./TodoList";
import TaskList from "./TaskList";
import uuidv4 from "uuid/dist/v4";

const LOCAL_STORAGE_LIST_KEY = "todoApp.list";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "todoApp.selectedListId";

function App() {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState();
  const listNameRef = useRef();
  const taskNameRef = useRef();

  // loads all todo and task data upon opening app
  useEffect(() => {
    const storedLists = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_LIST_KEY)
    );
    const storedSelectedListId = localStorage.getItem(
      LOCAL_STORAGE_SELECTED_LIST_ID_KEY
    );
    if (storedLists) setLists(storedLists);
    if (storedSelectedListId) setSelectedListId(storedSelectedListId);
  }, []);

  // saves all todo data upon setting todos or tasks
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    console.log("Updating lists");
  }, [lists]);

  // saves all todo data upon setting todos or tasks
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
    setSelectedListId(selectedListId);
    console.log("Updating selected lists " + selectedListId);
  }, [selectedListId]);

  function handleAddList(e) {
    const name = listNameRef.current.value;
    if (name === "") return;
    console.log("selected" + selectedListId);
    const id = uuidv4();
    setSelectedListId(id);
    console.log(id);
    console.log("selected" + selectedListId);
    setLists((prevLists) => {
      return [...prevLists, { id: id, name: name, selected: false, tasks: [] }];
    });
    listNameRef.current.value = null;
    console.log(id);
    console.log("selected" + selectedListId);
  }

  function handleAddTask(e) {
    const name = taskNameRef.current.value;
    if (name === "") return;
    const selectedList = lists.find((list) => list.id === selectedListId);

    console.log(selectedList);
    console.log(selectedListId);
    console.log(selectedList.id);
    selectedList.tasks.push({ id: uuidv4(), name: name, complete: false });

    taskNameRef.current.value = null;
  }

  async function toggleList(id) {
    const selectedList = lists.find((list) => list.id === id);
    const newLists = [...lists];

    selectedList.selected = !selectedList.selected;
    const otherLists = newLists.filter((list) => list.id !== id);

    otherLists.map((list) => {
      list.selected = false;
    });
    setLists(newLists);
    await setSelectedListId(id);
  }

  function toggleTaskWindowClass() {
    let classes = "task-section ";
    const count = lists.filter((list) => list.selected).length;
    if (count <= 0) return (classes += "hide");
    return classes;
  }

  // finds the selected list and all its tasks via id in order
  // to toggle a task to complete or incomplete
  function toggleTask(id) {
    const selectedList = lists.find((list) => list.id === selectedListId);

    const selectedTask = selectedList.tasks.find((task) => task.id === id);

    selectedTask.complete = !selectedTask.complete;
  }

  function handleDeleteLists() {
    const newLists = lists.filter((list) => !list.selected);
    setLists(newLists);
  }

  function handleClearTasks() {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const newTasks = selectedList.tasks.filter((task) => !task.complete);
    selectedList.tasks = [];
    selectedList.tasks.push(newTasks);
  }

  function renderListsCount() {
    const count = lists.filter((list) => !list.complete).length;

    if (count <= 0) return "no todo lists left to complete!";
    else if (count === 1) return `${count} todo list left to complete`;
    else return `${count} todo lists left to complete`;
  }

  function renderTasksCount() {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const count = selectedList.tasks.filter((task) => !task.complete).length;

    if (count <= 0) return "no task left to complete!";
    else if (count === 1) return `${count} task left to complete`;
    else return `${count} tasks left to complete`;
  }

  const selectedList = lists.find((list) => list.id === selectedListId);

  return (
    <div className="app">
      <Navbar />
      <main>
        <section className="todo-section">
          <input
            ref={listNameRef}
            type="text"
            placeholder="Enter a todo list..."
          />
          <button onClick={handleAddList} onSubmit={handleAddList}>
            Add
          </button>
          <button onClick={handleDeleteLists}>Delete List</button>
          <div className="count">{renderListsCount()}</div>
          <div className="todo-list">
            <TodoList lists={lists} toggleList={toggleList} />
          </div>
        </section>

        <section className={toggleTaskWindowClass()}>
          <input ref={taskNameRef} type="text" placeholder="Enter a task..." />
          <button onClick={handleAddTask} onSubmit={handleAddTask}>
            Add
          </button>
          <button onClick={handleClearTasks}>Clear Complete</button>
          <div className="count">{renderTasksCount}</div>
          <div className="task-list">
            <TaskList
              tasks={selectedList ? selectedList.tasks : null}
              toggleTask={toggleTask}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
