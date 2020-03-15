import React from 'react'

import ShowIdeaRow from "./ShowIdeaRow";
import EditIdeaRow from "./EditIdeaRow";

class IdeaRow extends React.Component {
  constructor(props) {
    super(props)
    const editable = typeof(props.idea.id) === 'undefined'

    this.state = {
      idea: props.idea,
      editable: editable
    }

    this.ideasApi = props.ideasApi

    this.closeCallback = props.closeCallback
    this.toggleEdit = this.toggleEdit.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.saveIdea = this.saveIdea.bind(this)
  }

  toggleEdit() {
    this.setState({ editable: !this.state.editable })
  }

  saveIdea(idea) {
    if(typeof(idea.id) === 'undefined') {
      this.ideasApi.createIdea(idea)
      this.closeCallback()
    } else {
      this.ideasApi.updateIdea(idea)
    }
  }

  handleSave(idea) {
    const state = this.state
    state.idea = idea
    this.setState(state)

    this.saveIdea(idea)
    this.toggleEdit()
  }

  handleDelete(idea) {
    this.ideasApi.deleteIdea({ id: idea.id })
    this.closeCallback()
  }

  editableRow() {
    return(<EditIdeaRow idea={this.state.idea} saveCallback={this.handleSave} closeCallback={this.toggleEdit}/>)
  }

  staticRow() {
    return(
      <ShowIdeaRow idea={this.state.idea} editCallback={this.toggleEdit} deleteCallback={this.handleDelete} />
    )
  }

  render() {
    if(this.state.editable) {
      return this.editableRow()
    } else {
      return this.staticRow()
    }
  }
}

export default IdeaRow
