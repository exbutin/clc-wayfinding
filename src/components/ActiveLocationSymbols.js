import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { defaultSymbolSize } from "./Constants";
import { setSymbols, setActiveSymbol } from "../redux/Actions";

function ActiveLocationSymbols({ map }) {
  const dispatch = useDispatch();
  const activeFilter = useSelector((state) => state.mapButtons.activeFilter);
  const activeLevel = useSelector((state) => state.mapButtons.activeLevel);
  const pins = useSelector((state) => state.database.pins);
  const symbols = useSelector((state) => state.symbols.symbols); // get the symbols data from the Redux store

  useEffect(() => {
    if (!map) return;

    // Check if activeFilter and activeLevel are defined
    if (!activeFilter && !activeLevel) {
      return;
    }
    const filteredData = pins.filter(
      (item) =>
        item.category !== 'section' && // Never include 'section' category
        (
          (!activeFilter && item.level === activeLevel.name) || // If activeFilter is null, only filter on level
          (activeFilter && activeFilter.category.includes(item.category) && item.level === activeLevel.name) // If activeFilter is not null, apply category filter
        )
    );

    console.log("filteredData", filteredData);

    // Set the visibility of all previously active symbols to none, and update the symbols array to currently active symbols
    symbols.forEach((symbol) => {
      // Check if the symbol is not in filteredData
      if (
        !filteredData.some((item) => item._id === symbol._id) &&
        map.getLayer(symbol._id)
      ) {
        map.setLayoutProperty(symbol._id, "visibility", "none");
      }
    });

    dispatch(setSymbols(filteredData));

    // For each item in the filtered data, add a new layer to the map (or if it exists already unhide it)
    filteredData.forEach((item) => {
      const layerId = item._id.toString();

      map.on("click", layerId, function (e) {
        // Set the clicked symbol as the active symbol
        dispatch(setActiveSymbol(item));
      });

      if (map.getLayer(layerId)) {
        // If the layer already exists, just change its visibility to 'visible'
        map.setLayoutProperty(layerId, "visibility", "visible");
      } else {
        // If the layer doesn't exist, add it to the map
        map.loadImage(item.active_image, (error, image) => {
          if (error) throw error;

          if (!map.hasImage(layerId)) {
            map.addImage(layerId, image);
          }

          // Add a new layer to the map
          map.addLayer(
            {
              id: layerId,
              type: "symbol",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: item.coordinates,
                  },
                },
              },
              layout: {
                "icon-image": item.category === "section" ? "" : layerId,
                "icon-size": defaultSymbolSize,
                "icon-pitch-alignment": "map",
                "icon-allow-overlap": true,
              },
            },
            "state-label"
          );
        });
      }
    });
  }, [map, activeFilter, activeLevel, pins]);
}

export default ActiveLocationSymbols;
