import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import ImageOverlay from "./ImageOverlay";
import MapLevelButtons from "./MapLevelButtons";
import MapFilterButton from "./MapFilterButton";
import MapInitializer from "./MapInitializer";
import ActiveLocationSymbols from "./ActiveLocationSymbols";
import InactiveLocationSymbols from "./InactiveLocationSymbols";
import SectionNumbers from "./SectionNumbers";
import UserPin from "./UserPin";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapContext } from "./MapContext";
import SitePopup from "./SitePopup";

function MapComponent({ children }) {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const activeSymbol = useSelector((state) => state.symbols.activeSymbol);

  return (
    <MapContext.Provider value={map}>
      <SearchBar opaque={true} />
      <MapFilterButton map={map} />
      <MapInitializer mapContainerRef={mapContainerRef} setMap={setMap} />
      {map && <MapLevelButtons map={map} />}
      <div
        ref={mapContainerRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 0,
          width: "100%",
        }}
      ></div>
      {map && <ImageOverlay map={map} />}
      {map && <SectionNumbers map={map} />}
      {map && <ActiveLocationSymbols map={map} />}
      {map && <UserPin map={map} />}
      {activeSymbol && <SitePopup data={activeSymbol} />}
      {children}
    </MapContext.Provider>
  );
}

export default MapComponent;
