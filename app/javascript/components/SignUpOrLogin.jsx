import React from "react"

import SignUp from "./SignUp"
import Login from "./Login"

export default class SignUpOrLogin extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showLogin: false
    }
    this.ideasApi = props.ideasApi
    this.switchToLogin = this.switchToLogin.bind(this)
    this.switchToSignUp = this.switchToSignUp.bind(this)
  }

  switchToLogin() {
    this.setState({ showLogin: true })
  }

  switchToSignUp() {
    this.setState({ showLogin: false })
  }

  render () {
    if(this.state.showLogin) {
      return (<Login ideasApi={this.props.ideasApi} switchView={this.switchToSignUp}/>)
    } else {
      return (<SignUp ideasApi={this.props.ideasApi} switchView={this.switchToLogin}/>)
    }
  }
}

