import React, { useContext } from 'react'
import { Store } from '../Stores'
import { Helmet } from 'react-helmet';

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  return (
    <div className='container small-container'>
    <Helmet>
      <title>Profile Screen</title>
    </Helmet>
    <h1 className='my-3'>User Profile</h1>
    </div>
  )
}
