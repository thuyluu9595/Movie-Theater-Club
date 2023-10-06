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
      const  newItem =  action.payload;
      const existItem = state.ticket.ticketItems.find(
        (item) => item._id === newItem._id
      );
      const ticketItems = existItem
      ? state.ticket.ticketItems.map((item) => 
        item._id === existItem._id ? newItem : item
        )
      : [...state.ticket.ticketItems, newItem];
      return {...state, ticket: {...state.ticket, ticketItems}};
      
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const[state, dispatch] =useReducer(reducer, initialState);
  const value = {state, dispatch};
  return <Store.Provider value={value}>{props.children}</Store.Provider>
}