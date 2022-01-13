import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "./util";   // showDataonMap is the function responsible for the circles and thenpopups on ma

function Map({ countries, casesType, center, zoom }) { // Destructuring the props we can also take the input as props and use as props.xxx
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          // Standard Format of TileLayer from the documentation
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* this showData on map is a function in utils which shows the circles and popups */}
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
}

export default Map;
