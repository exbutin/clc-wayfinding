import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import {
  Container,
  ButtonGroup,
  Button,
  Card as BootstrapCard,
} from "react-bootstrap";
import styled from "styled-components";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-gap: 1rem;
  width: 100%;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;

  & > h6 {
    text-align: left;
  }

  & > p {
    text-align: right;
  }
`;

const StyledButtonGroup = styled(ButtonGroup)`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;

  & > .btn {
    flex: 1;
  }

  &:focus,
  &:active {
    outline: none;
    box-shadow: none;
    border: none;
  }
`;

const Card = styled(BootstrapCard)`
  border-radius: 10px !important;
`;

const CardHeader = styled(BootstrapCard.Header)`
  border-top-left-radius: 10px !important;
  border-top-right-radius: 10px !important;
`;

const FabPopupContent = ({ data, nonScrollableContentRef }) => {
  const menuItems = useSelector((state) => state.database.menus);

  // Get unique events
  const events = useMemo(
    () => [...new Set(menuItems.map((item) => item.event))],
    [menuItems]
  );

  // State for selected event
  const [selectedEvent, setSelectedEvent] = useState(events[0]);

  // Filter the menu items based on the location, section, and event from the data prop
  const filteredItems = Array.isArray(menuItems)
    ? menuItems.filter(
        (item) =>
          item.location === data.name &&
          item.section === data.section &&
          item.event === selectedEvent
      )
    : [];

  // Group the items by category_1 and category_2 and ensure items are unique
  const groupedItems = filteredItems.reduce((groups, item) => {
    const key = item["category_1"];
    if (!groups[key]) {
      groups[key] = {};
    }
    const subKey = item["category_2"];
    if (!groups[key][subKey]) {
      groups[key][subKey] = [];
    }
    // Only add the item to the group if it's not already in the group
    if (!groups[key][subKey].find((i) => i.name === item.item)) {
      groups[key][subKey].push({ name: item.item, price: item.price_1 });
    }

    // Sort the items within each category
    groups[key][subKey].sort((a, b) => a.name.localeCompare(b.name));

    return groups;
  }, {});

  return (
    <Container fluid>
      <StyledButtonGroup>
        {events.map((event, index) => (
          <Button
            key={index}
            className={
              event === selectedEvent ? "btn-secondary" : "btn-primary"
            }
            onClick={() => setSelectedEvent(event)}
          >
            {event}
          </Button>
        ))}
      </StyledButtonGroup>
      {filteredItems.length > 0 ? (
        <Grid>
          {Object.entries(groupedItems).map(([category1, subGroups], index) => {
            const subGroupEntries = Object.entries(subGroups);
            return (
              <Card key={index} className="shadow-sm bg-info">
                <CardHeader className="bg-primary text-white font-weight-bold text-uppercase h4">
                  {category1}
                </CardHeader>
                <Card.Body>
                  {subGroupEntries.map(([category2, items], index) => (
                    <div key={index}>
                      <h5 className="font-weight-bold text-uppercase">
                        {category2}
                      </h5>
                      {items.map((item, index) => (
                        <ItemGrid key={index}>
                          <h6 className="font-weight-normal">{item.name}</h6>
                          <p>{item.price}</p>
                        </ItemGrid>
                      ))}
                      {index < subGroupEntries.length - 1 && <hr />}
                    </div>
                  ))}
                </Card.Body>
              </Card>
            );
          })}
        </Grid>
      ) : (
        <p>This stand is not open for {selectedEvent} events</p>
      )}
    </Container>
  );
};

export default FabPopupContent;
