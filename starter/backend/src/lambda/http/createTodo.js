import middy from '@middy/core'
import cors from '@middy/http-cors'
import createError from 'http-errors'
import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    // TODO: Get all TODO items for a current user
    try {
      const { name, dueDate } = JSON.parse(event.body)
      const userId = getUserId(event)
      const todoCreated = await createTodo(userId, name, dueDate)

      // TODO: Check the expected output shape
      return {
        statusCode: 201,
        body: JSON.stringify(todoCreated)
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
