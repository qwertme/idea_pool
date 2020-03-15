import React from "react"
import TextField from "@material-ui/core/TextField/TextField"
import Button from "@material-ui/core/Button/Button"
import FormControl from "@material-ui/core/FormControl/FormControl"
import Typography from '@material-ui/core/Typography'

export default class Login extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      ideasApi: props.ideasApi,
      email: '',
      password: ''
    }

    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleEmail(event) {
    this.setState({ email: event.target.value })
  }

  handlePassword(event) {
    this.setState({ password: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()

    this.state.ideasApi.login(this.state.email, this.state.password)
  }

  render () {
    return (
      <div>
        <Typography variant="h3">Login</Typography>
        <form onSubmit={this.handleSubmit}>
          <FormControl component="fieldset">
            <TextField type="email" onChange={this.handleEmail} placeholder="Email" required/>
            <TextField type="password" onChange={this.handlePassword} placeholder="Password" required/>
            <Button type="submit">Login</Button>
            <Typography>Don't have an account? <a href='#' onClick={this.props.switchView}>Create an account</a></Typography>
          </FormControl>
        </form>
      </div>
    )
  }
}
