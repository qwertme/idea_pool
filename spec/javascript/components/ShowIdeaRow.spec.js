import React from 'react'
import { create, act } from 'react-test-renderer'
import IconButton from "@material-ui/core/IconButton";

import ShowIdeaRow from '../../../app/javascript/components/ShowIdeaRow'

describe('ShowIdeaRow', ()=> {
  let editCallback;
  let deleteCallback;
  let component;
  let idea = { id: 1, content: 'some content', impact: 2, ease: 3, confidence: 4, average_score: 5 }

  beforeEach(() => {
    editCallback = jest.fn()
    deleteCallback = jest.fn()

    component = create(<ShowIdeaRow idea={idea} editCallback={editCallback} deleteCallback={deleteCallback}/>)
  })

  test('edit callback', () => {
    const edit = component.root.findAllByType(IconButton).find((c) => c.props.color == 'primary')

    act(() => {
      edit.props.onClick()
    })

    expect(editCallback.mock.calls.length).toEqual(1)
    expect(editCallback.mock.calls[0][0]).toEqual(idea)
  })

  test('delete callback', () => {
    const edit = component.root.findAllByType(IconButton).find((c) => c.props.color != 'primary')

    act(() => {
      edit.props.onClick()
    })

    expect(deleteCallback.mock.calls.length).toEqual(1)
    expect(deleteCallback.mock.calls[0][0]).toEqual(idea)
  })
})