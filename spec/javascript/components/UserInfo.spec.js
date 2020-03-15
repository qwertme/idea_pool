import React from 'react'
import { create } from 'react-test-renderer'

import Avatar from "@material-ui/core/Avatar"

import IdeasApi from '../../../app/javascript/packs/ideas_api'
import UserInfo from '../../../app/javascript/components/UserInfo'

jest.mock('../../../app/javascript/packs/ideas_api')

describe('UserInfo', ()=> {
  let ideasApi;
  beforeEach(() => {
    ideasApi = new IdeasApi()
  })

  test('renders empty when user is not loaded', () => {
    ideasApi.isUserInfoLoaded.mockReturnValue(false)
    const component = create(<UserInfo ideasApi={ideasApi}/>)

    expect(component.root.children.length).toEqual(0)
  })

  test('renders user with avatar', () => {
    ideasApi.isUserInfoLoaded.mockReturnValue(true)
    ideasApi.userInfo = { avatar_url: 'http://somesrc', name: 'Eric' }

    const component = create(<UserInfo ideasApi={ideasApi}/>)
    const avatar = component.root.findByType(Avatar)

    expect(avatar.props.src).toEqual('http://somesrc')
    expect(component.root.find((el) => el.children && el.children[0] == 'Eric')).toBeDefined()
  })
})