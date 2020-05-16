import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()

export async function getAllTodos(userId: string): Promise<TodoItem[]> {

  return await todoAccess.getAllTodos(userId)
}

export async function createTodoItem(
  createGroupRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  return await todoAccess.createTodoItem({
    userId,
    todoId: uuid.v4(),
    done: false,
    createdAt: new Date().toISOString(),
    ...createGroupRequest
  })
}

export async function generateUploadUrl(userId: string, todoId: string): Promise<string> {
  const uploadUrl = await todoAccess.getSignedUrl(todoId)
  await todoAccess.updateAttachmentUrl(userId, todoId)

  return uploadUrl
}

export async function updateTodoItem(
  updateTodoRequest: UpdateTodoRequest,
  userId: string,
  todoId: string
): Promise<void> {

  await todoAccess.updateTodoItem(updateTodoRequest, userId, todoId)
}

export async function deleteTodoItem(userId: string, todoId: string) {

  await Promise.all([
    todoAccess.deleteTodoItem(userId, todoId),
    todoAccess.deleteTodoItemAttachment(todoId)
  ])  
}
