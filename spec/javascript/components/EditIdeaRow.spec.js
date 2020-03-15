import React from 'react'
import { create, act } from 'react-test-renderer'
import TextField from '@material-ui/core/TextField/TextField'
import IconButton from "@material-ui/core/IconButton";

import EditIdeaRow from '../../../app/javascript/components/EditIdeaRow'
import RatingCell from "../../../app/javascript/components/RatingCell"

describe('EditIdeaRow', ()=> {
  let closeCallback;
  let saveCallback;
  let component;
  let idea = { id: 1, content: 'some content', impact: 2, ease: 3, confidence: 4, average_score: 5 }

  beforeEach(() => {
    closeCallback = jest.fn()
    saveCallback = jest.fn()

    component = create(<EditIdeaRow idea={idea} saveCallback={saveCallback} closeCallback={closeCallback}/>)
  })

  test('set content', () => {
    const textField = component.root.findByType(TextField)

    const event = { target: { value: 'some value' } }
    act(() => {
      textField.props.onChange(event)
    })

    expect(textField.props.value).toEqual('some value')
  })

  test('save new content', () => {
    const ratingCells = component.root.findAllByType(RatingCell)

    ratingCells.map((ratingCell) => {
      const event = { target: { value: 5 } }
      ratingCell.props.onChange(event)
    })

    const textField = component.root.findByType(TextField)

    const event = { target: { value: 'changed content' } }
    act(() => {
      textField.props.onChange(event)
    })

    const submit = component.root.findAllByType(IconButton).find((c) => c.props.color == 'primary')

    act(() => {
      submit.props.onClick()
    })

    expect(saveCallback.mock.calls.length).toEqual(1)
    expect(closeCallback.mock.calls.length).toEqual(1)
    idea.content = 'changed content'
    expect(saveCallback.mock.calls[0][0]).toEqual(idea)
  })
})