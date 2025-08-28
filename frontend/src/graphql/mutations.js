import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $description: String, $dueDate: String) {
    createTask(title: $title, description: $description, dueDate: $dueDate) {
      id
      title
      description
      dueDate
      isComplete
      createdAt
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String, $description: String, $dueDate: String, $isComplete: Boolean) {
    updateTask(id: $id, title: $title, description: $description, dueDate: $dueDate, isComplete: $isComplete) {
      id
      title
      description
      dueDate
      isComplete
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      ok
    }
  }
`;

export const TOGGLE_TASK = gql`
  mutation ToggleTask($id: ID!, $isComplete: Boolean!) {
    updateTask(id: $id, isComplete: $isComplete) {
      task {
        id
        isComplete
      }
    }
  }
`;