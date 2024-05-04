import { v4 as uuidv4 } from 'uuid'
import {
  getTodoInDbByTodoId,
  queryTodosInDbByUserId,
  putTodoInDb,
  deleteTodoInDbByTodoId
} from '../dataLayer/todoAccess.mjs'
import { createLogger } from '../utils/logger.mjs'
import { getAttachmentUrlByTodoId } from '../fileStorage/attachmentUtils.mjs'

const logger = createLogger("todosBusinessLogic")

export async function getTodos(userId) {
  const todos = await queryTodosInDbByUserId(userId)
  const todosWithAttachmentUrl = await Promise.all(todos.map(async (i) => {
    const attachmentUrl = await getAttachmentUrlByTodoId(i.todoId)
    logger.info(`attachmentUrl for ${i.todoId}: ${attachmentUrl}`)
    return {
      ...i,
      attachmentUrl
    }
  }))

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

export async function updateTodo(todoId, name, dueDate, done, userId) {
  const todo = await getTodoInDbByTodoId(todoId, userId)
  if (todo === null) {
    throw new Error(`Todo with id ${todoId} does not exist!`)
  }

  const item = {
    ...todo,
    name,
    dueDate,
    done
  }
  return await putTodoInDb(item)
}

export async function deleteTodo(todoId, userId) {
  await deleteTodoInDbByTodoId(todoId, userId)
}
