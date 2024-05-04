import middy from '@middy/core'
import cors from '@middy/http-cors'
import createError from 'http-errors'
import { getTraceId, getUserId } from '../utils.mjs'
import { queryTodosInDb } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import httpErrorHandler from '@middy/http-error-handler'

const logger = createLogger("getTodos")

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

      logger.info(`[getTodos | ${traceId}] Received request for: ${userId}`)

      const items = await queryTodosInDb(userId)
      return {
        statusCode: 200,
        body: JSON.stringify({
          items
        })
      }
    } catch (e) {

      logger.error(`[getTodos | ${traceId}] Something went wrong: ${e.message}`)

      throw createError(
        400,
        JSON.stringify({
          error: e.message
        })
      )
    }
  })
