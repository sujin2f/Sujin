/** store */
import React, {createContext, useReducer} from "react";
import { reducer, initialState } from './reducer'

export const Store = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  )
};

export const Context = createContext(initialState);
