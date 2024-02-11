import { useEffect } from "react";
import { useSelector } from "react-redux";
import { venueImageCoordinates } from "./Constants";

function ImageOverlay({ map }) {
  const levels = useSelector((state) => state.database.levels);
  let activeLevel = useSelector((state) => state.mapButtons.activeLevel);

  // Change the visibility of the layers when the activeLevel changes
  useEffect(() => {
    if (!map) return;
    levels.forEach((level) => {
      if (map.getSource(level.name)) {
        map.removeLayer(level.name);
        map.removeSource(level.name);
      }

      map.moveLayer("road-path", 'road-pedestrian-case');
      map.moveLayer("bridge-path-bg", 'road-pedestrian-case');
      map.moveLayer("bridge-path", 'road-pedestrian-case');
      map.moveLayer("transit-label", 'road-pedestrian-case');

      if (!map.getSource(activeLevel.name)) {
        // Add the source and layer for the overlay with the imageUrl and coordinates
        map.addSource(activeLevel.name, {
          type: "image",
          url: activeLevel.url,
          coordinates: venueImageCoordinates,
        });
        map.addLayer(
          {
            id: activeLevel.name,
            source: activeLevel.name,
            type: "raster",
          },
          "road-minor-low"
        );
      }
    });
  }, [map, activeLevel, levels]); 
}

export default ImageOverlay;