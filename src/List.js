import React, { useRef } from "react";

function List({
  list,
  toggleList,
  renameList,
  applyRenameList,
  cancelRenameList,
  getListRenameDefaultValue,
}) {
  const renameNameRef = useRef();

  function listKeyPress(e) {
    if (e.keyCode === 13) {
      handleChangeBtnClick();
    }
  }

  // OnClick Handler Functions
  function handleListClick() {
    toggleList(list.id);
  }

  function handleRenameBtnClick() {
    renameList(list.id);
  }

  function handleChangeBtnClick() {
    const name = renameNameRef.current.value;
    applyRenameList(list.id, name);
  }

  function handleCancelBtnClick() {
    cancelRenameList(list.id);
  }

  // Class toggle function
  function toggleRenameContainerClass() {
    let classes = "rename-container ";
    if (!list.rename) return (classes += "hide");
    return classes;
  }

  let classes = "";
  if (list.rename) return (classes += "hide");
  function toggleListContainerClass() {
    return classes;
  }

  function toggleRenameBtnClass() {
    let classes = "small-btn btn-primary ";
    if (list.rename) return (classes += "hide");
    return classes;
  }

  function toggleListSelectedClass() {
    let classes = "list-name ";
    if (list.selected && !list.rename) return (classes += "list-selected");
    else if (!list.selected && list.rename) return (classes += "hide");
    return classes;
  }

  function handleRenameDefaultValue() {
    return getListRenameDefaultValue(list.id);
  }

  return (
    <div className="row">
      <div className="list">
        <span className={toggleRenameContainerClass()}>
          <input
            className="list-rename-input"
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
        <label className={toggleListContainerClass()}>
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
