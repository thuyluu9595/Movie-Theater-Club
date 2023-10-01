import { useParams } from "react-router-dom"
import React from "react";

export default function MovieScreen(){
  
  const params = useParams();
  const { slug } = params;

  return (
    <div>
      <h1>{ slug }</h1>
    </div>
  )
  
}