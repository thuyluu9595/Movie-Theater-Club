// import React, { useContext , useState} from 'react'
// import { Store } from '../Stores'
// import { Helmet } from 'react-helmet';
// import { Form , Button } from 'react-bootstrap'
// import {useParams} from "react-router-dom";
//
//
// export default function CreateMovieScreen(props) {
//     //TODO: connect backend
//
//     // const { state, dispatch: ctxDispatch } = useContext(Store);
//     // const { userInfo } = state;
//     // const [name, setName] = useState(userInfo.name);
//     // const [email, setEmail] = useState(userInfo.email);
//     // const [password, setPassword] = useState('');
//     // const [confirmPassword, setConfirmPassword] = useState('');
//     const {screenType} = props;
//     const id = useParams().id;
//     console.log(id);
//     // const initialState = {
//     //     title: movie.title,
//     //     description: movie.description,
//     //     duration_in_minutes: movie.duration_in_minutes,
//     //     release_date: movie.release_date,
//     //     poster_url: movie.poster_url,
//     // }
//     const [state, setState] = useState({});
//     const {title, description, duration_in_minutes, release_date, poster_url} = state;
//
//
//     const submitHandler = async () => {};
//     return (
//         <div className='container small-container'>
//             <Helmet>
//                 <title>{screenType === "CREATE" ? "Create Movie" : "Edit Movie"}</title>
//             </Helmet>
//             <h1 className='my-3'>screenType === "CREATE" ? "Create Movie" : "Edit Movie"</h1>
//             {screenType === "EDIT" && (
//                 <div>
//                     <img
//                         src={movie.posterUrl}
//                         className='card-img-top'
//                         alt={movie.title}
//                         width="500" height="500"
//                     />
//                     <button>Change Image</button>
//                 </div>)}
//             <form onSubmit={submitHandler}>
//                 <Form.Group className='mb-3' controlId='title'>
//                     <Form.Label>Movie Title</Form.Label>
//                     <Form.Control
//                         value={title}
//                         placeholder={movie.title}
//                         onChange={(e) => setState({...state, title: e.target.value})}
//                         required />
//                 </Form.Group>
//                 <Form.Group className='mb-3' controlId='description'>
//                     <Form.Label>Description</Form.Label>
//                     <Form.Control
//                         value={description}
//                         placeholder={movie.description}
//                         onChange={(e) => setState({...state, description: e.target.value})}
//                         required />
//                 </Form.Group>
//                 <Form.Group className='mb-3' controlId='duration'>
//                     <Form.Label>Duration (in minutes)</Form.Label>
//                     <Form.Control
//                         value={duration_in_minutes}
//                         placeholder={movie.duration_in_minutes}
//                         onChange={(e) => setState({...state, duration_in_minutes: e.target.value})}
//                         required />
//                 </Form.Group>
//                 <Form.Group className='mb-3' controlId='release_date'>
//                     <Form.Label>Release Date</Form.Label>
//                     <Form.Control
//                         value={release_date}
//                         placeholder={movie.release_date}
//                         onChange={(e) => setState({...state, release_date: e.target.value})}
//                         required />
//                 </Form.Group>
//             </form>
//             <div className='mb-3'>
//                 <Button type='submit'>Update</Button>
//             </div>
//         </div>
//     );
// }
