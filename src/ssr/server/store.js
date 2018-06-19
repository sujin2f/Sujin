import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer } from 'redux-persist';
import createHistory from 'history/createMemoryHistory';
import { routerMiddleware } from 'react-router-redux'

import rootReducer from 'app/reducers';
import persistConfig from 'app/persistConfig';

export const initializeSession = () => ({
  type: 'INITIALIZE_SESSION',
});

const configureStore = (initialState = {}) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);
  middleware.push(routerMiddleware(history));

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = compose(...enhancers);

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  // Create Store
  const store = createStore(persistedReducer, initialState, enhancer);
  const history = createHistory();
  return {
    history,
    store
  };
};

export default configureStore;
