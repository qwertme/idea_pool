import React from 'react'
import { create, act } from 'react-test-renderer'

import IdeasApi from '../../../app/javascript/packs/ideas_api'
import Login from '../../../app/javascript/components/Login'

jest.mock('../../../app/javascript/packs/ideas_api')

describe('Login', ()=> {
  let ideasApi;
  let switchView;
  let component;

  beforeEach(() => {
    ideasApi = new IdeasApi()
    switchView = jest.fn()
    component = create(<Login ideasApi={ideasApi} switchView={switchView}/>)
  })

  test('switches view', () => {
    const a = component.root.findByType('a')
    act(() => { a.props.onClick() } )

    expect(switchView.mock.calls.length).toBe(1)
  })

  test('login', () => {
    const form = component.root.findByType('form')
    ideasApi.login = jest.fn()
    const event = { preventDefault: () => {} };

    act(() => { form.props.onSubmit(event) } )

    expect(ideasApi.login.mock.calls.length).toBe(1)
  })
})