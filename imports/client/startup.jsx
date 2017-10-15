import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'

import RenderRoutes from './routes'

// https://github.com/zilverline/react-tap-event-plugin
// it's all about the click event and it's 300ms delay on various browsers
injectTapEventPlugin()

Meteor.startup(() => {
  render(<RenderRoutes />, document.getElementById('render-target'))
})
