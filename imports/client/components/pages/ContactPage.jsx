import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import AutoForm from 'react-simpl-form'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

const subSchema = new SimpleSchema({
  question: {
    type: String,
    label: 'Question'
  },
  description: {
    type: String,
    label: 'Description'
  }
})

const contactSchema = new SimpleSchema({
  firstName: {
    type: String,
    label: 'First Name'
  },
  lastName: {
    type: String,
    label: 'Last Name'
  },
  details: {
    type: subSchema,
    label: 'Details'
  }
})

class ContactPage extends Component {

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    return (
      <Paper style={{ padding: '1em' }}>
        <h1>Contact</h1>
        <AutoForm
          schema={contactSchema}
          submit={(doc) => { console.log(doc) }}
        />
      </Paper>
    )
  }
}

export default ContactPage
