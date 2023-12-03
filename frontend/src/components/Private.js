import React, {useContext} from 'react'
import {Navigate} from 'react-router-dom';
import {Store} from "../Stores";

export default function Private({children}) {
    const {state: ctxState, dispatch: ctxDispatch} = useContext(Store);
    const {userInfo} = ctxState;
    return userInfo && userInfo.role === "Member" ? children : <Navigate to="/signin"/>;
}