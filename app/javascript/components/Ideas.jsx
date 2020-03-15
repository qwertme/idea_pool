import React from 'react'

import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import AddIcon from '@material-ui/icons/Add'
import Fab from '@material-ui/core/Fab'

import Button from '@material-ui/core/Button'

import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"

import IdeaRow from "./IdeaRow";

class Ideas extends React.Component {

  constructor(props) {
    super(props)
    this.ideasApi = props.ideasApi

    this.state = {
      showNewIdea: false,
      ideas: []
    }

    const findIdeaById = (id) => {
      return this.state.ideas.findIndex((i) => i.id == id)
    }

    this.ideaAddedListener =  (idea) => {
      let ideas = this.state.ideas
      if(findIdeaById(idea.id) < 0 ) { ideas.push(idea) }
      this.setState( { ideas: ideas} )
    }

    this.ideaRemovedListener = (idea) => {
      let ideas = this.state.ideas
      ideas.splice(findIdeaById(idea.id), 1)
      this.setState( { ideas: ideas } )
    }

    this.ideaUpdatedListener = (idea) => {
      this.ideaRemovedListener(idea)
      this.ideaAddedListener(idea)
    }

    this.handleAddIdea = this.handleAddIdea.bind(this)
    this.handleLoadMore = this.handleLoadMore.bind(this)
  }

  componentDidMount() {
    this.ideasApi.on('ideaAdded', this.ideaAddedListener)
    this.ideasApi.on('ideaRemoved', this.ideaRemovedListener)
    this.ideasApi.on('ideaUpdated', this.ideaUpdatedListener)
    this.ideasApi.fetchIdeas()
  }

  componentWillUnmount() {
    this.ideasApi.off('ideaAdded', this.ideaAddedListener)
    this.ideasApi.off('ideaRemoved', this.ideaRemovedListener)
    this.ideasApi.off('ideaUpdated', this.ideaUpdatedListener)
  }

  shouldDisplayLoadMore() {
    return this.state.ideas.length > 0 && (this.state.ideas.length % 10) == 0
  }

  handleAddIdea() {
    this.setState({ showNewIdea: !this.state.showNewIdea })
  }

  handleLoadMore() {
    const nextPage = Math.floor(this.state.ideas.length / 10) + 1
    this.ideasApi.fetchIdeas(nextPage)
  }

  render () {
    const rows = []

    if(this.state.showNewIdea) {
      const newIdea = { content: '', impact: 10, ease: 10, confidence: 10}
      rows.push(<IdeaRow key='new-idea' idea={newIdea} ideasApi={this.ideasApi} closeCallback={this.handleAddIdea} />)
    }

    let ideas = this.state.ideas
    ideas = ideas.sort((a,b) => b.average_score - a.average_score)
    ideas.map(idea => {
      rows.push(<IdeaRow key={idea.id} idea={idea} ideasApi={this.ideasApi} closeCallback={() => {}}/>)
    })

    return (
      <Grid container justify="center" alignItems="center">
        <Typography variant="h3">Ideas</Typography>
        <Grid container justify="flex-end" alignItems="flex-end">
          <Fab color="primary" aria-label="Add" onClick={this.handleAddIdea}>
            <AddIcon/>
          </Fab>
        </Grid>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Impact</TableCell>
                <TableCell>Ease</TableCell>
                <TableCell>Confidence</TableCell>
                <TableCell>Average</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows}
            </TableBody>
          </Table>
          {this.shouldDisplayLoadMore() ? <Button onClick={this.handleLoadMore}>Load more...</Button> : <div></div>}
        </Paper>
      </Grid>
    )
  }
}

export default Ideas
