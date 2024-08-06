import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function EditMovie({ movie, onClose, onUpdate }) {

  const [title, setTitle] = useState(movie.title);
  const [director, setDirector] = useState(movie.director);
  const [year, setYear] = useState(movie.year);
  const [description, setDescription] = useState(movie.description);
  const [genre, setGenre] = useState(movie.genre);

  function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch(`https://movieapp-api-lms1.onrender.com/movies/updateMovie/${movie._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, director, year, description, genre }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend response:", data);

        if (data.message === "Action Forbidden") {
          Swal.fire({
            title: "Error on Editing movie",
            icon: "error",
            text: "Only Admin Users can edit movies",
          });
        } else if (data.message == "Movie updated successfully") { 
          Swal.fire({
            title: "Success",
            icon: "success",
            text: "Movie updated successfully.",
          });
          onUpdate({ ...movie, title, director, year, description, genre }); 
          onClose(); 
          console.log(data)
        } else {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "Failed to update movie.",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating workout:", error);
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "An error occurred while updating the movie.",
        });
      });
  }

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Movie</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Director</Form.Label>
            <Form.Control
              type="text"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Year</Form.Label>
            <Form.Control
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Genre</Form.Label>
            <Form.Control
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </Form.Group>
          <Button className="mt-3" variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}