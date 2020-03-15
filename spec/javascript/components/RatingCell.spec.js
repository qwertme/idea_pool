import React from 'react'
import { create, act } from 'react-test-renderer'
import Select from '@material-ui/core/Select'

import RatingCell from '../../../app/javascript/components/RatingCell'

describe('RatingCell', ()=> {
  test('switches view', () => {
    const onChange = jest.fn()
    const component = create(<RatingCell value={1} onChange={onChange}/>)

    const select = component.root.findByType(Select)

    const event = { target: { value: 5 } }
    act(() => {
      select.props.onChange(event)
    })

    expect(select.props.value).toEqual(5)
    expect(onChange.mock.calls.length).toEqual(1)
  })
})