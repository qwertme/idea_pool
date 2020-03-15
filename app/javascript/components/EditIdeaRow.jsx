import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField/TextField'
import IconButton from '@material-ui/core/IconButton'
import CheckIcon from '@material-ui/icons/CheckSharp'
import ClearIcon from '@material-ui/icons/ClearSharp'

import RatingCell from "./RatingCell"

class EditIdeaRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      idea: props.idea
    }

    this.saveCallback = props.saveCallback
    this.closeCallback = props.closeCallback
    this.handleSave = this.handleSave.bind(this)
    this.updateIdea = this.updateIdea.bind(this)
  }

  handleSave() {
    this.saveCallback(this.state.idea)
    this.closeCallback()
  }

  updateIdea(prop, value) {
    const idea = this.state.idea
    idea[prop] = value
    this.setState( { idea: idea } )
  }

  render() {
    return(
      <TableRow>
        <TableCell>
          <TextField value={this.state.idea.content} onChange={event => { this.updateIdea('content', event.target.value) }} />
        </TableCell>
        <RatingCell value={this.state.idea.impact} onChange={event => { this.updateIdea('impact', event.target.value) }}/>
        <RatingCell value={this.state.idea.ease} onChange={event => { this.updateIdea('ease', event.target.value) }}/>
        <RatingCell value={this.state.idea.confidence} onChange={event => { this.updateIdea('confidence', event.target.value) }}/>
        <TableCell></TableCell>
        <TableCell>
          <IconButton color='primary' onClick={this.handleSave}>
            <CheckIcon/>
          </IconButton>
          <IconButton onClick={this.closeCallback}>
            <ClearIcon/>
          </IconButton>
        </TableCell>
      </TableRow>)
  }
}

export default EditIdeaRow
