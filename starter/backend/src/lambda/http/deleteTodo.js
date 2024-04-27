import middy from '@middy/core'
import cors from '@middy/http-cors'
import createError from 'http-errors'
import { deleteTodo } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    // TODO: Remove a TODO item by id
    try {
      const todoId = event.pathParameters.todoId
      await deleteTodo(todoId)
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
