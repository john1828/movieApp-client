import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import UserContext from "../../UserContext";

export default function Register() {

    const {user} = useContext(UserContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isActive, setIsActive] = useState(false);

    console.log(email);
    console.log(password);
    console.log(confirmPassword);

    useEffect(() => {
        if((email !== "" && password !== "" && confirmPassword !== "") && (password === confirmPassword)){

            setIsActive(true)

        } else {

            setIsActive(false)

        }
    }, [email, password, confirmPassword])

    function registerUser(e){
        e.preventDefault();

        fetch("https://movieapp-api-lms1.onrender.com/users/register", {

            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })

        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if(data.message === "Registered Successfully"){
                setEmail("");
                setPassword("");
                setConfirmPassword("");

                Swal.fire({
                  title: "Success!",
                  icon: "success",
                  text: "Registered Successfully",
                });
                navigate("/login");

            } else if (data.error === "Password must be atleast 8 characters") {
              Swal.fire({
                title: "Error!",
                icon: "error",
                text: "Password must be atleast 8 characters",
              });

            }else{
                Swal.fire({
                  title: "Error!",
                  icon: "error",
                  text: "Something went wrong",
                });
            }
        })
    }

    return (
        <Form onSubmit={(e) => registerUser(e)}>
        <h1 className="my-5 text-center">Register</h1>
            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control 
                    type="email" 
                    placeholder="Enter Email" 
                    required
                    value={email}
                    onChange={e => {setEmail(e.target.value)}}
                    />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Enter Password" 
                    required
                    value={password}
                    onChange={e => {setPassword(e.target.value)}}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Confirm Password" 
                    required
                    value={confirmPassword}
                    onChange={e => {setConfirmPassword(e.target.value)}}
                />
            </Form.Group>
            {isActive ?
                <Button variant="primary" type="submit" id="submitBtn">Submit</Button>
                :
                <Button variant="danger" type="submit" id="submitBtn" disabled>Submit</Button>
            }
        </Form>
    )

}