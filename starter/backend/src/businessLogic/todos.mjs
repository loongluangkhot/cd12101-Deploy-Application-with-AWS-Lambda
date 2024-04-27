import { getTodo, getTodos, putTodo } from '../dataLayer/todoAccess.mjs'

export async function getTodos(userId) {
  const todos = await getTodos(userId)
  if (todos.length <= 0) {
    throw new Exception(`No todos found for userId ${userId}`)
  }
  return todos
}

export async function createTodo(userId, name, dueDate) {
  const done = false
  const todoId = uuid()
  const createdAt = new Date().toISOString()
  const item = {
    todoId,
    userId,
    dueDate,
    createdAt,
    name,
    done
  }
  return await putTodo(item)
}

export async function updateTodo(todoId, name, dueDate, done) {
  const todo = getTodo(todoId);
  const item = {
    ...todo,
    name,
    dueDate,
    done
  }
  return await putTodo(item)
}

export async function deleteTodo(todoId) {
  await deleteTodo(todoId)
}