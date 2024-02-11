import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { defaultTextSize } from "./Constants";

function ActiveLevelSections({ map }) {
  const activeLevel = useSelector((state) => state.mapButtons.activeLevel);
  const pins = useSelector((state) => state.database.pins); // get the pins data from the Redux store
  const addedSources = useRef([]); // Keep track of added sources

  useEffect(() => {
    if (!map || !pins) return;

    // Remove old sources
    addedSources.current.forEach((source) => {
      if (map.getLayer(source)) {
        map.removeLayer(source);
      }
      if (map.getSource(source)) {
        map.removeSource(source);
      }
    });
    addedSources.current = []; // Reset the added sources

    // Filter the pins array based on the active level and category
    const activePins = pins.filter(
      (pin) => pin.level === activeLevel.name && pin.category === "section"
    );

    // Loop through the active pins and add each one to the map
    activePins.forEach((pin) => {
      if (!map.getSource(pin._id.toString())) {
        const sourceId = pin._id.toString();
        map.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {
              description: pin.section.toString(),
            },
            geometry: {
              type: "Point",
              coordinates: pin.coordinates,
            },
          },
        });

        map.addLayer({
          id: sourceId,
          type: "symbol",
          source: sourceId,
          layout: {
            "text-field": ["get", "description"],
            "text-size": defaultTextSize,
            "text-font": ["Open Sans Bold"],
            "text-allow-overlap": true,
            "text-pitch-alignment": "map",
          },
          paint: {
            "text-color": "#ffffff",
            "text-halo-color": "#898989",
            "text-halo-width": 1,
          },
        });
        // Move the layer to the top
        map.moveLayer(sourceId);

        // Add the source to the added sources
        addedSources.current.push(sourceId);
      }
    });
  }, [map, pins, activeLevel]); // Listen to changes in pins

  return null;
}

export default ActiveLevelSections;