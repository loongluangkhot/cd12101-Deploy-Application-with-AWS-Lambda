import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from "aws-xray-sdk-core"
import { isEmpty } from '../lambda/utils.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger("todoAccess")

const dynamoDbDocument = DynamoDBDocument.from(AWSXRay.captureAWSv3Client(new DynamoDB()))
const s3Client = AWSXRay.captureAWSv3Client(new S3Client())

const todosTable = process.env.TODOS_TABLE
const todosUserIdIndex = process.env.TODOS_USER_ID_INDEX
const attachmentsTable = process.env.ATTACHMENTS_TABLE
const attachmentsBucket = process.env.ATTACHMENTS_S3_BUCKET
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION

export async function queryTodosInDbByUserId(userId) {
  const res = await dynamoDbDocument.query({
    TableName: todosTable,
    IndexName: todosUserIdIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  })
  return res.Items
}

export async function putTodoInDb(todo) {
  await dynamoDbDocument.put({
    TableName: todosTable,
    Item: todo
  })
  return todo
}

export async function getTodoInDbByTodoId(todoId, userId) {
  const res = await dynamoDbDocument.get({
    TableName: todosTable,
    Key: {
      todoId,
      userId
    }
  })
  return isEmpty(res.Item) ? null : res.Item
}

export async function deleteTodoInDbByTodoId(todoId, userId) {
  await dynamoDbDocument.delete({
    TableName: todosTable,
    Key: {
      todoId,
      userId
    }
  })
}

export async function getAttachmentInDbByTodoId(todoId) {
  const res = await dynamoDbDocument.get({
    TableName: attachmentsTable,
    Key: {
      todoId
    }
  })
  return isEmpty(res.Item) ? null : res.Item
}


export function getAttachmentUrlByAttachmentId(attachmentId) {
  return $`https://${attachmentsBucket}.s3.amazonaws.com/${attachmentId}`
}

export async function putAttachmentInDb(attachment) {
  await dynamoDbDocument.put({
    TableName: attachmentsTable,
    Item: attachment
  })
  return attachment
}

export async function getAttachmentUploadUrl(attachmentId) {
  const command = new PutObjectCommand({
    Bucket: attachmentsBucket,
    Key: attachmentId
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: signedUrlExpiration
  })
  return url
}
