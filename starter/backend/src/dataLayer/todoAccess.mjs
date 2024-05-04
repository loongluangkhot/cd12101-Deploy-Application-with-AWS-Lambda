import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from "aws-xray-sdk-core"

const dynamoDbDocument = DynamoDBDocument.from(AWSXRay.captureAWSv3Client(new DynamoDB()))
const s3Client = AWSXRay.captureAWSv3Client(new S3Client())

const todosTable = process.env.TODOS_TABLE
const attachmentsTable = process.env.ATTACHMENTS_TABLE
const attachmentsBucket = process.env.ATTACHMENTS_S3_BUCKET
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION

export async function queryTodosInDbByUserId(userId) {
  const res = await dynamoDbDocument.query({
    TableName: todosTable,
    IndexName: todoUserIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  })
  return res.Items
}

export async function putTodoInDb(todo) {
  await dynamoDbClient.put({
    TableName: todosTable,
    Item: todo
  })
  return todo
}

export async function getTodoInDbByTodoId(todoId) {
  const res = await dynamoDbClient.get({
    TableName: todosTable,
    Key: {
      id: todoId
    }
  })
  return res.Item
}

export async function deleteTodoInDbByTodoId(todoId) {
  await dynamoDbClient.delete({
    TableName: todosTable,
    Key: {
      id: todoId
    }
  })
}

export async function getAttachmentInDbByTodoId(todoId) {
  const res = await dynamoDbClient.get({
    TableName: attachmentsTable,
    Key: {
      id: todoId
    }
  })
  return res.Item
}


export function getAttachmentUrl(attachmentId) {
  return $`https://${attachmentsBucket}.s3.amazonaws.com/${attachmentId}`
}

export async function putAttachmentInDb(attachment) {
  await dynamoDbClient.put({
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
