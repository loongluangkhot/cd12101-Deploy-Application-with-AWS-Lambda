import middy from '@middy/core'
import cors from '@middy/http-cors'
import createError from 'http-errors'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import httpErrorHandler from '@middy/http-error-handler'
import { getTraceId, getUserId } from '../utils.mjs'

const logger = createLogger("updateTodo")

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {

    const traceId = getTraceId(event)

    try {
      const userId = getUserId(event)
      const todoId = event.pathParameters.todoId
      const { name, dueDate, done } = JSON.parse(event.body)

      logger.info(`[updateTodo | ${traceId}] Received request for: ${todoId} ${name} ${dueDate} ${done} ${userId}`)

      await updateTodo(todoId, name, dueDate, done, userId)
      return {
        statusCode: 200
      }
    } catch (e) {

      logger.error(`[updateTodo | ${traceId}] Something went wrong: ${e.message}`)

      throw createError(
        400,
        JSON.stringify({
          error: e.message
        })
      )
    }
  })
