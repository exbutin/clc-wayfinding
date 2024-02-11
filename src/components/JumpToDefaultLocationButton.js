import styled from 'styled-components';
import { Button as BootstrapButton } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { defaultLocation, defaultZoomLevel, defaultPitch, defaultBearing} from './Constants';
import { BiHomeCircle } from 'react-icons/bi';

function JumpToDefaultLocationButton({ map }) {
        const [isDefaultLocationOnScreen, setIsDefaultLocationOnScreen] = useState(false);

        const jumpToDefaultLocation = () => {
                map.flyTo({ center: defaultLocation, zoom: defaultZoomLevel, pitch: defaultPitch, bearing: defaultBearing });
                setIsDefaultLocationOnScreen(true); // Set the state to true when the default location is on the screen
        };

        const checkDefaultLocationOnScreen = () => {
                const bounds = map.getBounds();
                if (bounds.contains(defaultLocation)) {
                        setIsDefaultLocationOnScreen(true);
                } else {
                        setIsDefaultLocationOnScreen(false);
                }
        };

        // Listen for the 'moveend' event to check if the default location is still on the screen
        useEffect(() => {
                checkDefaultLocationOnScreen(); // Check for default location on screen when the component is mounted

                map.on('moveend', checkDefaultLocationOnScreen);

                // Clean up the event listener when the component is unmounted
                return () => {
                        map.off('moveend', checkDefaultLocationOnScreen);
                };
        }, [map]);

        return (
                <Button variant={isDefaultLocationOnScreen ? "secondary" : "primary"} onClick={jumpToDefaultLocation}>
                  <BiHomeCircle />
                </Button>
        );
}

export default JumpToDefaultLocationButton;

const Button = styled(BootstrapButton)`
  position: relative;
  z-index: 2;
`;