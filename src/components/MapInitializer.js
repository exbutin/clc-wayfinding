import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { defaultBearing, defaultLocation, defaultZoomLevel } from './Constants';

const mapbox = {
  username: "exbutin",
  accessToken:
    "pk.eyJ1IjoiZXhidXRpbiIsImEiOiJjbHA3dWR2YXcwbXFhMmxvaTA4OGl4bHE5In0.EJDsfDbDQ8FywOdE9VVlbQ",
};

function MapInitializer({ mapContainerRef, setMap }) {
    useEffect(() => {
        mapboxgl.accessToken = mapbox.accessToken;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: defaultLocation,
            zoom: defaultZoomLevel,
        });

        map.on("load", () => {
            setMap(map);

            map.setBearing(defaultBearing);

            map.getStyle().layers.forEach((layer) => {
                if (layer.id.includes("poi-label")) {
                    map.removeLayer(layer.id);
                }
            });
        });

        return () => {
            map.remove();
        };
    }, [mapContainerRef, setMap]);

    return null;
}

export default MapInitializer;