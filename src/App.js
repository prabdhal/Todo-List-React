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

  const newLists = [...lists];
  const selectedList = newLists.find((list) => list.id === selectedListId);

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
  }, [lists]);

  // saves all todo data upon setting todos or tasks
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
  }, [selectedListId]);

  //-------------------- WINDOW WIDTH DEPENDENT FUNCTIONS --------------------//

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

  // Class Toggle Functions
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

  //-------------------- LIST FUNCTIONS --------------------//
  // OnKeyDown Function
  function listKeyPress(e) {
    if (e.keyCode == 13) {
      handleAddList(e);
    }
  }

  // Initializes a list item
  function handleAddList(e) {
    const name = listNameRef.current.value;

    closeRenameListContainers(newLists);

    if (name === "") return;

    const id = uuidv4();
    setSelectedListId(id);
    setLists((prevLists) => {
      return [
        ...prevLists,
        { id: id, name: name, selected: false, tasks: [], rename: false },
      ];
    });
    listNameRef.current.value = null;
  }

  // Toggles list property of selected
  function toggleList(id) {
    const selectedList = lists.find((list) => list.id === id);
    const newLists = [...lists];

    // otherList creation is important to ensure selected
    // list works without reseting its selected property
    selectedList.selected = !selectedList.selected;
    closeRenameListContainers(newLists);
    closeRenameTaskContainers(selectedList);
    const otherLists = newLists.filter((list) => list.id !== id);

    otherLists.map((list) => {
      return (list.selected = false);
    });
    setLists(newLists);
    setSelectedListId(id);
  }

  // Gets all lists and sets their selected property to false
  function closeAllLists(e) {
    const newLists = [...lists];

    closeRenameListContainers(newLists);
    // close all tasks for each list
    newLists.map((list) => {
      return list.tasks.map((task) => (task.rename = false));
    });

    newLists.map((list) => {
      return (list.selected = false);
    });

    setLists(newLists);
    setSelectedListId(null);
  }

  // Toggles shifting animation classes
  function toggleTodoListWindowClass() {
    let classes = "todo-lists-container ";
    const count = lists.filter((list) => list.selected).length;
    if (count <= 0) return classes;
    return (classes += "shift-todo-lists");
  }

  // Deletes selected list
  function handleDeleteLists() {
    const newLists = [...lists];

    closeRenameListContainers(newLists);
    const remainingLists = lists.filter((list) => !list.selected);
    setLists(remainingLists);
    setSelectedListId(null);
  }

  function renderListsCount() {
    const count = lists.filter((list) => !list.complete).length;

    if (count <= 0) return "no active todo lists!";
    else if (count === 1) return `${count} active todo list`;
    else return `${count} active todo lists`;
  }

  // Sets list property of rename to true
  function renameList(id) {
    const newLists = [...lists];

    const selectedList = lists.find((list) => list.id === id);
    closeRenameListContainers(newLists);
    closeRenameTaskContainers(selectedList);
    selectedList.rename = true;

    setLists(newLists);
    setSelectedListId(id);
  }

  // Sets list property of name to inputted value
  function applyRenameList(id, name) {
    const newLists = [...lists];

    const selectedList = newLists.find((list) => list.id === id);
    selectedList.rename = false;

    if (name === "") return;
    selectedList.name = name;

    setLists(newLists);
    setSelectedListId(id);
  }

  // Sets list property of rename to false
  function cancelRenameList(id) {
    const newLists = [...lists];

    const selectedList = lists.find((list) => list.id === id);
    selectedList.rename = false;

    setLists(newLists);
    setSelectedListId(id);
  }

  function closeRenameListContainers(lists) {
    lists.map((list) => (list.rename = false));
  }

  //-------------------- TASK FUNCTIONS --------------------//

  //OnKeyDown Function
  function taskKeyPress(e) {
    if (e.keyCode == 13) {
      handleAddTask(e);
    }
  }

  // Initializes a task item
  function handleAddTask(e) {
    const newLists = [...lists];

    const name = taskNameRef.current.value;
    if (name === "") return;
    const selectedList = newLists.find((list) => list.id === selectedListId);
    closeRenameListContainers(newLists);
    closeRenameTaskContainers(selectedList);
    selectedList.tasks.push({
      id: uuidv4(),
      name: name,
      complete: false,
      rename: false,
    });
    taskNameRef.current.value = null;

    setLists(newLists);
  }

  // toggles task property of complete
  function toggleTask(id) {
    const newLists = [...lists];

    const selectedList = newLists.find((list) => list.id === selectedListId);
    closeRenameListContainers(newLists);
    closeRenameTaskContainers(selectedList);

    const selectedTask = selectedList.tasks.find((task) => task.id === id);
    selectedTask.complete = !selectedTask.complete;

    setLists(newLists);
  }

  // Toggles shifting animation classes
  function toggleTaskWindowClass() {
    let classes = "task-list-container ";
    const count = lists.filter((list) => list.selected).length;
    if (count <= 0) return (classes += "shift-tasks");
    return classes;
  }

  // Clears all completed tasks
  function handleClearTasks() {
    const newLists = [...lists];

    const selectedList = lists.find((list) => list.id === selectedListId);
    closeRenameListContainers(newLists);
    closeRenameTaskContainers(selectedList);

    const newTasks = selectedList.tasks.filter((task) => !task.complete);
    selectedList.tasks = newTasks;

    setLists(newLists);
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

  // Sets task property of rename to true
  function renameTask(id) {
    const newLists = [...lists];

    // close all other rename inputs
    const selectedList = newLists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find((task) => task.id === id);

    closeRenameListContainers(newLists);
    closeRenameTaskContainers(selectedList);
    selectedTask.rename = true;

    setLists(newLists);
  }

  // Sets task property of name to inputted value
  function applyRenameTask(id, name) {
    const newLists = [...lists];

    const selectedList = newLists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find((task) => task.id === id);

    selectedTask.rename = false;

    if (name === "") return;
    selectedTask.name = name;

    setLists(newLists);
  }

  // Sets task property of rename to false
  function cancelRenameTask(id) {
    const newLists = [...lists];

    const selectedList = newLists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find((task) => task.id === id);

    selectedTask.rename = false;

    console.log(
      `cancelRenameList function ran and the selected list rename is ${selectedTask.rename}`
    );

    setLists(newLists);
  }

  // Close Rename Container
  function closeRenameTaskContainers(selectedList) {
    selectedList.tasks.map((task) => (task.rename = false));
  }

  function renderTodaysDate() {
    let today = new Date();

    let dd = today.getDate();
    let mm = today.getMonth();
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

  return (
    <div className="app">
      <Navbar />
      <main>
        <div className="date-container">
          <h5 className="date">{renderTodaysDate()}</h5>
        </div>
        <div>
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
        </div>
        <section className={toggleTodoListWindowClass()}>
          <h4 className="lists-header">Todo Lists</h4>
          <input
            className="input-box"
            ref={listNameRef}
            type="text"
            placeholder="Enter a todo list..."
            onKeyDown={listKeyPress}
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
            <TodoList
              lists={lists}
              toggleList={toggleList}
              renameList={renameList}
              applyRenameList={applyRenameList}
              cancelRenameList={cancelRenameList}
            />
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
            onKeyDown={taskKeyPress}
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
              renameTask={renameTask}
              applyRenameTask={applyRenameTask}
              cancelRenameTask={cancelRenameTask}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
