# formz

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![npm version](http://img.shields.io/npm/v/%40ballatech%2Fformz.svg?style=flat)](https://npmjs.org/package/%40ballatech%2Fformz "View this project on npm") [![Build Status](https://travis-ci.org/successkrisz/formz.svg?branch=master)](https://travis-ci.org/successkrisz/formz) [![Coverage Status](https://coveralls.io/repos/github/successkrisz/formz/badge.svg?branch=master)](https://coveralls.io/github/successkrisz/formz?branch=master)

React Form library to provide html like experience when building forms without having to worry about state

## Install

Install package using yarn

    yarn add @ballatech/formz

## Usage

    import { Form, useForm, FormContext } from '@ballatech/formz'

    const Component = () => {
      const { value, setField } = useForm('username', '')

      return (
        <input
          name="username"
          onChange={e => setField(e.target.value)}
          value={value}
        />
      )
    }

    const Reset = () => {
      const { reset } = React.useContext(FormContext)

      return <button onClick={reset}>Reset</button>
    }

    const MyCoolForm = ({ onSubmit }) => (
      <Form onSubmit={onSubmit}>
        <Component />
        <button type="submit">Submit</button>
        <Reset />
      </Form>
     )

     export default MyCoolForm
