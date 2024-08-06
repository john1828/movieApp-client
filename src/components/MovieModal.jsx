import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const MovieModal = ({ movie, show, onHide, onUpdate }) => {
  const [comment, setComment] = useState('');

  if (!movie) return null;

  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`https://movieapp-api-lms1.onrender.com/movies/addComment/${movie._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (data.message === "comment added successfully") {
        // Show success alert
        Swal.fire({
          title: 'Comment Added',
          icon: 'success',
          text: 'Your comment was added successfully.',
        });

        setComment('');

        onUpdate(data.updatedMovie);

      } else {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'There was an error adding your comment.',
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'An error occurred while adding your comment.',
      });
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="md">
      <Modal.Header closeButton>
        <Modal.Title>{movie.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Director:</h5>
        <p>{movie.director}</p>
        <h5>Year:</h5>
        <p>{movie.year}</p>
        <h5>Description:</h5>
        <p>{movie.description}</p>
        <h5>Genre:</h5>
        <p>{movie.genre}</p>
        <h5>Comments:</h5>
        <ul>
          {movie.comments.map((comment) => (
            <li key={comment._id}>{comment.comment}</li>
          ))}
        </ul>
        <Form onSubmit={handleAddComment}>
          <Form.Group controlId="formComment">
            <Form.Label>Add a Comment:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Submit
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MovieModal;