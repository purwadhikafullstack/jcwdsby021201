import * as React from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
import L from 'leaflet';
import { TextField, Button, Box } from '@mui/material';
import {
  errorFetcherNotification,
  errorNotification,
} from '@/utils/notifications';
import axios from 'axios';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import StyledButton from '../button/StyledButton';

/**
 *  - Marker Image
 *  - Search Box
 *  - Handle Search
 */

let DefaultIcon = L.icon({
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface IMapProps {
  onCoordinatesChange: (lat: number, lon: number) => void;
  selectedCoordinates: { lat: number; lon: number } | null;
}

const SearchBox = ({
  onCoordinatesChange,
}: {
  onCoordinatesChange: (lat: number, lon: number) => void;
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const map = useMap();

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: searchQuery,
            format: 'json',
            limit: 1,
          },
        },
      );
      const data = response.data;
      if (data.length > 0) {
        const { lat, lon } = data[0];
        onCoordinatesChange(parseFloat(lat), parseFloat(lon));
        map.setView([parseFloat(lat), parseFloat(lon)], 13);
      } else {
        errorNotification('No results found');
      }
    } catch (error) {
      errorFetcherNotification(error);
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '2%',
        right: '2%',
        zIndex: 1000,
        display: 'flex',
        width: { xs: '50vw', sm: '30vw', md: '10vw', lg: '10vw' },
      }}
    >
      <TextField
        label="Search location"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ backgroundColor: 'white' }}
      />
      <StyledButton onClick={handleSearch} variant="contained" sx={{ ml: 2 }}>
        Search
      </StyledButton>
    </Box>
  );
};

const Map: React.FunctionComponent<IMapProps> = ({
  onCoordinatesChange,
  selectedCoordinates,
}) => {
  const mapTilerUrl =
    'https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=BYGeDJemtYV1P94PH6Ui';
  const mapTilerAttribution =
    '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>';

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        onCoordinatesChange(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    map.setView(center, 13);
    return null;
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <MapContainer
        center={
          selectedCoordinates
            ? [selectedCoordinates.lat, selectedCoordinates.lon]
            : [-6.2088, 106.8456]
        }
        zoom={10}
        scrollWheelZoom={true}
        className="map-container"
        style={{ height: '100%' }}
        zoomControl={true}
      >
        {selectedCoordinates && (
          <ChangeView
            center={[selectedCoordinates.lat, selectedCoordinates.lon]}
          />
        )}
        <TileLayer attribution={mapTilerAttribution} url={mapTilerUrl} />
        <LocationMarker />
        <SearchBox onCoordinatesChange={onCoordinatesChange} />
        {selectedCoordinates && (
          <Marker position={[selectedCoordinates.lat, selectedCoordinates.lon]}>
            <Popup>
              Selected Location: <br /> Latitude: {selectedCoordinates.lat},
              Longitude: {selectedCoordinates.lon}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </Box>
  );
};

export default Map;
