import axios from "axios";
export async function deleteTodo(
  setTodos: React.Dispatch<React.SetStateAction<TTodos>>,
  todoObj: ITodo
) {
  try {
    const deleteTodoResponse = await axios.delete(
      `http://localhost:3000/todos/${todoObj.id}`
    );

    if (deleteTodoResponse.status === 200) {
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.id !== todoObj.id)
      );
    } else {
      throw new Error("Failed to delete the todo");
    }
  } catch (error) {
    console.log(error);
  }
}
