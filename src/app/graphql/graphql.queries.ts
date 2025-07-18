import { gql } from 'apollo-angular'

const GET_HABIT = gql`
query {
  getHabits {
    name
  }
}
`
const ADD_HABIT = gql`
mutation createHabitName($name: String!) {
  createHabit(
    CreateHabitInput: {name: $name})
}
`

const ADD_TODO = gql`
  mutation addTodo($name: String!, $description: String!) {
  addTodo(name: $name, description: $description) {
    id
    name
    description
  }
}
`

const DELETE_TODO = gql`
  mutation deleteTodo($id: Int!) {
  deleteTodo(id: $id) {
    id
  }
}
`

export { GET_HABIT, ADD_HABIT, ADD_TODO, DELETE_TODO }