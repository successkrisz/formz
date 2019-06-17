import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount, shallow } from 'enzyme'

import { Form } from '../src'
import { FormContext } from '../src/Form'

describe('Form', () => {
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

  test('should render it\'s children', () => {
    const wrapper = shallow(
      <Form>
        <div>foo</div>
      </Form>
    )
    expect(wrapper.contains(<div>foo</div>)).toEqual(true)
  })

  test('should expose the values on the context', () => {
    mount(
      <Form>
        <ContextChecker />
      </Form>
    )
    expect(context.fields).toEqual({})
  })

  test('should expose the isValid on the context', () => {
    mount(
      <Form>
        <ContextChecker />
      </Form>
    )
    expect(context.isValid).toEqual(true)
  })

  test('should expose setField() on the context', () => {
    mount(
      <Form>
        <ContextChecker />
      </Form>
    )

    expect(typeof context.setField).toEqual('function')

    act(() => {
      context.setField('foo')('bar')
    })

    expect(context.fields.foo.value).toEqual('bar')

    act(() => {
      context.setField('foo')('baz')
    })

    expect(context.fields.foo.value).toEqual('baz')
  })

  test('should expose submit() on the context', () => {
    mount(
      <Form>
        <ContextChecker />
      </Form>
    )
    expect(typeof context.submit).toEqual('function')
  })

  test('should call props.onSubmit with the form values when submit is called', () => {
    const onSubmit = jest.fn()
    mount(
      <Form onSubmit={onSubmit}>
        <ContextChecker />
      </Form>
    )
    act(() => {
      context.setField('foo')('bar')
    })
    context.submit()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({ foo: 'bar' })
  })

  test('should call props.onSubmit with the form values when form is submitted', () => {
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Form onSubmit={onSubmit}>
        <ContextChecker />
      </Form>
    )
    act(() => {
      context.setField('foo')('bar')
    })

    wrapper.find('form').simulate('submit')

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({ foo: 'bar' })
  })

  test('should provide reset() on the context', () => {
    mount(
      <Form>
        <ContextChecker />
      </Form>
    )
    expect(typeof context.reset).toEqual('function')

    act(() => {
      context.setField('foo')('bar')
    })

    expect(context.fields.foo.value).toEqual('bar')

    act(() => {
      context.reset()
    })

    expect(context.fields).toEqual({})
  })
})
