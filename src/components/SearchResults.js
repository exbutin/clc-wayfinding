import React from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';


function SearchResults() {
    return (
        <SlideDownContainer fluid className="position-fixed w-100 bg-info slide-down" style={{ zIndex: 3, top: '56px', bottom: 0 }}>
            {/* Search results go here */}
        </SlideDownContainer>
    );
}

export default SearchResults;

//edit styles
const SlideDownContainer = styled(Container)`
    &.slide-down {
        animation: slideDown 0.3s ease-in-out;
        box-shadow: 0 0 10px rgba(0, 0, 0, .1); // Add box shadow here
    }

    @keyframes slideDown {
        0% {
            transform: translateY(-100%);
        }
        100% {
            transform: translateY(0);
        }
    }
}`;
