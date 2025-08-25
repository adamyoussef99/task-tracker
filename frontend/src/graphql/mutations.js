import { gql } from "@apollo/client";

export const TOGGLE_TASK = gql`
  mutation UpdateTask($id: ID!, $isComplete: Boolean!) {
    updateTask(id: $id, isComplete: $isComplete) {
      task {
        id
        isComplete
      }
    }
  }
`;