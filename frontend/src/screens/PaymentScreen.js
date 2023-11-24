import React, {useContext, useState} from 'react'
import CheckoutSteps from '../components/CheckoutSteps'
import {Helmet} from 'react-helmet'
import {Button, Form} from 'react-bootstrap'
import {Store} from '../Stores';
import {useNavigate, useParams} from "react-router-dom";

export default function PaymentScreen() {


    const {state, dispatch: ctxDispatch} = useContext(Store);
    const [paymentMethodName, setPaymentMethod] = useState('Stripe');
    const navigate = useNavigate();
    const params = useParams();
    const {id} = params;
    const submitHandler = (e) => {
        e.preventDefault();
        if (paymentMethodName === "Stripe") navigate(`/payment/stripe/${id}`);
        else {

        }

    }
    return (
        <div>
            <div className='container small-container'>
                <Helmet>
                    <title>Payment Method</title>
                </Helmet>
                <h1 className='my-3'>Payment Method</h1>
                <Form onSubmit={submitHandler}>
                    <div className='mb-3'>
                        <Form.Check
                            type='radio'
                            id='Paypal'
                            label='Point'
                            value='Point'
                            checked={paymentMethodName === 'Point'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </div>
                    <div className='mb-3'>
                        <Form.Check
                            type='radio'
                            id='Stripe'
                            label='Stripe'
                            value='Stripe'
                            checked={paymentMethodName === 'Stripe'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </div>
                    <div className='mb-3'>
                        <Button type='submit'>Continue</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
