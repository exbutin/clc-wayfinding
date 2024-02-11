import React, { useRef, useEffect } from "react";
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

const FabPageProductContent = ({
  products,
  category3,
  selectedItem,
  menus,
}) => {
  // Create a ref for each item
  const itemRefs = useRef({});
  itemRefs.current = products.reduce((acc, product) => {
    acc[product.itemName] = React.createRef();
    return acc;
  }, {});

  // Scroll to the selected item
  useEffect(() => {
    if (selectedItem && itemRefs.current[selectedItem]) {
      itemRefs.current[selectedItem].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedItem]);
  // Filter products by productCategory3
  const filteredProducts = products.filter(
    (product) => product.productCategory3 === category3
  );

  // Group filtered products by productCategory2
  const categories = filteredProducts.reduce((acc, product) => {
    if (!acc[product.productCategory2]) {
      acc[product.productCategory2] = [];
    }
    acc[product.productCategory2].push(product);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(categories).map(([category2, items]) => {
        return (
          <div key={category2}>
            <h6>{category2}</h6>
            {items.map(({ itemName, locations, price }) => {
              return (
                <ItemGrid key={itemName} ref={itemRefs.current[itemName]}>
                  <h6>{itemName}</h6>
                  <p>Available at: {locations.join(", ")}</p>
                  <p>${price}</p>
                </ItemGrid>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default FabPageProductContent;
