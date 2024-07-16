'use client';

import { useState, useEffect } from 'react';

// Leaflet CSS
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-geosearch/dist/geosearch.css';

// Leaflet
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

// Schemas
import { UseFormSetValue } from 'react-hook-form';
import { WarehouseFormData } from '@/components/form/schemas/warehouseSchema';

const SearchControl = () => {
  const map = useMap();

  useEffect(() => {
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: 'bar',
      showMarker: false,
      showPopup: false,
      marker: false,
      popupFormat: ({ _, result }: any) => result.label,
      resultFormat: ({ result }: any) => result.label,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: false,
      searchLabel: 'Enter address',
      keepResult: false,
    });

    map.addControl(searchControl);
    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
};

const FlyToLocation = ({ location }: { location: LatLngExpression }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(location, map.getZoom(), { duration: 2 });
  }, [location, map]);

  return null;
};

type Props = {
  setValue: UseFormSetValue<WarehouseFormData>;
  location?: LatLngExpression | null;
};

export default function Map({ setValue, location }: Props) {
  const position: LatLngExpression = [-8.65, 115.216667];
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(
    null,
  );

  useEffect(() => {
    if (location) setMarkerPosition(location);
  }, [location]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setMarkerPosition(e.latlng);
        setValue('latitude', e.latlng.lat);
        setValue('longitude', e.latlng.lng);
      },
    });

    return null;
  };

  return (
    <MapContainer
      center={markerPosition || position}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={markerPosition || position}></Marker>
      <MapClickHandler />
      <SearchControl />
      <FlyToLocation location={location || markerPosition || position} />
    </MapContainer>
  );
}
