import React, { useRef, useState, useEffect } from "react";
import { Form, Container as BootstrapContainer, Button } from "react-bootstrap";
import { XLg, House, ArrowLeft } from "react-bootstrap-icons"; // Import the X icon
import SearchResults from "./SearchResults";
import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import the Link component
import { defaultMaxWidth } from "./Constants";
import { useDispatch } from "react-redux";
import { setLastActive } from "../redux/Actions"; // Import setLastActiveLevel instead of setActiveLevel

function SearchBar({ opaque, isScrolled }) {
  const dispatch = useDispatch();
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInput = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    dispatch(setLastActive());
    navigate(-1);
  };

  useEffect(() => {
    setIsFocused(isScrolled);
  }, [isScrolled]);

  const handleBlur = () => {
    setIsFocused(false);
    setShowResults(false);
    searchInput.current.value = ""; // Clear the input value
  };

  const handleClear = () => {
    searchInput.current.value = "";
    searchInput.current.blur();
    handleBlur();
  };

  return (
    <>
      <Container
        fluid
        isFocused={isFocused}
        className={`position-fixed w-100 ${
          isFocused ? "bg-light" : opaque ? "bg-opaque" : "bg-transparent"
        }`}
        style={{ zIndex: 4 }}
      >
        <div className="mx-auto" style={{ maxWidth: defaultMaxWidth }}>
          <BootstrapContainer className="my-3 px-2 d-flex">
            <Link to="/">
              <StyledButton
                variant="outline-primary"
                className="d-flex align-items-center border-0 mr-3 no-hover"
                onClick={handleBackButtonClick} // Use the handleBackButtonClick function when the back button is clicked
              >
                <ArrowLeft className="icon-adjust" />
              </StyledButton>
            </Link>

            <Form.Control
              ref={searchInput}
              type="text"
              placeholder="Search..."
              className="w-100 form-control-md text-center shadow-none custom-focus"
              onFocus={() => {
                setIsFocused(true);
                setShowResults(true);
              }}
              onBlur={handleBlur}
            />
            {isFocused && showResults && (
              <StyledButton
                variant="light"
                className="d-flex align-items-center border-0 ml-3"
                onClick={handleClear}
              >
                <XLg className="icon-adjust" /> {/* Use the X icon */}
              </StyledButton>
            )}

            {location.pathname === "/map" &&
              !isFocused && ( // Only render the home button on the map page and when search bar is not focused
                <Link to="/">
                  <StyledButton
                    variant="outline-primary"
                    className="d-flex align-items-center border-0 ml-3"
                  >
                    <House className="icon-adjust" />
                  </StyledButton>
                </Link>
              )}
          </BootstrapContainer>
        </div>
      </Container>
      {showResults && <SearchResults />}
    </>
  );
}

export default SearchBar;

//edit styles
const Container = styled(({ isFocused, ...otherProps }) => (
  <BootstrapContainer {...otherProps} />
))`
  ${(props) =>
    props.isFocused &&
    `
        box-shadow: 0 0 2px rgba(0, 0, 0, .2);
    `}
`;

// Define a styled-component for the buttons
const StyledButton = styled(Button)`
  .icon-adjust {
    color: grey !important;
    font-size: 30px !important;
  }

  &:hover,
  &:focus,
  &:active {
    background: none !important;
    border-color: inherit !important;
  }
`;
