import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { options } from "./Constants";
import { Button as BootstrapButton } from "react-bootstrap";
import { colors } from "./Constants";
import { styled } from "styled-components";
import { setActiveFilter, toggleShowAllPins } from "../redux/Actions";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ButtonWithActiveProp = ({ isActive, ...props }) => (
  <BootstrapButton {...props} />
);

const StyledButton = styled(ButtonWithActiveProp)`
  border: 2px solid white;
  color: white;
  background-color: ${(props) =>
    props.isActive ? colors.secondary : "lightgray"};

  &:hover {
    background-color: ${colors.primary}; // Darken the color for hover
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 2;
  max-height: 80vh;
  overflow-y: scroll; // Change to scroll
  top: 50%;
  left: 15px;
  transform: translate(-50%, -50%);

  // Hide scrollbar for Chrome, Safari and Opera
  &::-webkit-scrollbar {
    display: none;
  }

  // Hide scrollbar for IE and Edge
  -ms-overflow-style: none;

  // Hide scrollbar for Firefox
  scrollbar-width: none;
`;

function MapFilterButton() {
  const dispatch = useDispatch();
  const activeFilter = useSelector((state) => state.mapButtons.activeFilter);

  const handleButtonClick = (option) => {
    if (activeFilter && activeFilter.name === option.name) {
      dispatch(setActiveFilter(null)); // Deactivate the filter if the clicked button is already active
    } else {
      dispatch(setActiveFilter(option)); // Activate the filter if the clicked button is not active
    }
  };

  return (
    <ButtonContainer>
      {options.map((option, index) => (
        <StyledButton
          key={index}
          onClick={() => handleButtonClick(option)}
          className="mb-2"
          isActive={activeFilter && activeFilter.name === option.name}
        >
          {option.icon}
        </StyledButton>
      ))}
    </ButtonContainer>
  );
}

export default MapFilterButton;
