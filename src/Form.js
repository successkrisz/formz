// @flow
import * as React from 'react'

// ===========================
// Flow Types
// ===========================
export type Props = {
  +children: React.Node,
  +onSubmit?: ({ [string]: any }) => void,
}

type Field = {|
  value: string,
  error: ?string,
  warn?: string,
|}

type State = {
  [string]: Field,
}

export type Validator = (value: any, fields: { [string]: any }) => string | null | void

export type Context = {|
  +fields: State,
  +isValid: boolean,
  +setField: (name: string, validate?: Validator) => any => void,
  +submit: () => void,
  +reset: () => void,
|}

// ===========================
// Context
// ===========================

export const FormContext = React.createContext<Context>(
  ({
    fields: {},
    isValid: true,
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
  const isValid = Object.keys(state)
    .map(field => state[field].error)
    .every(error => !error)
  const setField = (key: string, validate?: Validator) => (value: any) => {
    setState(
      (s: State): State => ({
        ...s,
        [key]: {
          value,
          validate,
          error:
            typeof validate === 'function'
              ? validate(value, {
                  ...Object.keys(s).reduce(
                    (acc, fieldName) => ({
                      ...acc,
                      [fieldName]: s[fieldName].value,
                    }),
                    {}
                  ),
                  [key]: value,
                })
              : null,
        },
      })
    )
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
  const context = { fields: state, isValid, setField, submit, reset }

  return (
    <FormContext.Provider value={context}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  )
}

export default Form
