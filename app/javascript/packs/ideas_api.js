import fetch from 'isomorphic-fetch'
import EventEmitter from 'events'

export default class IdeasApi {
  constructor(options) {
    this.rootUrl = options.rootUrl
    this.accessToken = null
    this.refreshToken = null
    this.userInfo = null

    this.events = new EventEmitter()

    this.on = this.events.on.bind(this.events)
    this.off = this.events.removeListener.bind(this.events)
    this.fetchUserInfo = this.fetchUserInfo.bind(this)
    this.logout = this.logout.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  reset() {
    this.accessToken = null
    this.refreshToken = null
    this.userInfo = null
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')
    this.events.emit('authentication')
  }

  handleError(error) {
    console.log(error)
    this.reset()
  }

  headers() {
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    if(this.isAuthenticated()) {
      headers['x-access-token'] = this.accessToken
    }
    return headers
  }

  checkResonse(response) {
    if(!response.ok) { throw Error(response.statusText) }
    return response
  }

  fetchUserInfo() {
    return fetch(this.rootUrl + '/me', {
      headers: this.headers()
    }).then(this.checkResonse).then(response => response.json()).
    then(json => {
      this.userInfo = json
      this.events.emit('userInfo')
    }).catch(this.handleError)
  }

  createIdea(idea) {
    return fetch(this.rootUrl + '/ideas', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(idea)
    }).then(this.checkResonse).then(response => response.json())
      .then(json => { this.events.emit('ideaAdded', json) })
      .catch(this.handleError)
  }

  updateIdea(idea) {
    return fetch(this.rootUrl + '/ideas/' + idea.id, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(idea)
    }).then(this.checkResonse).then(response => response.json())
      .then(json => { this.events.emit('ideaUpdated', json) })
      .catch(this.handleError)
  }

  deleteIdea(idea) {
    if(idea === undefined || idea.id === undefined) { return }
    return fetch(this.rootUrl + '/ideas/' + idea.id, {
      method: 'DELETE',
      headers: this.headers(),
      body: JSON.stringify({})
    }).then(this.checkResonse).then(() => { this.events.emit('ideaRemoved', idea) })
      .catch(this.handleError)
  }

  fetchIdeas(page = 1) {
    return fetch(this.rootUrl + '/ideas?page=' + page, {
      method: 'get',
      headers: this.headers()
    }).then(this.checkResonse).then(response => response.json())
      .then(json => {
        for(var i = 0; i < json.length; i++) {
          var idea = json[i]
          this.events.emit('ideaAdded', idea)
        }
      }).catch(this.handleError)
  }

  signUpOrLogin(path, json) {
    return fetch(this.rootUrl + path, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(json)
    }).then(this.checkResonse).then(response => response.json())
      .then(json => {
        this.accessToken = json['jwt']
        this.refreshToken = json['refresh_token']
        this.events.emit('authentication')
      }).then(this.fetchUserInfo)
      .catch(this.handleError)
  }

  signUp(name, email, password) {
    return this.signUpOrLogin('/users', {
      name: name,
      email: email,
      password: password
    })
  }

  deleteAccount() {
    return fetch(this.rootUrl + '/me', {
      method: 'DELETE',
      headers: this.headers(),
      body: JSON.stringify({})
    }).then(this.checkResonse)
  }

  login(email, password) {
    return this.signUpOrLogin('/access-tokens', {
      email: email,
      password: password
    })
  }

  logout() {
    let refreshToken = this.refreshToken

    this.accessToken = null
    this.refreshToken = null
    this.userInfo = null
    this.events.emit('userInfo')

    return fetch(this.rootUrl + '/access-tokens', {
      method: 'DELETE',
      headers: this.headers(),
      body: JSON.stringify({ refresh_token: refreshToken })
    }).then(() => { this.events.emit('authentication') })
  }

  isAuthenticated() {
    return this.accessToken !== null
  }

  isUserInfoLoaded() {
    return this.userInfo !== null
  }
}
