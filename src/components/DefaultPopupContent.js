import React from 'react';

const DefaultPopupContent = ({ data }) => {
    return (
        <div>
            {data && data.image && (
                <img src={data.image} alt="Popup content" />
            )}
        </div>
    );
};

export default DefaultPopupContent;