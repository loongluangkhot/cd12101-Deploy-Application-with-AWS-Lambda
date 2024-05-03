import middy from '@middy/core'
import cors from '@middy/http-cors'
import createError from 'http-errors'
import { getUserId } from '../utils.mjs'
import { getTodos } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

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

      const items = await getTodos(userId)
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
