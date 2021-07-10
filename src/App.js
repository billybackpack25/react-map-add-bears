import React from 'react';

// Google Map
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from '@react-google-maps/api';

// Date formatting
import { formatRelative } from 'date-fns';

// Manage auto complete search box 
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng
} from 'use-places-autocomplete';

// Display search results
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption
} from '@reach/combobox';

import '@reach/combobox/styles.css';
import mapStyles from './mapStyles';

// Additional librarys for google places search
// Creating here so that React doesn't re-render
const libraries = ['places'];
// Styling the map to fit div
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};
// Setting initial center of map
const center = {
  lat: 51.586243260776634, 
  lng: -2.9976502496217385,
};
// Additional options for the map
const options = {
  styles: mapStyles, // Styling the map using Snazzy Maps Style
  disableDefaultUI: true, // Removing all default UI components
  // Add components we want
  zoomControl: true,

}



export default function App() {
  // isLoaded - Let's us know when the map is ready
  const {isLoaded, loadError} = useLoadScript({
    // Provide google API key
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    // Additional librarys for google places search
    libraries,
  });

  // Store the map marker positions
  const [markers, setMarkers] = React.useState([]);
  // Current selected marker the user wants to see details for
  const [selected, setSelected] = React.useState(null);

  // useCallback hook to prevent re-renders on new markers onClick
  // Function always retains the same value unless the depth changes that's passed in
  const onMapClick = React.useCallback((event) => {
    // Set the map markers, adding to prev
    setMarkers(current => [...current, {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date(),
    }]);
  }, []);

  // Create a reference to the actual map instance
  // Retain state without causing re-renders
  const mapRef = React.useRef();
  // Callback to load map without causing re-renders
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, [])

  // Pan to function to go to the place on the map
  // useCallback so that it only ever creates one of these functions
  const panTo = React.useCallback(({lat, lng}) => {
    // Get the map reference that we set up and pan to that location
    mapRef.current.panTo({lat, lng});
    // Also increase the map zoom
    mapRef.current.setZoom(20);
  },[])

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <div>
      {/** Add a logo in the corner of the map */}
      <h1>
        Bears 
        <span role="img" aria-label='tent'>
          ⛺
        </span>
      </h1>

      {/** Search bar 
      * panTo = function to allow the search box to pan the map to the selected suggestion
      */}
      <Search panTo={panTo}/>
      <Locate panTo={panTo}/>
      

      {/** Google Map */}
      <GoogleMap 
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options} // styling, UI
        onClick={onMapClick} // When the user clicks the map
        onLoad={onMapLoad}
      >
        {/** Markers are added as child components 
              the <Marker /> comes with GoogleMap
              Setting key to exact time in ISO format (2021-07-09T20:12:41.210Z)
        */}
        {markers.map((marker) => (
          <Marker 
            key={marker.time.toISOString()} 
            position={{lat: marker.lat, lng: marker.lng}} 
            // Override the red marker
            icon={{
              // URL image of the icon
              url: '/paw.svg',
              // Re-size the marker so that it's not too large
              scaledSize: new window.google.maps.Size(30, 30),
              // Change the origin to make the marker appear at center of click
              origin: new window.google.maps.Point(0,0),
              anchor: new window.google.maps.Point(15, 15) // Half of scaledSize = middle
            }}
            // Store the selected marker when clicked
            onClick={() => {
              setSelected(marker);
            }} 
            />
        ))}

        { /** Check to see if user has clicked a marker, if so, show info window 
                position = Info box position
                onCloseclick = When it's closed down, set selected back to null so that 
                  it can be used again to open another pop-up
                Children = Info in the pop-up box
        */
          selected ? (
            <InfoWindow 
              position={{lat: selected.lat, lng: selected.lng}} 
              onCloseClick={() => {
                setSelected(null);
              }}
            >
              <div>
                <h2> Bear Spotted!</h2>
                {/** format time relative to now, e.g. today at 9AM */}
                <p>Spotted {formatRelative(selected.time, new Date())}</p>
              </div>
          </InfoWindow>
          ) : null }
      </GoogleMap>
    </div>
  );
};

/** Get users current location
 * 
 * @param {*} param0 
 */
function Locate({ panTo }){
  return (
    <button 
      className="locate" 
      onClick={() => {
        navigator.geolocation.getCurrentPosition(({coords: {latitude:lat, longitude:lng}}) => {
          panTo({lat: lat, lng: lng});
          }, (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
          }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
      }}
      >
      <img src="/compass.svg" alt="compass - locate - me" />
    </button>
  )
}

/**
 * Allow the user to search for an address
 * @param {panTo} pan the map to the selected lat, lng 
 */
function Search({ panTo }) {
  /** Hook retruns 
   * ready = is it ready? places api added.
   * value = current value in the search box
   * suggestions = what suggestions are being returned by the API
   *    + status, + data of said suggetions 
   * setValue = set the value
   * clearSuggestion = Clears out all of the suggestions
   *  
   * */ 
  const {
    ready, 
    value, 
    suggestions: {status, data}, 
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    // If the user is searching, it will refer to place near this location
    requestOptions: {
      location: {
        // Wants to call a function to get the value
        lat: () => 51.586243260776634, 
        lng: () => -2.9976502496217385,
      },
      // How far around the point are we refering locations for
      radius: 200 * 1000 // Meters by default, set to 200 KM as 1000 meters in a KM
    }
  });

  return (
    <div className='search'>
      {/** Box for user to search */}
      <Combobox 
        // Making it async because we're going to use promises 
        onSelect={async (address) => {
          // Set the value of the suggestion to be the address selected 
          // Also shouldFetch = false , no need to go to API again
          // This is done so that the suggestions go away when place already chosen
          setValue(address, false);
          clearSuggestions();
          try {
            // We need to try and find the location of the suggested option
            // e.g. Cardiff, UK => 51.484905853852865, -3.1789589937142884
            // Take the address and pass it to the Places API function
            const results = await getGeocode({address});
            // Extract the latLng from the result - yay!
            const {lat, lng} = await getLatLng(results[0])
            // Now we want to take that lat, lng and call a function to pan there
            panTo({lat, lng});
          } catch(error) {
              console.log("Error!")
          }
        }}
      >

      <ComboboxInput 
        // Input display the value from usePlacesAutocomplete hook
        value={value} 
        // Set API hook value to input text 
        onChange={(e) => {
          setValue(e.target.value);
        }} 
        // Disable if the places API is not ready
        disabled={!ready}
        // Default text in the input
        placeholder='Enter an address'
        
        />
      
      {/** Show suggestions when typing */}
      <ComboboxPopover>
        <ComboboxList>
          {
            // Check suggestions status
            // If ok, desconstruct id and description available to each suggestion
            status === "OK" && 
              data.map(({place_id, description}) => (
                <ComboboxOption key={place_id} value={description} />
            ))}
          </ComboboxList>
      </ComboboxPopover>


    </Combobox>
  </div>
  )








}

