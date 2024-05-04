import middy from '@middy/core'
import cors from '@middy/http-cors'
import createError from 'http-errors'
import { generateUploadUrl } from '../../fileStorage/attachmentUtils.mjs'
import { getTime, getTraceId, getUserId, putTimeTakenMetric } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'
import httpErrorHandler from '@middy/http-error-handler'

const logger = createLogger("generateUploadUrl")

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
      const todoId = event.pathParameters.todoId

      logger.info(`[generateUploadUrl | ${traceId}] Received request for: ${todoId} ${userId}`)

      const uploadUrl = await generateUploadUrl(todoId, userId)
      
      const timeEnd = getTime()
      const timeTaken = timeEnd - timeStart

      await putTimeTakenMetric("generateUploadUrl", timeTaken);

      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl
        })
      }
    } catch (e) {

      logger.error(`[generateUploadUrl | ${traceId}] Something went wrong: ${e.message}`)

      throw createError(
        400,
        JSON.stringify({
          error: e.message
        })
      )
    }
  })
