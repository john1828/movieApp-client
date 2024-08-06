import {Button, Row, Col} from 'react-bootstrap'
import { Link } from "react-router-dom";

export default function Home(){

	const data = {
        title: "Movie App",
        content: "Dive into the World of Movies – Watch, Rate, Repeat!",
        destination: "/register",
        buttonLabel: "Register now!"
    }

	return (
		<Row>
			<Col className="text-center mt-5">
				<h1>{data.title}</h1>
				<p>{data.content}</p>
				<Button variant="primary" as={Link} to={data.destination}>{data.buttonLabel}</Button>
			</Col>
		</Row>
	)
}