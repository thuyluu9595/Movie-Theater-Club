import React from "react";
import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  
  userInfo: localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null,
  
  ticket: {
    ticketItems: localStorage.getItem('ticketItems')
      ? JSON.parse(localStorage.getItem('ticketItems'))
      : [],
  },

  payment: {
    method: null,
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
    case 'USER_SIGNIN':
      return {...state, userInfo: action.payload};  
    case 'USER_SIGNOUT':
      return {...state, userInfo: null};
    case 'SAVE_PAYMENT_METHOD':
      return {...state, payment: action.payload};
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const[state, dispatch] =useReducer(reducer, initialState);
  const value = {state, dispatch};
  return <Store.Provider value={value}>{props.children}</Store.Provider>
}