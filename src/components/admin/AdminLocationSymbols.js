import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import { updateDatabase, deleteDatabase } from "../../redux/Actions";
import { MapContext } from "../MapContext";
import AdminPinForm from "./AdminPinForm";
import styled from "styled-components";
import { colors } from "../Constants";

const OuterContainer = styled.div`
  position: fixed;
  bottom: 0;
  start: 0;
  end: 0;
  width: 150%; // make the div 150% of the screen width
  z-index: 3;
  padding-top: 1rem; // add padding to the top of the OuterContainer
  overflow: visible; // ensure the button is not hidden
  transform: translateX(-16.75%);
`;

const StyledTopDiv = styled.div`
  border-top-left-radius: 50% 50px;
  border-top-right-radius: 50% 50px;
  overflow: hidden;
  position: relative;
  background-color: ${colors.light};
`;

const CardContainer = styled.div`
  display: flex; // use flexbox
  flex-direction: column; // arrange children vertically
  justify-content: center; // center horizontally
  align-items: center; // center vertically
  position: relative;
  width: 100%; // make the container take up the full width of the StyledTopDiv
  max-width: 1000px; // set a maximum width for the container
  margin: 0 auto; // center the container within the StyledTopDiv
  padding: 0; // remove the padding
`;

const StyledContent = styled.div`
  overflow: auto;
  max-height: 50vh;
  margin: 0; // remove margin
  padding: 20px; // add padding
  padding-top: 0; // remove top padding
  width: 67.5%; // make the content take up the full width of the CardContainer
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const ButtonGroupContainer = styled.div`
  display: flex; // use flexbox
  max-width: 300px; // take up the full width of the parent
  justify-content: space-between; // center horizontally
  width: 100%; // take up the full width of the parent
  padding-bottom: 10px; // add vertical padding
`;

function AdminLocationSymbols() {
  const activeFilter = useSelector((state) => state.mapButtons.activeFilter);
  const activeLevel = useSelector((state) => state.mapButtons.activeLevel);
  const symbols = useSelector((state) => state.symbols.symbols);
  const dispatch = useDispatch();
  const [newCoordinates, setNewCoordinates] = useState(null);
  const [originalCoordinates, setOriginalCoordinates] = useState(null);
  const [mode, setMode] = useState(null);
  const [activeSymbol, setActiveSymbol] = useState(null);
  const map = useContext(MapContext);
  const pins = useSelector((state) => state.database.pins);

  const handleDelete = async () => {
    if (activeSymbol) {
      try {
        dispatch(deleteDatabase("pins", activeSymbol._id));
        if (map.getLayer(activeSymbol._id.toString())) {
          map.removeLayer(activeSymbol._id.toString());
          map.removeSource(activeSymbol._id.toString());
        }
      } catch (error) {
        console.error(`Failed to delete pin: ${error}`);
      } finally {
        setActiveSymbol(null);
        setNewCoordinates(null);
        setOriginalCoordinates(null);
        setMode(null);
      }
    }
  };

  const handleConfirm = async (data) => {
    try {
      if (mode === "move") {
        dispatch(
          updateDatabase("pins", activeSymbol._id, {
            coordinates: [newCoordinates.lng, newCoordinates.lat],
          })
        );
      } else if (mode === "delete") {
        await dispatch(deleteDatabase("pins", activeSymbol._id));
      } else if (mode === "add") {
        if (newCoordinates) {
          const action = updateDatabase("pins", activeSymbol._id, {
            ...data,
            coordinates: [newCoordinates.lng, newCoordinates.lat],
          });
          await dispatch(action);
        } else {
          console.error("Cannot add pin: newCoordinates is null");
        }
      }
    } catch (error) {
      console.error(`Failed to ${mode} pin: ${error}`);
    } finally {
      setActiveSymbol(null);
      setNewCoordinates(null);
      setOriginalCoordinates(null);
      setMode(null);
    }
  };

  const handleCancel = () => {
    if (mode === "move" && activeSymbol && originalCoordinates) {
      map.getSource(activeSymbol._id.toString()).setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [originalCoordinates.lng, originalCoordinates.lat],
        },
      });
    }
    // Add more conditions here if you have more modes
    setActiveSymbol(null);
    setNewCoordinates(null);
    setOriginalCoordinates(null);
    setMode(null);
  };

  useEffect(() => {
    if (!map) return;

    const onClick = function (e) {
      setNewCoordinates(e.lngLat);

      var features = map.queryRenderedFeatures(e.point);
      if (!features || !features.length) {
        return;
      }

      const symbol = symbols.find(
        (symbol) => String(symbol._id) === features[0].layer.id
      );

      const pin = pins.find((pin) => String(pin._id) === features[0].layer.id);

      if (mode === "move" && activeSymbol) {
        // Update the coordinates of the symbol in the data source
        map.getSource(activeSymbol._id.toString()).setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [e.lngLat.lng, e.lngLat.lat],
          },
        });
      } else if (
        pin &&
        pin.category === "section" &&
        pin.level === activeLevel.name
      ) {
        if (activeSymbol && activeSymbol._id === pin._id) {
          // If the clicked pin is the active pin, update its coordinates
          map.getSource(activeSymbol._id.toString()).setData({
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [e.lngLat.lng, e.lngLat.lat],
            },
          });
        } else {
          setActiveSymbol(pin);
          setMode("move");
        }
      } else if (symbol) {
        setActiveSymbol(symbol);
        setMode("move");
      } else {
        if (!activeFilter || !activeLevel) {
          alert("Select a filter and level to add a new symbol to the map");
          return;
        }
        setMode("add");
      }
    };

    map.on("click", onClick);

    return () => {
      map.off("click", onClick);
    };
  }, [map, symbols, activeSymbol, mode, activeFilter, activeLevel]);

  return (
    <OuterContainer className="d-flex flex-column align-items-stretch">
      <StyledTopDiv style={{ position: "relative", zIndex: 4 }}>
        {mode && (
          <CardContainer>
            <h3 style={{ paddingTop: "20px", paddingBottom: "10px" }}>
              {mode === "move" &&
                `Click New Position For: ${activeSymbol.name}`}
              {` (${activeSymbol.section})`}
            </h3>
            <ButtonGroupContainer>
              <Button variant="primary" onClick={handleConfirm}>
                Confirm
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="warning" onClick={() => setMode("edit")}>
                Edit
              </Button>
            </ButtonGroupContainer>
            {(mode === "add" || (mode === "edit" && activeSymbol)) && (
              <StyledContent>
                <AdminPinForm
                  pin={
                    mode === "add"
                      ? {
                          coordinates: newCoordinates,
                          level: activeLevel.name,
                          category: activeFilter.category[0],
                        }
                      : activeSymbol
                  }
                  handleClose={handleCancel}
                />
              </StyledContent>
            )}
          </CardContainer>
        )}
      </StyledTopDiv>
    </OuterContainer>
  );
}

export default AdminLocationSymbols;
