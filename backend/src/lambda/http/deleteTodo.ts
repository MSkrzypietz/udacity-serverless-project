import 'source-map-support/register'

import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const todoTable = process.env.TODOS_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)
  
  await docClient.delete({
    TableName: todoTable,
    Key: {
      "userId": userId,
      "todoId": todoId
    }
  }).promise()

  await s3.deleteObject({
    Bucket: bucketName,
    Key: todoId
  }).promise()

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}
