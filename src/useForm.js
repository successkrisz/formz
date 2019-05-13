// @flow
import React from 'react'
import { FormContext } from './Form'

const useForm = (name: string, defaultValue: any = '') => {
  const { fields, setField, submit, reset } = React.useContext(FormContext)
  const value = fields[name] && fields[name].value
  const isFirstRender = typeof value === 'undefined'

  React.useEffect(() => {
    if (isFirstRender) {
      setField(name)(defaultValue)
    }
  })
  return {
    value: isFirstRender ? defaultValue : value,
    setField: setField(name),
    submit,
    reset,
  }
}

export default useForm
