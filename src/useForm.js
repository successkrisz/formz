// @flow
import React from 'react'
import { FormContext } from './Form'
import type { Validator } from './Form'

const useForm = (name: string, defaultValue: any = '', validate?: Validator) => {
  const { fields, isValid, setField, submit, reset } = React.useContext(FormContext)
  const value = fields[name] && fields[name].value
  const error = fields[name] && fields[name].error
  const isFirstRender = typeof value === 'undefined'

  React.useEffect(() => {
    if (isFirstRender) {
      setField(name, validate)(defaultValue)
    }
  })
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
