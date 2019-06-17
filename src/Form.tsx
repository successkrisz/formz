import React from 'react'

// ===========================
// Types
// ===========================
export interface Props {
  children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (values: { [fieldName: string]: any }) => void
}

interface Field {
  value: string
  validate?: Validator
  error?: string
  warn?: string
}

interface State {
  [fieldName: string]: Field
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Validator = (value: any, fields: { [fieldName: string]: any }) => string | null

export interface Context {
  fields: State
  isValid: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
