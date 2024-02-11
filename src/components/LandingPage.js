import React, { useState, useEffect } from "react";
import {
  Card as BootstrapCard,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { setActiveFilter } from '../redux/Actions'; // Import the setActiveFilter action
import { options } from "./Constants";


function LandingPage() {
  //add redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleButtonClick = (option) => {
    dispatch({ type: "SELECT_OPTION", payload: option });
    dispatch(setActiveFilter(option)); // Dispatch the setActiveFilter action with the option of the clicked button
    navigate("/map");
  };

  //Add event listner if scrolled, used to make the searchbar background not opaque
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.pageYOffset > 0);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Container fluid className="p-0 min-vh-100 bg-light overflow-hidden">
      <SearchBar isScrolled={isScrolled} />

      <Container style={{ paddingTop: "70px" }}>
        <Row className="mx-auto" style={{ maxWidth: "750px" }}>
          {options.map((option, index) => (
            <Col xs={12} sm={6} md={4} key={index} className="p-2 mb-0">
              <Button
                variant="link"
                className="p-0 d-block w-100 text-decoration-none mb-0"
                onClick={() => handleButtonClick(option)}
              >
                <Card className="border-0 shadow-sm">
                  <Card.Body className="d-flex align-items-center">
                    <RoundedLeftImage src={option.img} alt={option.name} />
                    <Card.Title className="m-0 flex-grow-1 text-center h6">
                      {option.name}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Button>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

export default LandingPage;

//edit styles
const Card = styled(BootstrapCard)`
  border-radius: 10px;
  outline: none;
  border: none;
  box-shadow: 2.5px 2.5px 10px rgba(0, 0, 0, 0.11);
  .card-body {
    height: 100px;
    display: flex;
    align-items: center; // center content vertically
    padding: 0;
  }
`;

const RoundedLeftImage = styled.img`
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 3px;
`;
