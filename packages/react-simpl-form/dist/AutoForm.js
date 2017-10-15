'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _formsyReact = require('formsy-react');

var _formsyReact2 = _interopRequireDefault(_formsyReact);

var _FormsyText = require('formsy-material-ui/lib/FormsyText');

var _FormsyText2 = _interopRequireDefault(_FormsyText);

var _FormsySelect = require('formsy-material-ui/lib/FormsySelect');

var _FormsySelect2 = _interopRequireDefault(_FormsySelect);

var _MenuItem = require('material-ui/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _Paper = require('material-ui/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

var _IconButton = require('material-ui/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _CircularProgress = require('material-ui/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _FormsyCheckbox = require('formsy-material-ui/lib/FormsyCheckbox');

var _FormsyCheckbox2 = _interopRequireDefault(_FormsyCheckbox);

var _Toolbar = require('material-ui/Toolbar');

var _reactRouter = require('react-router');

var _aldeedSimpleSchema = require('meteor/aldeed:simple-schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
// we added this rule as Meteor uses _id as collection key per default


var AutoForm = function (_Component) {
  _inherits(AutoForm, _Component);

  function AutoForm(props) {
    _classCallCheck(this, AutoForm);

    var _this = _possibleConstructorReturn(this, (AutoForm.__proto__ || Object.getPrototypeOf(AutoForm)).call(this, props));

    _this.state = {
      canSubmit: false,
      doc: {},
      relationalDocs: {}
    };
    // use these inits or write
    // enableButton = () => { ... }
    // need to find a suitable linting rule / babel Setup
    _this.enableButton = _this.enableButton.bind(_this);
    _this.disableButton = _this.disableButton.bind(_this);
    _this.prepareDocToSubmit = _this.prepareDocToSubmit.bind(_this);
    return _this;
  }

  _createClass(AutoForm, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.prepareRelatedDocsState();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ doc: nextProps.doc });
      this.prepareRelatedDocsState();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html
      // TODO find a way to get rid of the warning
      // Warning: setState(...): Can only update a mounted or mounting component.
    }
  }, {
    key: 'getDocTextValue',
    value: function getDocTextValue(key, subDoc) {
      var doc = subDoc || this.state.doc;
      if (doc && key) {
        return doc[key];
      }
      return '';
    }
  }, {
    key: 'getDocObjectValue',
    value: function getDocObjectValue(key, subDoc) {
      var doc = subDoc || this.state.doc;
      if (doc && key) {
        return doc[key];
      }
      return {};
    }
  }, {
    key: 'getDocBoolValue',
    value: function getDocBoolValue(key, subDoc) {
      var doc = subDoc || this.state.doc;
      if (doc && key) {
        return doc[key];
      }
      return false;
    }
  }, {
    key: 'getDocArrayListItems',
    value: function getDocArrayListItems(key) {
      var doc = this.state.doc;

      return doc[key] || [];
    }
  }, {
    key: 'prepareRelatedDocsState',
    value: function prepareRelatedDocsState() {
      var _this2 = this;

      // prepare all relationalDocs
      var schema = this.props.schema;
      // parse collection config for options
      schema.objectKeys().forEach(function (key) {
        // only non _id fields
        if (key !== '_id') {
          var def = schema.getDefinition(key);
          // check for autoform key
          if (def.autoform && def.autoform.options) {
            // init relationalDocs
            // which docs are stored in state
            var curDocs = _this2.state.relationalDocs;
            // check if relationalDocs are loaded already
            var relDocs = _this2.state.relationalDocs[key];
            // init new relationalDoc
            var newRelDocs = {};
            if (relDocs === undefined) {
              newRelDocs[key] = { loaded: false, items: [] };
            }
            var options = def.autoform.options;
            // check what kind of options we handle
            switch (typeof options === 'undefined' ? 'undefined' : _typeof(options)) {
              case 'function':
                newRelDocs[key] = { loaded: true, items: options() };
                _this2.setState({
                  relationalDocs: Object.assign(curDocs, newRelDocs)
                });
                break;
              case 'object':
                {
                  options.load(function (items) {
                    newRelDocs[key] = { loaded: true, items: items };
                    _this2.setState({
                      relationalDocs: Object.assign(curDocs, newRelDocs)
                    });
                  });
                  break;
                }
              default:
            }
          }
        }
      });
    }

    /**
     * Helper to pick fieldNames for a SubSchema from an SimpleSchema.
     * @param  {String} subSchemaFieldName Field-Name of the subschema, p.e. ``subschema1``
     * @return {Array} Array of fieldnames that belong to the SubSchema
     */

  }, {
    key: 'pickKeysForSubSchema',
    value: function pickKeysForSubSchema(subSchemaFieldName) {
      var schema = this.props.schema;
      var subKeys = [];
      schema._schemaKeys.forEach(function (fieldName) {
        // eslint-disable-line
        if (fieldName.startsWith(subSchemaFieldName + '.$.')) {
          subKeys.push(fieldName);
        }
      });
      return subKeys;
    }
  }, {
    key: 'buildSubSchema',
    value: function buildSubSchema(fields) {
      var schema = this.props.schema;
      var schemaDef = {};
      fields.forEach(function (fieldname) {
        var field = fieldname.split('.').pop();
        schemaDef[field] = schema.getDefinition(fieldname);
      });
      return new _aldeedSimpleSchema.SimpleSchema(schemaDef);
    }
  }, {
    key: 'addSubDocItem',
    value: function addSubDocItem(docKey) {
      var newDoc = Object.assign({}, this.state.doc);
      var itemDoc = {};
      // check if we need to handle default values
      var subSchema = this.buildSubSchema(this.pickKeysForSubSchema(docKey));
      subSchema.objectKeys().forEach(function (key) {
        var def = subSchema.getDefinition(key);
        if (def.defaultValue) itemDoc[key] = def.defaultValue;
      });
      // is there at least one item
      if (!newDoc[docKey]) newDoc[docKey] = [];
      // add to top of array
      newDoc[docKey].unshift(itemDoc);
      // push to state
      this.setState({ doc: newDoc });
    }
  }, {
    key: 'removeSubDocItem',
    value: function removeSubDocItem(docKey, idx) {
      var newDoc = Object.assign({}, this.state.doc);
      // remove item from doc array at idx
      newDoc[docKey].splice(idx, 1);
      // push to state
      this.setState({ doc: newDoc });
    }
  }, {
    key: 'moveSubDocItem',
    value: function moveSubDocItem(docKey, idx) {
      var dir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      var newDoc = Object.assign({}, this.state.doc);
      // remove item from doc array at idx
      var item = newDoc[docKey].splice(idx, 1);
      // check up / down
      newDoc[docKey].splice(idx + dir, 0, item[0]);
      // push to state
      this.setState({ doc: newDoc });
    }
  }, {
    key: 'hasDocArrayValue',
    value: function hasDocArrayValue(key, value, subDoc) {
      var doc = subDoc || this.state.doc;
      if (doc && _typeof(doc[key]) === 'object') {
        return doc[key].indexOf(value) > -1;
      }
      return false;
    }
  }, {
    key: 'enableButton',
    value: function enableButton() {
      this.setState({ canSubmit: true });
    }
  }, {
    key: 'disableButton',
    value: function disableButton() {
      this.setState({ canSubmit: false });
    }
  }, {
    key: 'buildOptionItems',
    value: function buildOptionItems(key, options) {
      // check what kind of options we handle
      var relDocs = this.state.relationalDocs;
      // parse items of given key
      if (relDocs[key]) {
        var items = relDocs[key].items;
        return items.map(function (item, checkboxIdx) {
          var itemKey = key + checkboxIdx;
          var valKey = options.valKey ? options.valKey : 'value';
          var lblKey = options.lblKey ? options.lblKey : 'label';
          return _react2.default.createElement(_MenuItem2.default, {
            key: itemKey,
            value: item[valKey],
            primaryText: item[lblKey]
          });
        });
      }
      return [];
    }
  }, {
    key: 'buildForm',
    value: function buildForm(subDoc, parentKey) {
      var _this3 = this;

      var buildForm = [];
      var schema = this.props.schema;
      var getFieldIdentifier = function getFieldIdentifier(key) {
        if (parentKey && _this3.props.subDocIdx >= 0) {
          return parentKey + '.' + _this3.props.subDocIdx + '.' + key;
        } else if (parentKey) {
          return parentKey + '.' + key;
        }
        return key;
      };
      var isRequired = function isRequired(def) {
        return !(def.optional && def.optional === true || false);
      };

      var styles = {
        smallIcon: {
          width: 24,
          height: 24
        }
      };
      // parse collection Schema to get default values
      schema.objectKeys().forEach(function (key, idx) {
        // TODO add omitField check here
        // only non _id fields
        if (key !== '_id') {
          var def = schema.getDefinition(key);
          // check if a autoform type is defined
          var fieldType = def.autoform && def.autoform.type ? def.autoform.type : def.type;
          // init fieldComp var which is used to store field definitions
          var fieldComp = [];
          // get type of field
          switch (fieldType) {
            case String:
              {
                buildForm.push(_react2.default.createElement(_FormsyText2.default, {
                  key: '' + getFieldIdentifier(key) + idx,
                  name: getFieldIdentifier(key),
                  fullWidth: true,
                  disabled: false,
                  required: isRequired(def),
                  floatingLabelText: def.label, value: _this3.getDocTextValue(key, subDoc)
                }));
                break;
              }
            case 'select':
              {
                buildForm.push(_react2.default.createElement(
                  _FormsySelect2.default,
                  {
                    key: '' + getFieldIdentifier(key) + idx,
                    name: getFieldIdentifier(key),
                    fullWidth: true,
                    floatingLabelText: def.label,
                    value: _this3.getDocTextValue(key, subDoc),
                    required: isRequired(def),
                    disabled: false
                  },
                  _this3.buildOptionItems(key, def.autoform.options)
                ));
                break;
              }
            case Number:
              {
                buildForm.push(_react2.default.createElement(_FormsyText2.default, {
                  key: '' + getFieldIdentifier(key) + idx,
                  name: getFieldIdentifier(key),
                  fullWidth: true,
                  required: isRequired(def),
                  disabled: false,
                  floatingLabelText: def.label,
                  value: _this3.getDocTextValue(key, subDoc), type: 'Number'
                }));
                break;
              }
            case Boolean:
              {
                buildForm.push(_react2.default.createElement(_FormsyCheckbox2.default, {
                  key: '' + getFieldIdentifier(key) + idx,
                  name: getFieldIdentifier(key),
                  label: def.label,
                  value: _this3.getDocBoolValue(key, subDoc),
                  required: isRequired(def),
                  disabled: false
                }));
                break;
              }
            case Object:
              {
                var objKeys = schema._objectKeys[key + '.']; // eslint-disable-line
                var subKeys = [];
                objKeys.forEach(function (objKey) {
                  subKeys.push(key + '.' + objKey);
                });
                var subSchema = _this3.buildSubSchema(subKeys);
                buildForm.push(_react2.default.createElement(
                  _Paper2.default,
                  {
                    key: '' + getFieldIdentifier(key) + idx,
                    style: { padding: 20, marginTop: 20 }, zDepth: 2
                  },
                  _react2.default.createElement(
                    'h4',
                    null,
                    def.label
                  ),
                  _react2.default.createElement(AutoForm, {
                    doc: _this3.getDocObjectValue(key),
                    schema: subSchema,
                    parentKey: key
                  })
                ));
                break;
              }
            case Array:
              {
                var _subSchema = _this3.buildSubSchema(_this3.pickKeysForSubSchema(key));
                var itemsList = _this3.getDocArrayListItems(key);
                buildForm.push(_react2.default.createElement(
                  'div',
                  {
                    key: '' + getFieldIdentifier(key) + idx,
                    style: { width: '100%', marginBottom: '10px' }
                  },
                  _react2.default.createElement(
                    'h4',
                    null,
                    def.label
                  ),
                  _react2.default.createElement(_RaisedButton2.default, {
                    label: '+',
                    type: 'button',
                    primary: true,
                    onClick: function onClick() {
                      return _this3.addSubDocItem(key);
                    }
                  }),
                  itemsList.map(function (item, arrIdx) {
                    return _react2.default.createElement(
                      _Paper2.default,
                      {
                        key: '' + getFieldIdentifier(key) + arrIdx,
                        style: { padding: 20, marginTop: 20 }, zDepth: 2
                      },
                      _react2.default.createElement(AutoForm, {
                        doc: item,
                        schema: _subSchema,
                        parentKey: key,
                        subDocIdx: arrIdx
                      }),
                      _react2.default.createElement(
                        _Toolbar.Toolbar,
                        null,
                        _react2.default.createElement(_Toolbar.ToolbarGroup, null),
                        _react2.default.createElement(
                          _Toolbar.ToolbarGroup,
                          { lastChild: true },
                          _react2.default.createElement(_IconButton2.default, {
                            type: 'button',
                            iconClassName: 'fa fa-chevron-up',
                            iconStyle: styles.smallIcon,
                            disabled: arrIdx === 0,
                            onClick: function onClick() {
                              return _this3.moveSubDocItem(key, arrIdx, -1);
                            }
                          }),
                          _react2.default.createElement(_IconButton2.default, {
                            type: 'button',
                            iconClassName: 'fa fa-chevron-down',
                            iconStyle: styles.smallIcon,
                            disabled: arrIdx + 1 === itemsList.length,
                            onClick: function onClick() {
                              return _this3.moveSubDocItem(key, arrIdx);
                            }
                          }),
                          _react2.default.createElement(_IconButton2.default, {
                            label: '-', type: 'button',
                            iconClassName: 'fa fa-trash',
                            iconStyle: styles.smallIcon,
                            onClick: function onClick() {
                              return _this3.removeSubDocItem(key, arrIdx);
                            }
                          })
                        )
                      )
                    );
                  })
                ));
                break;
              }
            case 'checkboxgroup':
              {
                // build field component
                fieldComp.length = 0;
                fieldComp.push(_react2.default.createElement(
                  'h4',
                  { key: '' + getFieldIdentifier(key) + idx },
                  def.label
                ));
                // build list of checkboxes
                def.autoform.options().forEach(function (option, checkboxIdx) {
                  fieldComp.push(_react2.default.createElement(_FormsyCheckbox2.default, {
                    key: checkboxIdx, name: key + checkboxIdx, label: option.label,
                    value: _this3.hasDocArrayValue(key, option.value)
                  }));
                });
                buildForm.push(fieldComp);
                break;
              }
            default:
              {
                console.error('AutoForm field type not valid: ', fieldType);
              }
          }
        }
      });

      return buildForm;
    }
  }, {
    key: 'prepareDocToSubmit',
    value: function prepareDocToSubmit(doc, ss) {
      var _this4 = this;

      var preparedDoc = doc;
      var schema = ss || this.props.schema;
      // parse collection Schema to get default values
      schema.objectKeys().forEach(function (key) {
        // only non _id fields
        if (key !== '_id') {
          var def = schema.getDefinition(key);
          // check if a autoform type is defined
          var fieldType = def.autoform && def.autoform.type ? def.autoform.type : def.type;
          // get type of field
          switch (fieldType) {
            case Number:
              preparedDoc[key] = parseInt(doc[key], 10);
              break;
            case 'checkboxgroup':
              preparedDoc[key] = [];
              // build list of checkboxes
              def.autoform.options().forEach(function (option, checkboxIdx) {
                if (doc[key + checkboxIdx]) preparedDoc[key].push(option.value);
                delete preparedDoc[key + checkboxIdx];
              });
              break;
            case Array:
              // build array of docs
              if (preparedDoc[key]) {
                var newArray = [];
                var itemCount = Object.keys(preparedDoc[key]).length;
                var subSchema = _this4.buildSubSchema(_this4.pickKeysForSubSchema(key));
                for (var i = 0; i < itemCount; i += 1) {
                  newArray.push(_this4.prepareDocToSubmit(preparedDoc[key][i], subSchema));
                }
                preparedDoc[key] = newArray;
              }
              break;
            default:
          }
        }
      });
      // console.log(doc)
      // console.log(preparedDoc)
      // finally submit it
      return preparedDoc;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return _react2.default.createElement(
        'div',
        null,
        this.props.parentKey && this.buildForm(this.props.doc, this.props.parentKey),
        !this.props.parentKey && _react2.default.createElement(
          _formsyReact2.default.Form,
          {
            onValidSubmit: function onValidSubmit(doc) {
              return _this5.props.submit(_this5.prepareDocToSubmit(doc));
            },
            onValid: this.enableButton,
            onInvalid: this.disableButton,
            disabled: true
          },
          this.state.doc._id && _react2.default.createElement(_FormsyText2.default, {
            name: '_id', fullWidth: true,
            floatingLabelText: 'ID', value: this.getDocTextValue('_id'),
            disabled: true
          }),
          this.buildForm(),
          _react2.default.createElement(
            _Toolbar.Toolbar,
            { style: { marginTop: '1em' } },
            _react2.default.createElement(
              _Toolbar.ToolbarGroup,
              null,
              this.props.saving && _react2.default.createElement(_CircularProgress2.default, null)
            ),
            _react2.default.createElement(
              _Toolbar.ToolbarGroup,
              null,
              _react2.default.createElement(_RaisedButton2.default, {
                label: 'Save',
                type: 'submit',
                primary: true,
                disabled: !this.state.canSubmit
              }),
              _react2.default.createElement(_RaisedButton2.default, {
                label: 'Close',
                type: 'button',
                secondary: true,
                onClick: function onClick() {
                  return _reactRouter.browserHistory.goBack();
                }
              })
            )
          )
        )
      );
    }
  }]);

  return AutoForm;
}(_react.Component);

AutoForm.propTypes = {
  submit: _react2.default.PropTypes.func,
  saving: _react2.default.PropTypes.bool,
  schema: _react2.default.PropTypes.object,
  doc: _react2.default.PropTypes.object,
  parentKey: _react2.default.PropTypes.string,
  subDocIdx: _react2.default.PropTypes.number
};

exports.default = AutoForm;