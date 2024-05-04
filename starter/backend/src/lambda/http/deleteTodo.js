import middy from '@middy/core'
import cors from '@middy/http-cors'
import createError from 'http-errors'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import httpErrorHandler from '@middy/http-error-handler'
import { getTraceId, getUserId } from '../utils.mjs'

const logger = createLogger("deleteTodo")

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

      logger.info(`[deleteTodo | ${traceId}] Received request for: ${todoId} ${userId}`)

      await deleteTodo(todoId, userId)
      return {
        statusCode: 200
      }
    } catch (e) {

      logger.error(`[deleteTodo | ${traceId}] Something went wrong: ${e.message}`)

      throw createError(
        400,
        JSON.stringify({
          error: e.message
        })
      )
    }
  })
