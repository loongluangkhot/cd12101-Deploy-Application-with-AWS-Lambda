import { v4 as uuidv4 } from 'uuid'
import {
  getTodoInDbByTodoId,
  getAttachmentUploadUrl,
  getAttachmentUrlByAttachmentId,
  getAttachmentInDbByTodoId,
  putAttachmentInDb
} from '../dataLayer/todoAccess.mjs'

export async function generateUploadUrl(todoId, userId) {
  const todo = await getTodoInDbByTodoId(todoId, userId)
  if (todo === null) {
    throw new Error(`Todo with id ${todoId} does not exist!`)
  }

  const attachmentId = uuidv4()
  const attachmentUrl = getAttachmentUrlByAttachmentId(attachmentId)
  const attachment = {
    todoId,
    attachmentId,
    attachmentUrl
  }

  await putAttachmentInDb(attachment)

  return await getAttachmentUploadUrl(attachmentId)
}

export async function getAttachmentUrlByTodoId(todoId) {
  const attachment = await getAttachmentInDbByTodoId(todoId)
  if (attachment === null) {
    return null
  }
  return attachment.attachmentUrl
}
