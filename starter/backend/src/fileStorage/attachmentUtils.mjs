import { v4 as uuidv4 } from 'uuid'
import {
  getTodo,
  getAttachmentUploadUrl,
  getAttachmentUrl,
  getAttachment,
  putAttachment
} from '../dataLayer/todoAccess.mjs'

export async function generateUploadUrl(todoId) {
  const todo = getTodo(todoId)
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

  await putAttachment(attachment)

  return await getAttachmentUploadUrl(attachmentId)
}

export async function getAttachmentUrl(todoId) {
  const attachment = getAttachment(todoId)
  if (attachment === null || attachment === undefined) {
    return null
  }
  return attachment.attachmentUrl
}
