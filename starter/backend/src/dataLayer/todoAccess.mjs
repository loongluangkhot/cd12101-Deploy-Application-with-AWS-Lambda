import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())
const s3Client = new S3Client()

const todosTable = process.env.TODOS_TABLE
const attachmentsTable = process.env.ATTACHMENTS_TABLE
const attachmentsBucket = process.env.ATTACHMENTS_S3_BUCKET
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION;

export async function getTodos(userId) {
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

export async function putTodo(todo) {
  await dynamoDbClient.put({
    TableName: todosTable,
    Item: todo
  })
  return todo
}

export async function getTodo(todoId) {
  const res = await dynamoDbClient.get({
    TableName: todosTable,
    Key: {
      id: todoId
    }
  })
  return res.Item
}

export async function deleteTodo(todoId) {
  await dynamoDbClient.delete({
    TableName: todosTable,
    Key: {
      id: todoId
    }
  })
}

export async function getAttachment(todoId) {
  const res = await dynamoDbClient.get({
    TableName: attachmentsTable,
    Key: {
      id: todoId
    }
  })
  return res.Item
}

export async function putAttachmentUrl(attachment) {
  await dynamoDbClient.put({
    TableName: attachmentsTable,
    Item: attachment,
  })
  return attachment
}

async function getAttachmentUploadUrl(todoId) {
  const command = new PutObjectCommand({
    Bucket: attachmentsBucket,
    Key: todoId
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: signedUrlExpiration
  })
  return url
}