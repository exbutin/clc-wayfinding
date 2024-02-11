import { useSelector } from "react-redux";
import { useState } from "react";
import styled from "styled-components";
import FabPageLocationContent from "./FabPageLocationContent";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  grid-gap: 1rem;
  width: 100%;
`;

const LocationCard = styled.div`
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
`;

const FabPage = () => {
  const menuItems = useSelector((state) => state.database.menus);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSection, setSelectedSection] = useState({});
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);

  // Get unique events
  const events = [...new Set(menuItems.map((item) => item.event))];

  // Group the items by location, category and item
  const groupedItems = menuItems.reduce((groups, item) => {
    const key = item.location;
    if (!groups[key]) {
      groups[key] = {};
    }
    const subKey = item.category_2;
    if (!groups[key][subKey]) {
      groups[key][subKey] = {};
    }
    const itemKey = item.item;
    if (!groups[key][subKey][itemKey]) {
      groups[key][subKey][itemKey] = {
        sections: [],
        price: item.price_1,
        event: item.event,
      };
    }
    // Only add the section to the item if it's not already in the item
    if (!groups[key][subKey][itemKey].sections.includes(item.section)) {
      groups[key][subKey][itemKey].sections.push(item.section);
    }
    return groups;
  }, {});

  const locations = Object.keys(groupedItems);

  const handleNextLocation = () => {
    setSelectedLocationIndex((prevIndex) => (prevIndex + 1) % locations.length);
  };

  const handlePreviousLocation = () => {
    setSelectedLocationIndex(
      (prevIndex) => (prevIndex - 1 + locations.length) % locations.length
    );
  };

  const selectedLocation = locations[selectedLocationIndex];
  const categories = groupedItems[selectedLocation];

  return (
    <div className="container mt-3">
      <div className="btn-group mb-3" role="group">
        {events.map((event, index) => (
          <button
            type="button"
            className={`btn ${
              selectedEvent === event ? "btn-secondary" : "btn-primary"
            }`}
            onClick={() => setSelectedEvent(event)}
            key={index}
          >
            {event}
          </button>
        ))}
      </div>
      <Grid>
        <LocationCard>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={handlePreviousLocation}>Previous</button>
            <h5>{selectedLocation}</h5>
            <button onClick={handleNextLocation}>Next</button>
          </div>
          <div className="btn-group mb-3" role="group">
            {categories &&
              Object.values(categories)
                .flatMap((items) =>
                  Object.values(items).flatMap((item) => item.sections)
                )
                .filter(
                  (section, index, self) => self.indexOf(section) === index
                )
                .map((section, index) => (
                  <button
                    type="button"
                    className={`btn ${
                      selectedSection[selectedLocation] === section
                        ? "btn-secondary"
                        : "btn-primary"
                    }`}
                    onClick={() =>
                      setSelectedSection({
                        ...selectedSection,
                        [selectedLocation]: section,
                      })
                    }
                    key={index}
                  >
                    {section}
                  </button>
                ))}
          </div>
        {categories && <FabPageLocationContent
            categories={categories}
            selectedSection={selectedSection}
            selectedLocation={selectedLocation}
            menus={menuItems}
        />}
        </LocationCard>
      </Grid>
    </div>
  );
};

export default FabPage;
