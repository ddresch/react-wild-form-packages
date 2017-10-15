import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'

class NotFoundPage extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <Paper style={{ padding: '1em' }}>
        <h1>This URL is not valid.</h1>
        <RaisedButton label="Contact Administrator" primary />
      </Paper>
    )
  }
}

export default NotFoundPage
