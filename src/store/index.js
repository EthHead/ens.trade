import { createStore, applyMiddleware, combineReducers } from 'redux';
import { logger } from 'redux-logger';
import promise from 'redux-promise-middleware';
import history from '../history';
import ethereum from './ethereum';
import records from './records';
import record from './record';
import offers from './offers';
import popup from './popup';

const redirect = () => next => (action) => {
  if (action.redirect) {
    history.push({ pathname: action.redirect });
    return;
  }
  next(action);
};

const middleware = applyMiddleware(
  promise(),
  redirect,
  logger,
);

const reducer = combineReducers({
  ethereum,
  records,
  record,
  offers,
  popup,
});

const store = createStore(reducer, middleware);

export default store;
