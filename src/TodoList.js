import React from "react";
import List from "./List";

function TodoList({
  lists,
  toggleList,
  renameList,
  getListRenameDefaultValue,
  applyRenameList,
  cancelRenameList,
}) {
  return lists.map((list) => {
    return (
      <List
        key={list.id}
        toggleList={toggleList}
        renameList={renameList}
        getListRenameDefaultValue={getListRenameDefaultValue}
        applyRenameList={applyRenameList}
        cancelRenameList={cancelRenameList}
        list={list}
      />
    );
  });
}

export default TodoList;
