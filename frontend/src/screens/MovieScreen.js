import { useParams } from "react-router-dom"

export default function MovieScreen(){
  
  const params = useParams();
  const {slug} = params;
  
  return (
    <div>{slug}</div>
  )
  
}