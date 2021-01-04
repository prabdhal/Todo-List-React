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

  const getWidth = () =>
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  function useCurrentWidth() {
    // save current window width in the state object
    let [width, setWidth] = useState(getWidth());

    // in this case useEffect will execute only once because
    // it does not have any dependencies.
    useEffect(() => {
      // timeoutId for debounce mechanism
      let timeoutId = null;
      const resizeListener = () => {
        // prevent execution of previous setTimeout
        clearTimeout(timeoutId);
        // change width from the state object after 150 milliseconds
        timeoutId = setTimeout(() => setWidth(getWidth()), 150);
      };
      // set resize listener
      window.addEventListener("resize", resizeListener);

      // clean up function
      return () => {
        // remove resize listener
        window.removeEventListener("resize", resizeListener);
      };
    }, []);

    return width;
  }

  function toggleTodoDeleteBtn(useCurrentWidth) {
    let classes = "btn btn-danger ";
    if (useCurrentWidth <= 1300) {
      return (classes += "hide");
    } else return classes;
  }

  function toggleTaskDeleteBtn(useCurrentWidth) {
    let classes = "btn btn-danger ";
    if (useCurrentWidth <= 1300) {
      return classes;
    } else return (classes += "hide");
  }

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
    console.log("handle add list");
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
    console.log("handle add list");
    const name = taskNameRef.current.value;
    if (name === "") return;
    const selectedList = lists.find((list) => list.id === selectedListId);
    selectedList.tasks.push({ id: uuidv4(), name: name, complete: false });
    taskNameRef.current.value = null;

    const newLists = [...lists];
    setLists(newLists);
  }

  function closeAllLists(e) {
    console.log("close all lists");
    lists.map((list) => {
      return (list.selected = false);
    });
    lists.map((list) => {
      console.log(list.selected);
    });

    const newLists = [...lists];
    setLists(newLists);
    setSelectedListId(null);
  }

  async function toggleList(id) {
    const selectedList = lists.find((list) => list.id === id);
    const newLists = [...lists];

    selectedList.selected = !selectedList.selected;
    const otherLists = newLists.filter((list) => list.id !== id);

    otherLists.map((list) => {
      return (list.selected = false);
    });
    setLists(newLists);
    await setSelectedListId(id);
  }

  function toggleTaskWindowClass() {
    let classes = "task-list-container ";
    const count = lists.filter((list) => list.selected).length;
    if (count <= 0) return (classes += "shift-tasks");
    return classes;
  }

  function toggleTodoListWindowClass() {
    let classes = "todo-lists-container ";
    const count = lists.filter((list) => list.selected).length;
    if (count <= 0) return classes;
    return (classes += "shift-todo-lists");
  }

  // finds the selected list and all its tasks via id in order
  // to toggle a task to complete or incomplete
  function toggleTask(id) {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find((task) => task.id === id);

    selectedTask.complete = !selectedTask.complete;
    const newLists = [...lists];
    setLists(newLists);
  }

  function handleDeleteLists() {
    const newLists = lists.filter((list) => !list.selected);
    setLists(newLists);
  }

  function handleClearTasks() {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const newTasks = selectedList.tasks.filter((task) => !task.complete);
    selectedList.tasks = newTasks;
    const newLists = [...lists];
    setLists(newLists);
  }

  function renderListsCount() {
    const count = lists.filter((list) => !list.complete).length;

    if (count <= 0) return "no active todo lists!";
    else if (count === 1) return `${count} active todo list`;
    else return `${count} active todo lists`;
  }

  function renderTasksCount() {
    if (selectedListId === null || selectedListId === undefined) return;
    const selectedList = lists.find((list) => list.id === selectedListId);
    if (selectedList === null || selectedList === undefined) return;
    const count = selectedList.tasks.filter((task) => !task.complete).length;

    if (count <= 0) return "no task left to complete!";
    else if (count === 1) return `${count} task left to complete`;
    else return `${count} tasks left to complete`;
  }

  function renderTodaysDate() {
    let today = new Date();

    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    let months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    if (dd < 10) {
      dd = "0" + dd;
    }

    let date = `${months[mm]}. ${dd}, ${yyyy}`;

    return date;
  }

  const selectedList = lists.find((list) => list.id === selectedListId);

  return (
    <div className="app">
      <Navbar />
      <main>
        <div className="date-container">
          <h5 className="date">{renderTodaysDate()}</h5>
        </div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <div className="page-line"></div>
        <section className={toggleTodoListWindowClass()}>
          <h4 className="lists-header">Todo Lists</h4>
          <input
            className="input-box"
            ref={listNameRef}
            type="text"
            placeholder="Enter a todo list..."
          />
          <button
            className="btn btn-success"
            onClick={handleAddList}
            onSubmit={handleAddList}
          >
            Add
          </button>
          <button
            className={toggleTodoDeleteBtn(useCurrentWidth())}
            onClick={handleDeleteLists}
          >
            Delete List
          </button>
          <div className="count">{renderListsCount()}</div>
          <div className="todo-lists">
            <TodoList lists={lists} toggleList={toggleList} />
          </div>
        </section>

        <section className={toggleTaskWindowClass()}>
          <div className="btn-container">
            <button className="btn btn-primary" onClick={closeAllLists}>
              Lists
            </button>
            <button
              className={toggleTaskDeleteBtn(useCurrentWidth())}
              onClick={handleDeleteLists}
            >
              Delete List
            </button>
          </div>
          <h4 className="tasks-header">Tasks</h4>
          <input
            className="input-box"
            ref={taskNameRef}
            type="text"
            placeholder="Enter a task..."
          />
          <button
            className="btn btn-success"
            onClick={handleAddTask}
            onSubmit={handleAddTask}
          >
            Add
          </button>
          <button className="btn btn-danger" onClick={handleClearTasks}>
            Clear Complete
          </button>
          <div className="count">{renderTasksCount()}</div>
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
