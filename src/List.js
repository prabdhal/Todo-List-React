import React from "react";

function List({ list, toggleList }) {
  function handleListClick() {
    toggleList(list.id);
  }

  function toggleListSelectedClass() {
    let classes = "list-name ";
    if (list.selected) return (classes += "list-selected");
    return (classes = "list-name");
  }

  return (
    <div>
      <label className="list">
        <span onClick={handleListClick} className={toggleListSelectedClass()}>
          {list.name}
        </span>
      </label>
    </div>
  );
}

export default List;
