import React, { useContext , useState} from 'react'
import { Store } from '../Stores'
import { Helmet } from 'react-helmet';
import { Form , Button } from 'react-bootstrap'

export default function ProfileScreen() {
    //TODO: connect backend

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const submitHandler = async () => {};
    return (
        <div className='container small-container'>
            <Helmet>
                <title>Profile Screen</title>
            </Helmet>
            <h1 className='my-3'>User Profile</h1>
            <form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='confirmPassword'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required />
                </Form.Group>
            </form>
            <div className='mb-3'>
                <Button type='submit'>Update</Button>
            </div>
        </div>
    );
}
