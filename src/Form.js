// @flow
import * as React from 'react'

// ===========================
// Flow Types
// ===========================
export type Props = {
  +children: React.Node,
  +onSubmit?: ({ [string]: any }) => void,
}

type Field = {
  value: string,
  error?: string,
  warn?: string,
}

type State = {
  [string]: Field,
}

export type Context = {
  +fields: State,
  +setField: string => any => void,
  +submit: () => void,
  +reset: () => void,
}

// ===========================
// Context
// ===========================

export const FormContext = React.createContext<Context>(
  ({
    fields: {},
    setField: () => () => {},
    submit: () => {},
    reset: () => {},
  }: Context)
)

// ===========================
// Form Component
// ===========================
const Form = ({ children, onSubmit = () => {} }: Props) => {
  const [state, setState] = React.useState<State>({})
  const setField = (key: string) => (value: any) => {
    setState((s: State): State => ({ ...s, [key]: { value } }))
  }
  const reset = () => setState({})
  const submit = () =>
    onSubmit(
      Object.keys(state).reduce(
        (acc, key) => ({
          ...acc,
          [key]: state[key].value,
        }),
        {}
      )
    )
  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    submit()
  }
  const context = { fields: state, setField, submit, reset }

  return (
    <FormContext.Provider value={context}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  )
}

export default Form
