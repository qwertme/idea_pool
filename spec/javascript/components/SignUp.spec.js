import React from 'react'
import { create, act } from 'react-test-renderer'

import IdeasApi from '../../../app/javascript/packs/ideas_api'
import SignUp from '../../../app/javascript/components/SignUp'

jest.mock('../../../app/javascript/packs/ideas_api')

describe('SignUp', ()=> {
  let ideasApi;
  let switchView;
  let component;

  beforeEach(() => {
    ideasApi = new IdeasApi()
    switchView = jest.fn()
    component = create(<SignUp ideasApi={ideasApi} switchView={switchView}/>)
  })

  test('switches view', () => {
    const a = component.root.findByType('a')
    act(() => { a.props.onClick() } )

    expect(switchView.mock.calls.length).toBe(1)
  })

  test('login', () => {
    const form = component.root.findByType('form')
    ideasApi.signUp = jest.fn()
    const event = { preventDefault: () => {} };

    act(() => { form.props.onSubmit(event) } )

    expect(ideasApi.signUp.mock.calls.length).toBe(1)
  })
})