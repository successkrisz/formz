import React from 'react'
import { FormContext, Validator } from './Form'

export interface UseFormHook {
  value: any // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: string
  setField: (value: any) => void // eslint-disable-line @typescript-eslint/no-explicit-any
  isValid: boolean
  submit: () => void
  reset: () => void
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useForm = (name: string, defaultValue: any = '', validate?: Validator): UseFormHook => {
  const { fields, isValid, setField, submit, reset } = React.useContext(FormContext)
  const value = fields[name] && fields[name].value
  const error = fields[name] && fields[name].error
  const isFirstRender = typeof value === 'undefined'

  React.useEffect(
    (): void => {
      if (isFirstRender) {
        setField(name, validate)(defaultValue)
      }
    }
  )
  return {
    value: isFirstRender ? defaultValue : value,
    error: isFirstRender ? null : error,
    setField: setField(name, validate),
    isValid,
    submit,
    reset,
  }
}

export default useForm
