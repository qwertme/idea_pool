import React from 'react'
import { create, act } from 'react-test-renderer'
import EventEmitter from 'events'

import IdeasApi from '../../../app/javascript/packs/ideas_api'
import Ideas from '../../../app/javascript/components/Ideas'
import IdeaRow from "../../../app/javascript/components/IdeaRow";
import {Fab} from "@material-ui/core";

describe('Ideas', ()=> {
  const idea = { id: 1, content: 'some content', impact: 2, ease: 3, confidence: 4, average_score: 5 }
  const events = new EventEmitter()
  let ideasApi;
  let component;

  beforeEach(() => {
    ideasApi = new IdeasApi({ rootUrl: '' })
    ideasApi.fetchIdeas = jest.fn()
    ideasApi.events = events

    component = create(<Ideas ideasApi={ideasApi}/>)
  })

  test('lists ideas', () => {
    expect(ideasApi.fetchIdeas.mock.calls.length).toEqual(1)

    events.emit('ideaAdded', idea)

    expect(component.root.findAllByType(IdeaRow).length).toEqual(1)
  })

  test('show new row', () => {
    const addButton = component.root.findByType(Fab)

    act(() => {
      addButton.props.onClick()
    })

    expect(component.root.findAllByType(IdeaRow).length).toEqual(1)
  })
})