import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import mapboxgl from 'mapbox-gl';

function UserPin({ map }) {
    const userLocation = useSelector(state => state.userLocation.userLocation);

    useEffect(() => {
        let marker;

        const addMarker = () => {
            // Remove the old marker if it exists
            if (marker) {
                marker.remove();
            }

            // Create a popup with the text "You are here"
            const popup = new mapboxgl.Popup({ offset: 0, closeButton: false })
                .setText('You are here')
                .on('open', () => {
                    // Add click event listener to the document
                    const removePopup = (event) => {
                        // Check if the click event was triggered by the marker
                        if (!event.target.closest('.mapboxgl-marker')) {
                            popup.remove();
                            // Remove the event listener after the popup is removed
                            document.removeEventListener('click', removePopup);
                        }
                    };
                    document.addEventListener('click', removePopup);
                });

            // Create a new marker and add it to the map
            marker = new mapboxgl.Marker()
                .setLngLat(userLocation)
                .setPopup(popup) // associate the popup with the marker
                .addTo(map);

            // Show the popup by default
            popup.addTo(map);
        };

        if (map && userLocation) {
            addMarker();
        }

        return () => {
            // Remove the marker when the component unmounts
            if (marker) {
                marker.remove();
            }
        };
    }, [map, userLocation]);

    return null;
}

export default UserPin;