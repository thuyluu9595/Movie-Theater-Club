import React from "react";
import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  ticket: {
    ticketItems: [],
  },
};
function reducer(state, action) {
  switch (action.type) {
    case 'TICKET_ADD_ITEM':
      // add to ticket
      return {
        ...state, 
        ticket: {
          ...state.ticket, 
          ticketItems:[...state.ticket.ticketItems, action.payload],
        },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const[state, dispatch] =useReducer(reducer, initialState);
  const value = {state, dispatch};
  return <Store.Provider value={value}>{props.children}</Store.Provider>
}