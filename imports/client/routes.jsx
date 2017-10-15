import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// route components
import WebsiteContainer from './components/layout/App'
import HomePage from './components/pages/HomePage'
import ContactPage from './components/pages/ContactPage'
import NotFoundPage from './components/pages/NotFoundPage'

export default () => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={WebsiteContainer}>
        <IndexRoute component={HomePage} />
        <Route
          path="/contact"
          component={ContactPage}
        />
      </Route>
      {/* Catch All Route */}
      <Route path="*" component={NotFoundPage} />
    </Router>
  )
}
