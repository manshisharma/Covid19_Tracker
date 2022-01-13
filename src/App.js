  // UseState = is basically a veriable in REACT , its short term memory for react, whose value
  // is changed by set<state_name> function

  // UseEffect = Runs a piece of code based on given condition
  // The code inside here runs only once when the component loads and not again
  // if we put "useEffect(()=> {.....},[<variable_name])"" then it runs when component loads as well as when  <variable_name> is changed

  // async-await function -> send a request, wait and then do something

import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,     // Menus display a list of choices on temporary surfaces
  FormControl,  // basically is a dropdown from material-Ui
  Select,       // collects user provided information from a list of options.
  Card,         // makes a card
  CardContent,  // determines the content of cards
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import numeral from "numeral";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import Map from "./Map";
import "leaflet/dist/leaflet.css"; 
// leaflet is a javascript library for interactive maps

// defining different useStates
const App = () => {
  // using the useStates hooks
  // this useState changes the value of variable country to the selected country 
  // from the dropdown which is by default worldwide
  const [country, setInputCountry] = useState("worldwide"); 

  // it is for contaning all the countries data
  const [countryInfo, setCountryInfo] = useState({});

  // update the country to the selected country
  const [countries, setCountries] = useState([]);

  // contains the data mapping of all the countries which is paased to make circles
  // based on number of cases
  const [mapCountries, setMapCountries] = useState([]);

  // makes and array of the countries cases which is then passed in a card component
  // to make a table in the right side
  const [tableData, setTableData] = useState([]);

  // determines the type wheather it is death, recovered or total no. of cases
  const [casesType, setCasesType] = useState("cases");

  // on selecting a different country the mapCenter changes which eventually shifts the 
  // map center to that country, by default the map center is set to India
  const [mapCenter, setMapCenter] = useState({ lat: 20, lng: 77 });

  // controls the zoom of the map which is by default set to 4.
  const [mapZoom, setMapZoom] = useState(4);

  useEffect(() => {
    // This is the API we are using from a site disease.sh - "https://disease.sh/docs/"
    // This API gives all the information about the covid-19 for a particular country along
    // with country details in json format.

    fetch("https://disease.sh/v3/covid-19/all")   // fetching the API which returns all the combined data of deaths, recovered any many more
      .then((response) => response.json())      // getting the response
      .then((data) => {                        // the data which we got is passed to setCountryInfo
        setCountryInfo(data);
      });
  }, []);

  // We can use more than 1 useEffect
  useEffect(() => {
    // async-await function
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")  // returns all the countries wise details of covid related info
        .then((response) => response.json())    // getting response in json format
        .then((data) => {                       
          const countries = data.map((country) => ({   // lopping through all the countries and storing the name and code of country in countries array
            name: country.country,
            value: country.countryInfo.iso2,   // iso2 is the county code like USA,UK,UKR etc
          }));
          let sortedData = sortData(data);   // sortData is a function in utils which sorts the cases in decreasing order 
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();    // function is called
  }, []);

  console.log(casesType);  // for checking the casetype-death,cases,recovered

  // Whenever a country is changed then this function is called
  const onCountryChange = async (e) => {
    // async function takes in the selected country and maps its value(which is country code) to a variable
    const countryCode = e.target.value;

    // Now by default when app renders the data for worldwide should be shown and 
    // when we select any country then the data for that country is to be shown so take 2 urls and
    // check if countryCode is changed 
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    // go to that url and take that data
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);  // Input country is set to that country code
        setCountryInfo(data);       // countryInfo is said to the data fetched
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);  // set the map center to latitude and longitude of that country
        setMapZoom(5);    // Zoom to that country
      });
  };

  return (
    <div className="app">
      <div className="app__left">

        <div className="app__header">
          <h1>COVID-19 Tracker</h1>

          {/* Dropdown */}
          <FormControl className="app__dropdown">

            <Select
              variant="outlined" // Dropdown button is outlined
              value={country}   // It is the value which is shown in the dropdown button
              onChange={onCountryChange}  // Triggers the onCountryChange function whenever we select a country from dropdown
            >
              {/* by default menu item is set to worldwide */}
              <MenuItem value="worldwide">Worldwide</MenuItem>  

              {/* Now what this does is loops through all the countries and put their names in the dropdown */}
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}

            </Select>
          </FormControl>

        </div>

        <div className="app__stats">

          <InfoBox
            onClick={(e) => setCasesType("cases")}  
            // On clicking on this card it sets the casesType to total cases and when the casesType
            // is passed into the map and the chart it shows all the data according to this
            title="Coronavirus Cases"   // title for this info box
            isRed                       // this is to ensure the color is red
            active={casesType === "cases"}   //checks if it is true then this infobox gets active
            cases={prettyPrintStat(countryInfo.todayCases)} // this PrettyPrintStats converts the number into a string and adds a +sign and also converts in xx.x k format
            total={numeral(countryInfo.cases).format(0,0)}   // using numeral fn to add commas in Total cases
          />

          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            // On clicking on this card it sets the casesType to total recoveries and when the casesType
            // is passed into the map it shows all the data according to this
            title="Recovered"
            active={casesType === "recovered"}    //checks if it is true then this infobox gets active
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format(0,0)}     // using numeral fn to add commas in Total recovered
          />

          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed         // To ensure the color is red
            active={casesType === "deaths"}   //checks if it is true then this infobox gets active
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format(0,0)}      // using numeral fn to add commas in Total deaths
          />

        </div>

        <Map
          countries={mapCountries}   // All the data of all countries
          casesType={casesType}    // case type to show circles on map depending upon recovery, death and total cases
          center={mapCenter}       // where should the center of amp lies -> on which country
          zoom={mapZoom}          // Zoom level
        />

      </div>
      {/* Making a single card component  */}
      <Card className="app__right">
        {/* Forming a crd to show the sorted live total cases country wise */}
        <CardContent>
          <div className="app__information">

            <h2>Live Cases by Country</h2>
            <Table countries={tableData} />
            
            {/* Making a line graph depending on the selection of user, if user has selected deaths for eg. then casetype=death is passed */}
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />

          </div>
        </CardContent>

      </Card>
    </div>
  );
};

export default App;
