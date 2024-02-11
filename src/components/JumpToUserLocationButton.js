import React, { useState, useEffect, useRef, useCallback } from "react"; // import useCallback
import { Button as BootstrapButton, Spinner } from "react-bootstrap";
import { BiCurrentLocation } from "react-icons/bi";
import mapboxgl from "mapbox-gl";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { updateUserLocation } from "../redux/Actions"; // import the action
import { defaultZoomLevel, defaultPitch, defaultBearing } from "./Constants";
import UserPin from "./UserPin";

const Button = styled(BootstrapButton)`
  position: relative;
  z-index: 2;
`;

function JumpToCurrentLocationButton({ map }) {
  const dispatch = useDispatch();
  const userLocation = useSelector((state) => state.userLocation.userLocation);
  const userLocationRef = useRef(userLocation); // create a ref for the userLocation state

  const [isLoading, setIsLoading] = useState(false);
  const [isUserLocationOnScreen, setIsUserLocationOnScreen] = useState(false);

  const checkUserLocationOnScreen = useCallback(() => {
    // use useCallback to memoize the function
    if (userLocationRef.current) {
      // use the ref instead of the state
      const bounds = map.getBounds();
      const lngLatUserLocation = new mapboxgl.LngLat(
        userLocationRef.current[0],
        userLocationRef.current[1]
      );
      if (bounds.contains(lngLatUserLocation)) {
        setIsUserLocationOnScreen(true);
      } else {
        setIsUserLocationOnScreen(false);
      }
    }
  }, [map]); // add map to the dependency array

  const jumpToCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = [position.coords.longitude, position.coords.latitude];
        map.flyTo({
          center: location,
          zoom: defaultZoomLevel,
          pitch: defaultPitch,
          bearing: defaultBearing,
        });
        dispatch(updateUserLocation(location));
        userLocationRef.current = location; // update the ref immediately after the state changes
        setIsLoading(false);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (map) {
      map.on("idle", checkUserLocationOnScreen);

      return () => {
        map.off("idle", checkUserLocationOnScreen);
      };
    }
  }, [map, checkUserLocationOnScreen]); // add checkUserLocationOnScreen to the dependency array

  return (
    <div>
      <Button
        variant={isUserLocationOnScreen ? "secondary" : "primary"}
        onClick={jumpToCurrentLocation}
      >
        {isLoading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <BiCurrentLocation />
        )}
      </Button>
      {userLocation && <UserPin map={map} coordinates={userLocation} />}
    </div>
  );
}

export default JumpToCurrentLocationButton;
