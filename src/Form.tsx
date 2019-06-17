import React from 'react'

// ===========================
// Types
// ===========================
export type Props = {
  children: React.ReactNode
  onSubmit?: (values: { [fieldName: string]: any }) => void
}

type Field = {
  value: string
  validate?: Validator
  error?: string
  warn?: string
}

type State = {
  [fieldName: string]: Field
}

export type Validator = (value: any, fields: { [fieldName: string]: any }) => string | null

export type Context = {
  fields: State
  isValid: boolean
  setField: (name: string, validate?: Validator) => (value: any) => void
  submit: () => void
  reset: () => void
}

// ===========================
// Context
// ===========================

export const FormContext = React.createContext<Context>({
  fields: {},
  isValid: true,
  setField: () => () => {},
  submit: () => {},
  reset: () => {},
})

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
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
