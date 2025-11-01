import { gql } from 'apollo-angular'

const GET_HABIT = gql`
query getHabit($id: Int!) {
  getHabit(id: $id)  {
    id
    name
    shortName
  }
}`

const GET_HABITS = gql`
query {
  getHabits {
    id
    name
    shortName
  }
}
`
const SAVE_HABIT = gql`
mutation SaveHabit($habit: HabitInput!) {
    saveHabit(habitInput: $habit)
}
`

const DELETE_HABIT = gql`
mutation deleteHabit($id:Int!){
  deleteHabit(id:$id)
}`

const GET_EXECUTIONS = gql`
query {
  getExecutions{
    id,
    date,
    status,
    habit{
      id,
      name,
      shortName
    }
  }
}
`

const COMPLETE_EXECUTION = gql`
mutation completeExecution($id:Int!, $date: String!){
  completeExecution(id:$id, date:$date)
}`

const SKIP_EXECUTION = gql`
mutation skipExecution($id:Int!, $date: String!){
  skipExecution(id:$id, date:$date)
}`

const RESET_EXECUTION = gql`
mutation resetExecution($id:Int!, $date: String!){
  resetExecution(id:$id, date:$date)
}`
const FAIL_EXECUTION = gql`
mutation failExecution($id:Int!, $date: String!){
  failExecution(id:$id, date:$date)
}`

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

export {
  GET_HABITS, GET_HABIT, SAVE_HABIT, DELETE_HABIT,
  GET_EXECUTIONS, COMPLETE_EXECUTION, SKIP_EXECUTION, RESET_EXECUTION, FAIL_EXECUTION,
  ADD_TODO, DELETE_TODO
}