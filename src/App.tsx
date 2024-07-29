import "./App.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Todo from "./components/Todo";
import { deleteTodo } from "./lib";

function App() {
  const [todos, setTodos] = useState<TTodos>([]);
  const [filter, setFilter] = useState<string>("All");
  useEffect(() => {
    async function fetchTodos() {
      const response = await axios.get("http://localhost:3000/todos");
      const data = await response.data;
      setTodos(data);
    }
    fetchTodos();
  }, []);

  const filteredTodos =
    filter === "Completed"
      ? todos.filter((todo) => todo.completed)
      : filter === "Active"
      ? todos.filter((todo) => !todo.completed)
      : todos;

  const todoInput = useRef<HTMLInputElement>(null);

  async function clearCompleted() {
    const completedTodos = todos.filter((todo) => todo.completed);
    completedTodos.forEach((todo) => {
      deleteTodo(setTodos, todo);
    });
  }

  const addTodo = async () => {
    try {
      const inputValue = todoInput.current?.value;
      if (inputValue?.trim()) {
        const newTodo = {
          todo: inputValue,
          completed: false,
          id: uuidv4(),
        };
        const addTodoResponse = await axios.post(
          "http://localhost:3000/todos",
          newTodo
        );
        if (addTodoResponse.status === 201) {
          setTodos([...todos, newTodo]);
          todoInput.current.value = "";
        } else {
          throw new Error("Failed to add new todo");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <input
        type="text"
        ref={todoInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addTodo();
          }
        }}
      />
      <button onClick={addTodo}>Add Todo</button>
      <button onClick={clearCompleted}>Clear Completed</button>
      <div>
        {["All", "Active", "Completed"].map((filterOption, index) => {
          return (
            <button key={index} onClick={() => setFilter(filterOption)}>
              {filterOption}
            </button>
          );
        })}
      </div>
      {filteredTodos.map((todoObj) => {
        return (
          <Todo
            todoObj={todoObj}
            todos={todos}
            setTodos={setTodos}
            key={todoObj.id}
          />
        );
      })}
    </>
  );
}

export default App;
