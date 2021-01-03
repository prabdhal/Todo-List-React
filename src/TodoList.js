import React from "react";
import List from "./List";

function TodoList({ lists, toggleList }) {
  return lists.map((list) => {
    return <List key={list.id} toggleList={toggleList} list={list} />;
  });
}

export default TodoList;
