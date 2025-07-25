import { gql } from 'apollo-angular'

const GET_HABIT = gql`
query getHabit($id: Int!) {
  getHabit(id: $id)  {
    id
    name
  }
}`

const GET_HABITS = gql`
query {
  getHabits {
    id
    name
  }
}
`
const SAVE_HABIT = gql`
mutation SaveHabit($habit: HabitInput!) {
    saveHabit(habitInput: $habit)
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

export { GET_HABITS, GET_HABIT, SAVE_HABIT, ADD_TODO, DELETE_TODO }