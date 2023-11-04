import React, { useContext, useReducer } from 'react'
import { Navigate } from 'react-router-dom'
import { Store } from '../Stores'

export default function ProtectedRoute({children}) {

  const { state } = useContext(Store);
  const { userInfo } = state;
   if (userInfo && userInfo.isAdmin) {
    return children
   } else {
    return <Navigate to="/signin" />;
   }
}
