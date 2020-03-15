import React, { Component } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from "@material-ui/core/Drawer"
import Avatar from "@material-ui/core/Avatar"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"

import { withStyles } from '@material-ui/core/styles'

import IdeasApi from "../packs/ideas_api"

import SignUpOrLogin from "./SignUpOrLogin"
import UserInfo from "./UserInfo"
import Ideas from "./Ideas"
import logo from 'images/logo.png'

const drawerWidth = 120

const styles = theme => ({
  content: {
    marginLeft: drawerWidth,
    'text-align': 'center'
  },
  drawerPaper: {
    width: drawerWidth,
    background: '#00A843'
  }
});

class App extends Component {
  constructor(props) {
    super(props)
    this.ideasApi = new IdeasApi({ rootUrl: window.location.origin })
    this.ideasApi.loadSession()

    this.authenticationListener = () => {
      this.setState({ loggedIn: this.ideasApi.isAuthenticated() })
      this.ideasApi.saveSession()
    }

    this.state = {
      loggedIn: this.ideasApi.isAuthenticated()
    }
  }

  componentDidMount() {
    this.ideasApi.on('authentication', this.authenticationListener)
  }

  componentWillUnmount() {
    this.ideasApi.off('authentication', this.authenticationListener)
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <CssBaseline />
        <nav className={classes.drawer}>
          <Drawer
            variant="persistent"
            anchor='left'
            open={true}
            classes={{ paper: classes.drawerPaper }}>
            <Grid container justify="center" alignItems="center">
              <Avatar align="center" src={logo}/>
              <Typography align="center">The Idea Pool</Typography>
            </Grid>
            { this.state.loggedIn ? <UserInfo ideasApi={this.ideasApi}/> : <div></div> }
          </Drawer>
        </nav>
        <main className={classes.content} >
          { this.state.loggedIn ? <Ideas ideasApi={this.ideasApi}/> : <SignUpOrLogin ideasApi={this.ideasApi} /> }
        </main>
      </div>
    )
  }
}

export default withStyles(styles)(App)
