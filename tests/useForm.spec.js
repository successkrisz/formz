import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'

import { Form, useForm, FormContext } from '../src'

const SampleInputComponent = ({ name, validate }) => {
  const { value, setField } = useForm(name, '', validate)

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

    const { value, isValid, setField, submit, reset } = values

    expect(value).toEqual('')
    expect(isValid).toEqual(true)
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
    expect(context.fields.foo.value).toEqual('')
    expect(context.fields.baz.value).toEqual('')

    act(() => {
      inputFoo.simulate('change', { target: { value: 'bar' } })
    })
    wrapper.update()

    expect(context.fields.foo.value).toEqual('bar')
    expect(context.fields.baz.value).toEqual('')
    expect(wrapper.find('.foo').prop('value')).toEqual('bar')
    expect(wrapper.find('.baz').prop('value')).toEqual('')
  })

  test('should support validation on the field', () => {
    const validators = {
      minLength: value => (value.length < 10 ? 'too short' : null),
    }
    const validatorSpy = jest.spyOn(validators, 'minLength')

    const wrapper = mount(
      <Form>
        <SampleInputComponent name="foo" validate={validators.minLength} />
        <ContextChecker />
      </Form>
    )
    const inputFoo = wrapper.find('.foo')
    expect(context.fields.foo.value).toEqual('')
    expect(context.fields.foo.error).toEqual('too short')
    expect(context.isValid).toEqual(false)
    expect(validatorSpy).toHaveBeenCalledWith('', { foo: '' })

    act(() => {
      inputFoo.simulate('change', { target: { value: 'short' } })
    })
    wrapper.update()

    expect(context.fields.foo.value).toEqual('short')
    expect(context.fields.foo.error).toEqual('too short')
    expect(validatorSpy).toHaveBeenCalledWith('short', { foo: 'short' })

    act(() => {
      inputFoo.simulate('change', { target: { value: 'longEnoughValue' } })
    })
    wrapper.update()

    expect(context.fields.foo.value).toEqual('longEnoughValue')
    expect(context.fields.foo.error).toEqual(null)
    expect(validatorSpy).toHaveBeenCalledWith('longEnoughValue', { foo: 'longEnoughValue' })
    expect(context.isValid).toEqual(true)
  })
})
