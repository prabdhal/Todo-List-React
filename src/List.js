import React, { useRef } from "react";

function List({
  list,
  toggleList,
  renameList,
  applyRenameList,
  cancelRenameList,
}) {
  const listNameRef = useRef();

  // OnClick Handler Functions
  function handleListClick() {
    toggleList(list.id);
  }

  function handleRenameBtnClick() {
    renameList(list.id);
  }

  function handleChangeBtnClick() {
    const name = listNameRef.current.value;
    applyRenameList(list.id, name);
  }

  function handleCancelBtnClick() {
    cancelRenameList(list.id);
  }

  // Class toggle function
  function toggleRenameContainerClass() {
    console.log(
      `list selected is ${list.selected}, true = show rename container`
    );
    let classes = "rename-container ";
    if (!list.rename) return (classes += "hide");
    return (classes = "rename-container");
  }

  function toggleRenameBtnClass() {
    let classes = "small-btn btn-primary ";
    if (list.rename) return (classes += "hide");
    return (classes = "small-btn btn-primary");
  }

  function toggleListSelectedClass() {
    let classes = "list-name ";
    if (list.selected) return (classes += "list-selected");
    return (classes = "list-name");
  }

  return (
    <div className="row">
      <div className="list">
        <span className={toggleRenameContainerClass()}>
          <input className="rename-input" ref={listNameRef} type="text" />
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
          <span onClick={handleListClick} className={toggleListSelectedClass()}>
            {list.name}
          </span>
        </label>
      </div>
      <button className={toggleRenameBtnClass()} onClick={handleRenameBtnClick}>
        Rename
      </button>
    </div>
  );
}

export default List;
