import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/EditSharp";
import DeleteIcon from "@material-ui/icons/DeleteSharp";
import React from "react";

class ShowIdeaRow extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      idea: props.idea
    }

    this.editCallback = props.editCallback
    this.deleteCallback = props.deleteCallback
    this.handleEdit = this.handleEdit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleEdit() {
    this.editCallback(this.state.idea)
  }

  handleDelete() {
    this.deleteCallback(this.state.idea)
  }

  render() {
    return(
      <TableRow key={this.state.idea.id}>
        <TableCell>{this.state.idea.content}</TableCell>
        <TableCell>{this.state.idea.impact}</TableCell>
        <TableCell>{this.state.idea.ease}</TableCell>
        <TableCell>{this.state.idea.confidence}</TableCell>
        <TableCell>{this.state.idea.average_score}</TableCell>
        <TableCell>
          <IconButton color='primary' onClick={this.handleEdit}>
            <EditIcon/>
          </IconButton>
          <IconButton onClick={this.handleDelete}>
            <DeleteIcon/>
          </IconButton>
        </TableCell>
      </TableRow>
    )
  }
}

export default ShowIdeaRow
