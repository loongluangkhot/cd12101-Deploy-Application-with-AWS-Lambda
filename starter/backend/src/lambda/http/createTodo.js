import middy from '@middy/core'
import cors from '@middy/http-cors'
import createError from 'http-errors'
import { createTodo } from '../../businessLogic/todos.mjs'
import { getTime, getTraceId, getUserId, putTimeTakenMetric } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'
import httpErrorHandler from '@middy/http-error-handler'

const logger = createLogger("createTodo")

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
      const timeStart = getTime()

      const userId = getUserId(event)
      const { name, dueDate } = JSON.parse(event.body)

      logger.info(`[createTodo | ${traceId}] Received request for: ${userId} ${name} ${dueDate}`)

      const item = await createTodo(userId, name, dueDate)

      const timeEnd = getTime()
      const timeTaken = timeEnd - timeStart

      await putTimeTakenMetric("createTodo", timeTaken);

      return {
        statusCode: 201,
        body: JSON.stringify({
          item
        })
      }
    } catch (e) {

      logger.error(`[createTodo | ${traceId}] Something went wrong: ${e.message}`)

      throw createError(
        400,
        JSON.stringify({
          error: e.message
        })
      )
    }
  })
