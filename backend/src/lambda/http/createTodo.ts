import 'source-map-support/register'

import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()

const todoTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  
  const todoId = uuid.v4()
  const userId = getUserId(event)
  const newTodo: CreateTodoRequest = {
    todoId,
    done: false,
    createdAt: new Date().toISOString(),
    ...JSON.parse(event.body)
  }

  await docClient.put({
    TableName: todoTable,
    Item: {
      userId,
      ...newTodo
    }
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newTodo
    })
  }
}
