import React from "react";
import styled from "styled-components";

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

  ${({ isGreyedOut }) =>
    isGreyedOut &&
    `
        color: #888;
    `}

  position: relative;
`;

const FabPageLocationContent = ({
  categories,
  selectedSection,
  selectedLocation,
  menus,
}) => {
  return (
    <div>
      {Object.entries(categories).map(([category, items]) => {
        const filteredItems = Object.entries(items).filter(
          ([item, { sections }]) =>
            !selectedSection[selectedLocation] ||
            sections.includes(selectedSection[selectedLocation])
        );
        if (filteredItems.length === 0) return null; // Don't show the category if there are no items
        return (
          <div key={category}>
            <h6>{category}</h6>
            {Object.entries(items).map(([item, { sections, price }]) => {
              const isGreyedOut =
                selectedSection[selectedLocation] &&
                !sections.includes(selectedSection[selectedLocation]);
              return (
                <div key={item}>
                  <ItemGrid isGreyedOut={isGreyedOut}>
                    <h6>
                      {item}
                      {isGreyedOut ? "*" : ""}
                    </h6>
                    <p>${price}</p>
                  </ItemGrid>
                </div>
              );
            })}
          </div>
        );
      })}
      <p>
        * This product is not available at this specific location, click on the
        menu item to see all available locations.
      </p>
    </div>
  );
};

export default FabPageLocationContent;
