import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'

import { Form, useForm, FormContext } from '../src'

const SampleInputComponent = ({ name }) => {
  const { value, setField } = useForm(name, '')

  return <input onChange={e => setField(e.target.value)} value={value} className={name} />
}

describe('useForm', () => {
  let context
  const ContextChecker = () => (
    <FormContext.Consumer>
      {value => {
        context = value
        return null
      }}
    </FormContext.Consumer>
  )

  afterEach(() => {
    context = undefined
  })

  test('should provide submit', () => {
    let values = {}
    const Component = () => {
      values = useForm('foo')
      return null
    }

    mount(<Component />)

    const { value, setField, submit, reset } = values

    expect(value).toEqual('')
    expect(typeof setField).toEqual('function')
    expect(typeof submit).toEqual('function')
    expect(typeof reset).toEqual('function')
  })

  test('should provide value and setField to update the form state', () => {
    const wrapper = mount(
      <Form>
        <SampleInputComponent name="foo" />
        <SampleInputComponent name="baz" />
        <ContextChecker />
      </Form>
    )
    const inputFoo = wrapper.find('.foo')
    expect(context.fields).toEqual({ foo: { value: '' }, baz: { value: '' } })

    act(() => {
      inputFoo.simulate('change', { target: { value: 'bar' } })
    })
    wrapper.update()

    expect(context.fields).toEqual({ foo: { value: 'bar' }, baz: { value: '' } })
    expect(wrapper.find('.foo').prop('value')).toEqual('bar')
    expect(wrapper.find('.baz').prop('value')).toEqual('')
  })
})
