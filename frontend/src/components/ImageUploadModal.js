import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import axios from "axios";
import {URL} from "../Constants";

const ImageUploadModal = ({ show, onHide, id, userInfo, onImageChange}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleImageChange = (file) => {
        const uploadImage = async () => {
            const formData = new FormData();
            formData.append('image', file);
            setLoading(true);
            try {
                const response = await axios.post(`${URL}/movies/${id}/movie-image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${userInfo.token}`
                    }
                });
                const newUrl = response.data;
                setLoading(false);
                onImageChange(newUrl);
            } catch (err) {
                alert(err.message);
            }
        }
        uploadImage();
    };


    const handleChange = () => {
        // Perform the upload logic to the backend
        handleImageChange(selectedFile);
        // Close the modal
        onHide();

    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Change Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Choose a new image file:</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="success" onClick={handleChange}>
                    {loading ? 'Uploading...' : 'Change Image'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImageUploadModal;