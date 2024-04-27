import middy from '@middy/core'
import cors from '@middy/http-cors'
import createError from 'http-errors'
import { updateTodo } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    try {
      const todoId = event.pathParameters.todoId
      const { name, dueDate, done } = JSON.parse(event.body)
      await updateTodo(todoId, name, dueDate, done)
      return {
        statusCode: 200
      }
    } catch (e) {
      throw createError(
        400,
        JSON.stringify({
          error: e.message
        })
      )
    }
  })
