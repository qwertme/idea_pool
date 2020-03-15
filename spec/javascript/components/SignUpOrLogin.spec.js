import React from 'react'
import { create, act } from 'react-test-renderer'

import IdeasApi from '../../../app/javascript/packs/ideas_api'
import Login from '../../../app/javascript/components/Login'
import SignUp from "../../../app/javascript/components/SignUp";
import SignUpOrLogin from "../../../app/javascript/components/SignUpOrLogin";

jest.mock('../../../app/javascript/packs/ideas_api')

describe('SignUpOrLogin', ()=> {
  let ideasApi;
  let component;

  beforeEach(() => {
    ideasApi = new IdeasApi()
    component = create(<SignUpOrLogin ideasApi={ideasApi}/>)
  })

  test('show login', () => {
    act(() => { component.getInstance().switchToLogin() } )

    expect(component.root.findByType(Login)).toBeDefined()
  })

  test('show sign up', () => {
    expect(component.root.findByType(SignUp)).toBeDefined()
  })
})