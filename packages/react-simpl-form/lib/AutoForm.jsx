/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
// we added this rule as Meteor uses _id as collection key per default
import React, { Component } from 'react'
import Formsy from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText'
import FormsySelect from 'formsy-material-ui/lib/FormsySelect'
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper'
import IconButton from 'material-ui/IconButton'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'
import FormsyCheckbox from 'formsy-material-ui/lib/FormsyCheckbox'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import { browserHistory } from 'react-router'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

class AutoForm extends Component {

  constructor (props) {
    super(props)
    this.state = {
      canSubmit: false,
      doc: {},
      relationalDocs: {}
    }
    // use these inits or write
    // enableButton = () => { ... }
    // need to find a suitable linting rule / babel Setup
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.prepareDocToSubmit = this.prepareDocToSubmit.bind(this)
  }

  componentDidMount () {
    this.prepareRelatedDocsState()
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ doc: nextProps.doc })
    this.prepareRelatedDocsState()
  }

  componentWillUnmount () {
    // https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html
    // TODO find a way to get rid of the warning
    // Warning: setState(...): Can only update a mounted or mounting component.
  }

  getDocTextValue (key, subDoc) {
    const doc = subDoc || this.state.doc
    if (doc && key) {
      return doc[key]
    }
    return ''
  }

  getDocObjectValue (key, subDoc) {
    const doc = subDoc || this.state.doc
    if (doc && key) {
      return doc[key]
    }
    return {}
  }

  getDocBoolValue (key, subDoc) {
    const doc = subDoc || this.state.doc
    if (doc && key) {
      return doc[key]
    }
    return false
  }

  getDocArrayListItems (key) {
    const { doc } = this.state
    return doc[key] || []
  }

  prepareRelatedDocsState () {
    // prepare all relationalDocs
    const schema = this.props.schema
    // parse collection config for options
    schema.objectKeys().forEach((key) => {
      // only non _id fields
      if (key !== '_id') {
        const def = schema.getDefinition(key)
        // check for autoform key
        if (def.autoform && def.autoform.options) {
          // init relationalDocs
          // which docs are stored in state
          const curDocs = this.state.relationalDocs
          // check if relationalDocs are loaded already
          const relDocs = this.state.relationalDocs[key]
          // init new relationalDoc
          const newRelDocs = {}
          if (relDocs === undefined) {
            newRelDocs[key] = { loaded: false, items: [] }
          }
          const options = def.autoform.options
          // check what kind of options we handle
          switch (typeof options) {
            case 'function':
              newRelDocs[key] = { loaded: true, items: options() }
              this.setState({
                relationalDocs: Object.assign(curDocs, newRelDocs)
              })
              break
            case 'object': {
              options.load((items) => {
                newRelDocs[key] = { loaded: true, items }
                this.setState({
                  relationalDocs: Object.assign(curDocs, newRelDocs)
                })
              })
              break
            }
            default:
          }
        }
      }
    })
  }

  /**
   * Helper to pick fieldNames for a SubSchema from an SimpleSchema.
   * @param  {String} subSchemaFieldName Field-Name of the subschema, p.e. ``subschema1``
   * @return {Array} Array of fieldnames that belong to the SubSchema
   */
  pickKeysForSubSchema (subSchemaFieldName) {
    const schema = this.props.schema
    const subKeys = []
    schema._schemaKeys.forEach((fieldName) => { // eslint-disable-line
      if (fieldName.startsWith(`${subSchemaFieldName}.$.`)) {
        subKeys.push(fieldName)
      }
    })
    return subKeys
  }

  buildSubSchema (fields) {
    const schema = this.props.schema
    const schemaDef = {}
    fields.forEach((fieldname) => {
      const field = fieldname.split('.').pop()
      schemaDef[field] = schema.getDefinition(fieldname)
    })
    return new SimpleSchema(schemaDef)
  }

  addSubDocItem (docKey) {
    const newDoc = Object.assign({}, this.state.doc)
    const itemDoc = {}
    // check if we need to handle default values
    const subSchema = this.buildSubSchema(
      this.pickKeysForSubSchema(docKey)
    )
    subSchema.objectKeys().forEach((key) => {
      const def = subSchema.getDefinition(key)
      if (def.defaultValue) itemDoc[key] = def.defaultValue
    })
    // is there at least one item
    if (!newDoc[docKey]) newDoc[docKey] = []
    // add to top of array
    newDoc[docKey].unshift(itemDoc)
    // push to state
    this.setState({ doc: newDoc })
  }

  removeSubDocItem (docKey, idx) {
    const newDoc = Object.assign({}, this.state.doc)
    // remove item from doc array at idx
    newDoc[docKey].splice(idx, 1)
    // push to state
    this.setState({ doc: newDoc })
  }

  moveSubDocItem (docKey, idx, dir = 1) {
    const newDoc = Object.assign({}, this.state.doc)
    // remove item from doc array at idx
    const item = newDoc[docKey].splice(idx, 1)
    // check up / down
    newDoc[docKey].splice(idx + dir, 0, item[0])
    // push to state
    this.setState({ doc: newDoc })
  }

  hasDocArrayValue (key, value, subDoc) {
    const doc = subDoc || this.state.doc
    if (doc && (typeof doc[key] === 'object')) {
      return (doc[key].indexOf(value) > -1)
    }
    return false
  }

  enableButton () {
    this.setState({ canSubmit: true })
  }

  disableButton () {
    this.setState({ canSubmit: false })
  }

  buildOptionItems (key, options) {
    // check what kind of options we handle
    const relDocs = this.state.relationalDocs
    // parse items of given key
    if (relDocs[key]) {
      const items = relDocs[key].items
      return items.map((item, checkboxIdx) => {
        const itemKey = key + checkboxIdx
        const valKey = (options.valKey) ? options.valKey : 'value'
        const lblKey = (options.lblKey) ? options.lblKey : 'label'
        return (<MenuItem
          key={itemKey}
          value={item[valKey]}
          primaryText={item[lblKey]}
        />)
      })
    }
    return []
  }

  buildForm (subDoc, parentKey) {
    const buildForm = []
    const schema = this.props.schema
    const getFieldIdentifier = (key) => {
      if (parentKey && this.props.subDocIdx >= 0) {
        return `${parentKey}.${this.props.subDocIdx}.${key}`
      } else if (parentKey) {
        return `${parentKey}.${key}`
      }
      return key
    }
    const isRequired = def => !((def.optional && def.optional === true) || false)

    const styles = {
      smallIcon: {
        width: 24,
        height: 24
      }
    }
    // parse collection Schema to get default values
    schema.objectKeys().forEach((key, idx) => {
      // TODO add omitField check here
      // only non _id fields
      if (key !== '_id') {
        const def = schema.getDefinition(key)
        // check if a autoform type is defined
        const fieldType = (def.autoform && def.autoform.type) ? def.autoform.type : def.type
        // init fieldComp var which is used to store field definitions
        const fieldComp = []
        // get type of field
        switch (fieldType) {
          case String: {
            buildForm.push(
              <FormsyText
                key={`${getFieldIdentifier(key)}${idx}`}
                name={getFieldIdentifier(key)}
                fullWidth
                disabled={false}
                required={isRequired(def)}
                floatingLabelText={def.label} value={this.getDocTextValue(key, subDoc)}
              />
            )
            break
          }
          case 'select': {
            buildForm.push(
              <FormsySelect
                key={`${getFieldIdentifier(key)}${idx}`}
                name={getFieldIdentifier(key)}
                fullWidth
                floatingLabelText={def.label}
                value={this.getDocTextValue(key, subDoc)}
                required={isRequired(def)}
                disabled={false}
              >
                {this.buildOptionItems(key, def.autoform.options)}
              </FormsySelect>
            )
            break
          }
          case Number: {
            buildForm.push(
              <FormsyText
                key={`${getFieldIdentifier(key)}${idx}`}
                name={getFieldIdentifier(key)}
                fullWidth
                required={isRequired(def)}
                disabled={false}
                floatingLabelText={def.label}
                value={this.getDocTextValue(key, subDoc)} type="Number"
              />
            )
            break
          }
          case Boolean: {
            buildForm.push(
              <FormsyCheckbox
                key={`${getFieldIdentifier(key)}${idx}`}
                name={getFieldIdentifier(key)}
                label={def.label}
                value={this.getDocBoolValue(key, subDoc)}
                required={isRequired(def)}
                disabled={false}
              />
            )
            break
          }
          case Object: {
            const objKeys = schema._objectKeys[`${key}.`] // eslint-disable-line
            const subKeys = []
            objKeys.forEach((objKey) => {
              subKeys.push(`${key}.${objKey}`)
            })
            const subSchema = this.buildSubSchema(subKeys)
            buildForm.push(<Paper
              key={`${getFieldIdentifier(key)}${idx}`}
              style={{ padding: 20, marginTop: 20 }} zDepth={2}
            >
              <h4>{def.label}</h4>
              <AutoForm
                doc={this.getDocObjectValue(key)}
                schema={subSchema}
                parentKey={key}
              />
            </Paper>
            )
            break
          }
          case Array: {
            const subSchema = this.buildSubSchema(this.pickKeysForSubSchema(key))
            const itemsList = this.getDocArrayListItems(key)
            buildForm.push(<div
              key={`${getFieldIdentifier(key)}${idx}`}
              style={{ width: '100%', marginBottom: '10px' }}
            >
              <h4>{def.label}</h4>
              <RaisedButton
                label="+"
                type="button"
                primary
                onClick={() => this.addSubDocItem(key)}
              />
              {itemsList.map((item, arrIdx) => (
                <Paper
                  key={`${getFieldIdentifier(key)}${arrIdx}`}
                  style={{ padding: 20, marginTop: 20 }} zDepth={2}
                >
                  <AutoForm
                    doc={item}
                    schema={subSchema}
                    parentKey={key}
                    subDocIdx={arrIdx}
                  />
                  <Toolbar>
                    <ToolbarGroup />
                    <ToolbarGroup lastChild>
                      <IconButton
                        type="button"
                        iconClassName="fa fa-chevron-up"
                        iconStyle={styles.smallIcon}
                        disabled={(arrIdx === 0)}
                        onClick={() => this.moveSubDocItem(key, arrIdx, -1)}
                      />
                      <IconButton
                        type="button"
                        iconClassName="fa fa-chevron-down"
                        iconStyle={styles.smallIcon}
                        disabled={((arrIdx + 1) === itemsList.length)}
                        onClick={() => this.moveSubDocItem(key, arrIdx)}
                      />
                      <IconButton
                        label="-" type="button"
                        iconClassName="fa fa-trash"
                        iconStyle={styles.smallIcon}
                        onClick={() => this.removeSubDocItem(key, arrIdx)}
                      />
                    </ToolbarGroup>
                  </Toolbar>
                </Paper>
              ))}
            </div>)
            break
          }
          case 'checkboxgroup': {
            // build field component
            fieldComp.length = 0
            fieldComp.push(<h4 key={`${getFieldIdentifier(key)}${idx}`}>{def.label}</h4>)
            // build list of checkboxes
            def.autoform.options().forEach((option, checkboxIdx) => {
              fieldComp.push(
                <FormsyCheckbox
                  key={checkboxIdx} name={key + checkboxIdx} label={option.label}
                  value={this.hasDocArrayValue(key, option.value)}
                />
              )
            })
            buildForm.push(fieldComp)
            break
          }
          default: {
            console.error('AutoForm field type not valid: ', fieldType)
          }
        }
      }
    })

    return buildForm
  }

  prepareDocToSubmit (doc, ss) {
    const preparedDoc = doc
    const schema = ss || this.props.schema
    // parse collection Schema to get default values
    schema.objectKeys().forEach((key) => {
      // only non _id fields
      if (key !== '_id') {
        const def = schema.getDefinition(key)
        // check if a autoform type is defined
        const fieldType = (def.autoform && def.autoform.type) ? def.autoform.type : def.type
        // get type of field
        switch (fieldType) {
          case Number:
            preparedDoc[key] = parseInt(doc[key], 10)
            break
          case 'checkboxgroup':
            preparedDoc[key] = []
            // build list of checkboxes
            def.autoform.options().forEach((option, checkboxIdx) => {
              if (doc[key + checkboxIdx]) preparedDoc[key].push(option.value)
              delete preparedDoc[key + checkboxIdx]
            })
            break
          case Array:
            // build array of docs
            if (preparedDoc[key]) {
              const newArray = []
              const itemCount = Object.keys(preparedDoc[key]).length
              const subSchema = this.buildSubSchema(this.pickKeysForSubSchema(key))
              for (let i = 0; i < itemCount; i += 1) {
                newArray.push(this.prepareDocToSubmit(preparedDoc[key][i], subSchema))
              }
              preparedDoc[key] = newArray
            }
            break
          default:
        }
      }
    })
    // console.log(doc)
    // console.log(preparedDoc)
    // finally submit it
    return preparedDoc
  }

  render () {
    return (
      <div>
        {this.props.parentKey &&
          this.buildForm(this.props.doc, this.props.parentKey)
        }
        {!this.props.parentKey &&
          <Formsy.Form
            onValidSubmit={doc => this.props.submit(this.prepareDocToSubmit(doc))}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            disabled
          >
            {this.state.doc._id &&
              <FormsyText
                name="_id" fullWidth
                floatingLabelText="ID" value={this.getDocTextValue('_id')}
                disabled
              />
            }

            {this.buildForm()}

            <Toolbar style={{ marginTop: '1em' }}>
              <ToolbarGroup>
                {this.props.saving && (<CircularProgress />)}
              </ToolbarGroup>
              <ToolbarGroup>
                <RaisedButton
                  label="Save"
                  type="submit"
                  primary
                  disabled={!this.state.canSubmit}
                />
                <RaisedButton
                  label="Close"
                  type="button"
                  secondary
                  onClick={() => browserHistory.goBack()}
                />
              </ToolbarGroup>
            </Toolbar>
          </Formsy.Form>
        }
      </div>
    )
  }
}

AutoForm.propTypes = {
  submit: React.PropTypes.func,
  saving: React.PropTypes.bool,
  schema: React.PropTypes.object,
  doc: React.PropTypes.object,
  parentKey: React.PropTypes.string,
  subDocIdx: React.PropTypes.number
}

export default AutoForm
