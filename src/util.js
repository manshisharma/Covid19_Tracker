import React from "react";
import numeral from "numeral";

// pulling Circle and popups from the react-leaflet library
// the circle is for making circle on the maps based on the number of cases
// popup is basically a card pops up when clicking on any country giving information about the cases
import { Circle, Popup } from "react-leaflet";  


// defining a schema which will decide the color of the circles and multiplier to 
// determine radius of the circle based on the casesType paased as a props in the function "showDataonMap"
const casesTypeColors = {

  // color scheme for total cases - red
  cases: {
    hex: "#CC1034",
    multiplier: 200,    // multipliers are used to determine the radius of the circle as total cases are large so this is small
  },

  // color scheme for recovered cases - green
  recovered: {
    hex: "#7dd71d",
    multiplier: 300,    // as recovered cases are less than total so multiplier is incresed
  },

  //color scheme for deaths - orange
  deaths: {
    hex: "#fb4443",
    multiplier: 800,    // death cases are less so multiplier is large
  },
};


// function for sorting the total number of cases which is to be shown on the right side of the webpage
export const sortData = (data) => {
  let sortedData = [...data];   // this will copy all the data into this variable

  // writing the condition for the custom sort function
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });

  // return sorted data
  return sortedData;
};


// this function is to format the todayCases/todayRecovered/todayDeaths 
// by adding a '+' sign in front of it and changing into thousands format(....k)
export const prettyPrintStat = (stat) =>
  // if there is any stat for that country then format it in this way otherwise simply return +0
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";


// This function adds the circles and the popups to the map.
export const showDataOnMap = (data, casesType = "cases") => // getting the data and casesType as props and caseType is set to cases as default
  data.map((country) => (

    // circle componnets with some of its attributes defined
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}    // determines the center of the circle to the latitude and longitude location of country
      color={casesTypeColors[casesType].hex}        // determining the colors of the circles based on the schema defined above
      fillColor={casesTypeColors[casesType].hex}    // fill the circles will those colors
      fillOpacity={0.4}   // opacity/transparancy of the color filled in the circles
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier   // determining the radius of the circle using the multiplier from the schema defined
      }
    >
      {/* Popup component when we click on a particular country on the map */}
      <Popup>
        <div className="info-container">
          {/* first div will add the country flag which whic is pulled from the api */}
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>

          {/* Name of the country */}
          <div className="info-name">{country.country}</div>

          {/* total no of cases which is formated to use commas in between */}
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>

          {/* total no of recovered cases which is formated to use commas in between */}
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          
          {/* total no of death cases which is formated to use commas in between */}
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
