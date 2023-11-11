import React, { useContext, useState } from 'react'
import { Store } from '../Stores';
import { Helmet } from 'react-helmet';
import { Button, Form } from 'react-bootstrap';

export default function PremiumScreen() {
    //TODO: connect backend
    
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;
    const [cardNumber, setCradNumber] = useState(userInfo.name);
    const [expMonth, setExpMonth] = useState(userInfo.email);
    const [expYear, setEpxYear] = useState('');
    const [cvc, setCvc] = useState('');

    const submitHandler = async () => {};
    return (
        <div className='container small-container'>
            <Helmet>
                <title>Premium</title>
            </Helmet>
            <h1 className='my-3'>Update Premium</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId='cardNumber'>
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
                        value={cardNumber}
                        onChange={(e) => setCradNumber(e.target.value)}
                        required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='expMonth'>
                    <Form.Label>Expire Month</Form.Label>
                    <Form.Control
                        type='expMonth'
                        value={expMonth}
                        onChange={(e) => setExpMonth(e.target.value)}
                        required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='expYear'>
                    <Form.Label>Expire Year</Form.Label>
                    <Form.Control
                        value={expYear}
                        onChange={(e) => setEpxYear(e.target.value)}
                        required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='cvc'>
                    <Form.Label>Security</Form.Label>
                    <Form.Control
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        required />
                </Form.Group>
            </Form>
            <div className='mb-3'>
                <Button type='submit'>Update</Button>
            </div>
        </div>
    );
    
}

