import axios from "axios";
import { deleteTodo } from "../lib";

interface ITodoProps {
  todoObj: ITodo;
  todos: ITodo[];
  setTodos: React.Dispatch<React.SetStateAction<TTodos>>;
}

export default function Todo({ todoObj, todos, setTodos }: ITodoProps) {
  async function completeTodo() {
    try {
      const response = await axios.patch(
        `http://localhost:3000/todos/${todoObj.id}`,
        {
          completed: !todoObj.completed,
        }
      );
      if (response.status === 200) {
        const newTodos = todos.map((todo) => {
          if (todo.id === todoObj.id) {
            return { ...todo, completed: !todo.completed };
          }
          return todo;
        });
        setTodos(newTodos);
      } else {
        throw new Error("Failed to change the todo");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      style={{ border: "2px solid red", padding: "1rem", cursor: "pointer" }}
    >
      <h2
        style={todoObj.completed ? { textDecoration: "line-through" } : {}}
        onClick={completeTodo}
      >
        {todoObj.todo}
      </h2>
      <button onClick={() => deleteTodo(setTodos, todoObj)}>X</button>
    </div>
  );
}
