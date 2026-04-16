import React from "react";
import Spinner from 'react-bootstrap/Spinner';

export default function LoadingBox({ isButton = false }) {
    return (
        <Spinner animation="border" role="status" className={isButton ? 'loading-spinner' : ''}>
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    );
}