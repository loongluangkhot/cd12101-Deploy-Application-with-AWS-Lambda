import middy from '@middy/core'
import cors from '@middy/http-cors'
import createError from 'http-errors'
import { getUserId } from '../utils.mjs'
import { getTodos } from '../../businessLogic/todos.mjs'

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
      const userId = getUserId(event)
      const items = await getTodos(userId)
      // TODO: Populate with attachmentUrl

      return {
        statusCode: 200,
        body: JSON.stringify({
          items
        })
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
