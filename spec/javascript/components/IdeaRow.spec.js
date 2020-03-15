import React from 'react'
import { create, act } from 'react-test-renderer'

import IdeasApi from '../../../app/javascript/packs/ideas_api'
import IdeaRow from '../../../app/javascript/components/IdeaRow'
import ShowIdeaRow from '../../../app/javascript/components/ShowIdeaRow'
import EditIdeaRow from '../../../app/javascript/components/EditIdeaRow'

jest.mock('../../../app/javascript/packs/ideas_api')

describe('IdeaRow', ()=> {
  let idea
  let ideasApi
  let closeCallback

  beforeEach(() => {
    idea = { id: 1, content: 'some content', impact: 2, ease: 3, confidence: 4, average_score: 5 }
    ideasApi = new IdeasApi()
    ideasApi.createIdea = jest.fn()
    ideasApi.updateIdea = jest.fn()
    ideasApi.deleteIdea = jest.fn()

    closeCallback = jest.fn()
  })

  test('not editable', () => {
    const component = create(<IdeaRow idea={idea} ideasApi={ideasApi} closeCallback={closeCallback}/>)
    const showIdeaRow = component.root.findByType(ShowIdeaRow)

    act(() => {
      showIdeaRow.props.editCallback(idea)
    })

    expect(component.root.findByType(EditIdeaRow)).toBeDefined()
    expect(closeCallback.mock.calls.length).toEqual(0)
  })

  test('editable', () => {
    const component = create(<IdeaRow idea={idea} ideasApi={ideasApi} closeCallback={closeCallback}/>)
    const showIdeaRow = component.root.findByType(ShowIdeaRow)

    act(() => {
      showIdeaRow.props.editCallback(idea)
    })

    const editIdeaRow = component.root.findByType(EditIdeaRow)

    const newIdea = {
      id: 1, content: 'some other content', impact: 5, ease: 6, confidence: 7, average_score: 5
    }

    act(() => {
      editIdeaRow.props.saveCallback(newIdea)
    })

    expect(component.root.findByType(ShowIdeaRow)).toBeDefined()
    expect(ideasApi.updateIdea.mock.calls.length).toEqual(1)
    expect(ideasApi.updateIdea.mock.calls[0][0]).toEqual(newIdea)
    expect(component.root.instance.state.idea).toEqual(newIdea)
    expect(closeCallback.mock.calls.length).toEqual(0)
  })

  test('new idea', () => {
    idea = { content: 'some content', impact: 2, ease: 3, confidence: 4, average_score: 5 }
    const component = create(<IdeaRow idea={idea} ideasApi={ideasApi} closeCallback={closeCallback}/>)
    const editIdeaRow = component.root.findByType(EditIdeaRow)

    act(() => {
      editIdeaRow.props.saveCallback(idea)
    })

    expect(ideasApi.createIdea.mock.calls.length).toEqual(1)
    expect(ideasApi.createIdea.mock.calls[0][0]).toEqual(idea)
    expect(closeCallback.mock.calls.length).toEqual(1)
  })

  test('delete', () => {
    const component = create(<IdeaRow idea={idea} ideasApi={ideasApi} closeCallback={closeCallback}/>)
    const showIdeaRow = component.root.findByType(ShowIdeaRow)

    act(() => {
      showIdeaRow.props.deleteCallback(idea)
    })

    expect(ideasApi.deleteIdea.mock.calls.length).toEqual(1)
    expect(ideasApi.deleteIdea.mock.calls[0][0]).toEqual({ id: idea.id })
    expect(closeCallback.mock.calls.length).toEqual(1)
  })
})