import { v4 as uuidv4 } from 'uuid'
import {
  getTodoInDbByTodoId,
  queryTodosInDbByUserId,
  putTodoInDb,
  deleteTodoInDbByTodoId
} from '../dataLayer/todoAccess.mjs'
import { getAttachmentUrl } from '../fileStorage/attachmentUtils.mjs'

export async function getTodos(userId) {
  const todos = await queryTodosInDbByUserId(userId)
  if (todos.length <= 0) {
    throw new Exception(`No todos found for userId ${userId}`)
  }
  const todosWithAttachmentUrl = todos.map((i) => {
    const attachmentUrl = getAttachmentUrl(i.todoId)
    return {
      ...i,
      attachmentUrl
    }
  })

  return todosWithAttachmentUrl
}

export async function createTodo(userId, name, dueDate) {
  const done = false
  const todoId = uuidv4()
  const createdAt = new Date().toISOString()
  const item = {
    todoId,
    userId,
    dueDate,
    createdAt,
    name,
    done
  }
  await putTodoInDb(item)
  return item
}

export async function updateTodo(todoId, name, dueDate, done) {
  const todo = getTodoInDbByTodoId(todoId)
  if (todo === null || todo === undefined) {
    throw new Exception(`Todo with id ${todoId} does not exist!`)
  }

  const item = {
    ...todo,
    name,
    dueDate,
    done
  }
  return await putTodoInDb(item)
}

export async function deleteTodo(todoId) {
  await deleteTodoInDbByTodoId(todoId)
}
