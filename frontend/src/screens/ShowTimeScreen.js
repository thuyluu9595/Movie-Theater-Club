import React, { useContext } from "react";
import { Helmet } from "react-helmet";
import { Store } from "../Stores";


export default function ShowTimeScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    ticket: { ticketItems }, 
  } = state;
  return (
    <div>
      <Helmet>
        <title>THC Theater</title>
      </Helmet>
    </div>

  )
}