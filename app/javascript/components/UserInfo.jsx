import React from "react"
import Avatar from "@material-ui/core/Avatar"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"

class UserInfo extends React.Component {

  constructor(props) {
    super(props)
    this.ideasApi = props.ideasApi

    this.state = {
      isUserInfoLoaded: this.ideasApi.isUserInfoLoaded()
    }

    this.userInfoListener = () => { this.setState({ isUserInfoLoaded: this.ideasApi.isUserInfoLoaded() }) }
  }

  componentDidMount() {
    this.ideasApi.on('userInfo', this.userInfoListener)
    this.setState({ isUserInfoLoaded: this.ideasApi.isUserInfoLoaded() })
  }

  componentWillUnmount() {
    this.ideasApi.off('userInfo', this.userInfoListener)
  }

  render () {
    if(this.state.isUserInfoLoaded) {
      return (
        <React.Fragment>
          <Grid container justify="center" alignItems="center">
            <Avatar src={this.ideasApi.userInfo.avatar_url}/>
          </Grid>
          <Grid container justify="center" alignItems="center">
            <Typography>{this.ideasApi.userInfo.name}</Typography>
          </Grid>
          <Grid container justify="center" alignItems="center">
            <Typography><a href="#" onClick={this.ideasApi.logout}>Logout</a></Typography>
          </Grid>
        </React.Fragment>
      )
    } else {
      return (<React.Fragment/>)
    }
  }
}

export default UserInfo
