import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

class RatingCell extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value
    }

    this.onChange = props.onChange
  }

  handleValueChange(event) {
    this.setState({ value: event.target.value })
    this.onChange(event)
  }

  render() {
    return (
      <TableCell>
        <Select
          inputProps={{name: 'value'}}
          onChange={this.handleValueChange.bind(this)}
          value={this.state.value}>
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
          <MenuItem value={8}>8</MenuItem>
          <MenuItem value={9}>9</MenuItem>
          <MenuItem value={10}>10</MenuItem>
        </Select>
      </TableCell>
    )
  }
}

export default RatingCell
