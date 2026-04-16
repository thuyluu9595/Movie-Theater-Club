import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";
import { URL } from "../Constants";
import { getError } from '../utils';
import MessageBox from './MessageBox';
import LoadingBox from './LoadingBox';

const ImageUploadModal = ({ show, onHide, id, userInfo, onImageChange }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Create a preview of the selected file
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        // Free memory when the component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleFileChange = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined);
            return;
        }
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('image', selectedFile);
        setLoading(true);
        setError('');

        try {
            const { data: newUrl } = await axios.post(`${URL}/movies/${id}/movie-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${userInfo.token}`
                }
            });
            setLoading(false);
            onImageChange(newUrl); // Update the parent component's state
            onHide(); // Close the modal on success
        } catch (err) {
            setLoading(false);
            setError(getError(err));
        }
    };

    // Reset state when the modal is closed
    const handleClose = () => {
        setSelectedFile(null);
        setPreview('');
        setError('');
        onHide();
    }

    return (
        // Added custom class for styling
        <Modal show={show} onHide={handleClose} centered className="image-upload-modal">
            <Modal.Header closeButton>
                <Modal.Title>Change Movie Poster</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <MessageBox variant="danger">{error}</MessageBox>}
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Choose a new image file:</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                    </Form.Group>
                    {preview && (
                        <div className="image-preview-container">
                            <p>Image Preview:</p>
                            <img src={preview} alt="Selected preview" className="image-preview" />
                        </div>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} className="btn-modal-close">
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                    className="btn-modal-primary"
                >
                    {loading ? <LoadingBox isButton={true} /> : 'Upload & Change'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImageUploadModal;
