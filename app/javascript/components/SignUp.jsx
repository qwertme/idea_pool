import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Typography from '@material-ui/core/Typography'

class SignUp extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      ideasApi: props.ideasApi,
      name: '',
      email: '',
      password: ''
    }

    this.handleName = this.handleName.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleName(event) {
    this.setState({ name: event.target.value })
  }

  handleEmail(event) {
    this.setState({ email: event.target.value })
  }

  handlePassword(event) {
    this.setState({ password: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()

    this.state.ideasApi.signUp(this.state.name, this.state.email, this.state.password)
  }

  render () {
    return (
      <div>
        <Typography variant="h3">Sign Up</Typography>
        <form onSubmit={this.handleSubmit}>
          <FormControl component="fieldset">
            <TextField id="name" type="text" onChange={this.handleName} placeholder="Name" required/>
            <TextField type="email" onChange={this.handleEmail} placeholder="Email" required/>
            <TextField type="password" onChange={this.handlePassword} placeholder="Password" required/>
            <Button type="submit">Sign Up</Button>
            <Typography>Already have an account? <a href='#' onClick={this.props.switchView}>Log in</a></Typography>
          </FormControl>
        </form>
      </div>
    )
  }
}

export default SignUp