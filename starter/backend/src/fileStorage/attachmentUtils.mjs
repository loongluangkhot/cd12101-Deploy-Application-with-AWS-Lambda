import { v4 as uuidv4 } from 'uuid'
import {
  getTodoInDbByTodoId,
  getAttachmentUploadUrl,
  getAttachmentUrl,
  getAttachmentInDbByTodoId,
  putAttachmentInDb
} from '../dataLayer/todoAccess.mjs'

export async function generateUploadUrl(todoId) {
  const todo = getTodoInDbByTodoId(todoId)
  if (todo === null || todo === undefined) {
    throw new Exception(`Todo with id ${todoId} does not exist!`)
  }

  const attachmentId = uuidv4()
  const attachmentUrl = getAttachmentUrl(attachmentId)
  const attachment = {
    todoId,
    attachmentId,
    attachmentUrl
  }

  await putAttachmentInDb(attachment)

  return await getAttachmentUploadUrl(attachmentId)
}

export async function getAttachmentUrl(todoId) {
  const attachment = getAttachmentInDbByTodoId(todoId)
  if (attachment === null || attachment === undefined) {
    return null
  }
  return attachment.attachmentUrl
}
