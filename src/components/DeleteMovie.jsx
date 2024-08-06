import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function DeleteMovie({ movie, onClose, onDelete }) {
  function handleDelete() {
    const token = localStorage.getItem("token");

    fetch(`https://movieapp-api-lms1.onrender.com/movies/deleteMovie/${movie._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend response:", data);

        if (data.message === "Action Forbidden") {
          Swal.fire({
            title: "Error on Deleting movie",
            icon: "error",
            text: "Only Admin Users can delete movies",
          });
        } else if (data.message === 'Movie deleted successfully') {
          Swal.fire({
            title: 'Success',
            icon: 'success',
            text: 'Movie deleted successfully.',
          }).then(() => {
            onDelete(movie._id);
            onClose(); 
          });
        } else {
          Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Failed to delete movie.',
          });
        }
      })
      .catch((error) => {
        console.error('Error deleting movie:', error);
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'An error occurred while deleting the movie.',
        });
      });
  }

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this movie?</p>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Body>
    </Modal>
  );
}