import React from "react";
import { Spinner } from "react-bootstrap";

export default function LoadingBox() {
  return (
    <Spinner amination='border' role='status'>
      <span className="'visually-hidden">Loading...</span>
    </Spinner>
  )
}