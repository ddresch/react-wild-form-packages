import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import FlatButton from 'material-ui/FlatButton'
import { browserHistory } from 'react-router'

class HomePage extends Component {

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <Paper style={{ padding: '1em' }}>
        <h4>react-simpl-form</h4>
        <p>Check out some of the basic examples which show the basic usage of react-simpl-form package.</p>
        <FlatButton
          label="Contact Form Example"
          primary
          onClick={() => browserHistory.push('/contact')}
        />
      </Paper>
    )
  }
}

export default HomePage
