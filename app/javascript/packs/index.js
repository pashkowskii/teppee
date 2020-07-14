import React                                                      from 'react'
import ReactDOM                                                   from 'react-dom'
import { Provider, connect }                                      from 'react-redux'
import createHistory                                              from 'history/createBrowserHistory'
import { ConnectedRouter, routerReducer, routerMiddleware }       from 'react-router-redux'
import { compose, createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware                                            from 'redux-thunk'
import persistState                                               from 'redux-localstorage'
import App                                                        from '../src/app'
import auth                                                       from './modules/auth'
import campground                                                 from './modules/campground'
import campgrounds                                                from './modules/campgrounds'

const history = createHistory()

const rootReducer = combineReducers({
  auth,
  campground,
  campgrounds,
  router: routerReducer
})

const middlewares = [thunkMiddleware, routerMiddleware(history)]

if (process.env.NODE_ENV === 'development') {
  const { logger } = require('redux-logger')
  middlewares.push(logger)
}

const enhancer = compose(
  applyMiddleware(...middlewares),
  persistState('auth', { key: 'AUTH' })
)

const store = createStore(rootReducer, {}, enhancer)

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  )
})
