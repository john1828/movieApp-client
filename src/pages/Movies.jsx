import { useState, useEffect, useContext } from "react";
import { Form, Button, Table } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import UserContext from "../../UserContext";
import Swal from "sweetalert2";
import EditMovie from "../components/EditMovie";
import DeleteMovie from "../components/DeleteMovie";
import MovieModal from '../components/MovieModal'; 


export default function Movies() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [director, setDirector] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  useState(null);
  const [deletingMovie, setDeletingMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null); 
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://movieapp-api-lms1.onrender.com/movies/getMovies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.movies && Array.isArray(data.movies)) {
          setMovies(data.movies);
        } else {
          console.error("Data.movies is not an array:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchMovies();
  }, []);

  function addMovie(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch("https://movieapp-api-lms1.onrender.com/movies/addMovie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        director: director,
        year: year,
        description: description,
        genre: genre
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Movie already exists") {
          Swal.fire({
            title: "Error on Adding movie",
            icon: "error",
            text: "Movie already exist",
          });
        } else if (data.message === "Action Forbidden") {
          Swal.fire({
            title: "Error on Adding movie",
            icon: "error",
            text: "Only Admin Users can add movies",
          });
        } else if (data) {
        	console.log(data)
          setTitle("");
          setDirector("");
          setYear("");
          setDescription("");
          setGenre("");
          setMovies((prevMovies) => [...prevMovies, data]);

          Swal.fire({
            title: "Success on Adding Movie",
            icon: "success",
            text: "Movie Added Successfully.",
          });

        } else {
          Swal.fire({
            title: "Error on Adding Movie",
            icon: "error",
            text: "Unsuccessful Movie Creation",
          });
        }
      });
  }

  console.log(movies);

  const handleShowMovieModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handleHideMovieModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  const handleUpdateMovie = (updatedMovie) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie._id === updatedMovie._id ? updatedMovie : movie
      )
    );
  };

  return (
    <>
      	<h1 className="text-center mt-5">Add a Movie</h1>
        <Form onSubmit={(e) => addMovie(e)}>
          <Form.Group>
            <Form.Label>Title:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Movie title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Director:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Director's name"
              required
              value={director}
              onChange={(e) => setDirector(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Year:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Year of the movie"
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Description of the movie"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Genre:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Movie genre"
              required
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="my-3">
            Submit
          </Button>
        </Form>

        <h1 className="text-center my-4"> My Movies</h1>
                     
              <Table striped bordered hover responsive>
                  <thead>
                      <tr className="text-center">
                          <th>Title</th>
                          <th>Director</th>
                          <th>Year</th>
                          <th>Description</th>
                          <th>Genre</th>
                          <th>Comments</th>
                          <th colSpan="2">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                    {movies.map((movie) => (
                      <tr key={movie._id}>
                          <td className="text-center">
                            <Button variant="link" onClick={() => handleShowMovieModal(movie)}>
                              {movie.title}
                            </Button>
                          </td>
                          <td>{movie.director}</td>
                          <td>{movie.year}</td>
                          <td>{movie.description}</td>
                          <td>{movie.genre}</td>
                          <td>
                            {movie.comments.map((comment) => comment.comment).join(', ')}
                          </td>
                          <td colSpan="2" className="text-center">
                            <Button className="my-2"
                              variant="warning"
                              onClick={() => setEditingMovie(movie)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => setDeletingMovie(movie)}
                            >
                              Delete
                            </Button>
                          </td>
                      </tr>
                    ))}
                  </tbody>
              </Table>  

              {editingMovie && (
                <EditMovie
                  movie={editingMovie}
                  onClose={() => setEditingMovie(null)}
                  onUpdate={(updatedMovie) => {
                    setMovies((prevMovies) =>
                      prevMovies.map((w) =>
                        w._id === updatedMovie._id ? updatedMovie : w
                      )
                    );
                    setEditingMovie(null);
                  }}
                />
              )}

              {deletingMovie && (
                <DeleteMovie
                  movie={deletingMovie}
                  onClose={() => setDeletingMovie(null)}
                  onDelete={(deletedMovieId) => {
                    setMovies((prevMovies) =>
                      prevMovies.filter((w) => w._id !== deletedMovieId)
                    );
                    setDeletingMovie(null);
                  }}
                />
              )}

              <MovieModal
                movie={selectedMovie}
                show={showModal}
                onHide={handleHideMovieModal}
                onUpdate={handleUpdateMovie}
              />
    </>
  );
}
