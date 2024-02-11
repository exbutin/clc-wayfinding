import { useSelector, useDispatch } from "react-redux";
import { setActiveLevel } from "../redux/Actions";
import { Button, ButtonGroup, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import JumpToDefaultLocationButton from "./JumpToDefaultLocationButton";
import JumpToUserLocationButton from "./JumpToUserLocationButton";
import { defaultMaxWidth, colors } from "./Constants";

const StyledContainer = styled.div`
  position: fixed; // Change from relative to fixed
  bottom: 0; // Add this line to position the container at the bottom
  left: 50%; // Center the container horizontally
  transform: translateX(-50%); // Correct the horizontal centering
  width: 100%;
  max-width: ${defaultMaxWidth}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  z-index: 2;
  min-width: 0;
  max-height: 100px;
`;

const StyledButtonGroup = styled(ButtonGroup)`
  flex: 1 1 auto; // This allows the button to shrink and grow as needed
  justify-content: space-between; // This distributes the buttons evenly
  min-width: 0; // This overrides any minimum width
  margin-right: 5px;
  margin-left: 5px;
`;

const StyledButton = styled(Button)`
  flex: 1 1 auto; // This allows the button to shrink and grow as needed
  text-align: center; // This centers the text in the button
  min-width: 0; // This overrides any minimum width
  background-color: ${(props) =>
    props.$pincount === 0
      ? "grey"
      : props.$isActive
      ? "secondary"
      : "primary"} !important;
  color: white !important;
`;

const StyledBadge = styled(Badge)`
  margin-left: 5px;
  background-color: ${(props) =>
    props.$isActive ? colors.primary : colors.secondary} !important;
`;

function MapLevelButtons({ map }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeLevel = useSelector((state) => state.mapButtons.activeLevel);
  const activeFilter = useSelector((state) => state.mapButtons.activeFilter);
  const pins = useSelector((state) => state.database.pins);
  const levels = useSelector((state) => state.database.levels);

  const handleButtonClick = (level) => {
    dispatch(setActiveLevel(level, activeLevel));
    navigate(".", { state: { activeLevel: level } });
  };

  return (
    <StyledContainer>
      <JumpToDefaultLocationButton map={map} />
      <StyledButtonGroup vertical={false}>
        {levels.map((level, index) => {
          // Count how many documents in pins match the filter for this level
          const count =
            !activeFilter || !pins
              ? 0
              : pins.filter(
                  (pin) =>
                    pin && // Check if pin is not null
                    activeFilter.category.includes(pin.category) &&
                    pin.level === level.name
                ).length;

          return (
            <StyledButton
              key={index}
              onClick={() => handleButtonClick(level)}
              variant={
                level.name === activeLevel.name ? "secondary" : "primary"
              }
              $pincount={count} // Pass the count as a prop
            >
              {level.title}
              {
                <StyledBadge
                  variant="info"
                  $isActive={level.name === activeLevel.name}
                ></StyledBadge>
              }
            </StyledButton>
          );
        })}
      </StyledButtonGroup>
      <JumpToUserLocationButton map={map} />
    </StyledContainer>
  );
}
export default MapLevelButtons;
