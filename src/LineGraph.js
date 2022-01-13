import React, { useState, useEffect } from "react";
// documentation for linegraph-chart.js - https://www.educative.io/edpresso/how-to-use-chartjs-to-create-charts-in-react
import { Line } from "react-chartjs-2";   // React-charts-2 is a library that provides different charts to use in React applications. It is a wrapper for the popular JavaScript charts library Charts. js.
import numeral from "numeral";   // for operations on numbers like adding commas, or displaying them in thousands or millions


// refer this link for standard format of options - https://stackoverflow.com/questions/67931980/title-is-undefined-in-react-chart or
// https://cloudstack.ninja/parth-arora/not-able-to-make-a-perfect-linear-graph-using-chart-js-in-a-react-js-webb-app/
const options = {
  legend: {
    display: false,  // legend will ot be displayed on the map
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,

  // Refer this tooltip documentation - https://www.chartjs.org/docs/2.9.4/configuration/tooltip.html
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },

  // setting up the scales for both the x and y axis.
  scales: {
    xAxes: [
      {
        type: "time",   // the type of the x axis is time
        time: {
          format: "MM/DD/YY",   // The format of displaying the items is in this format
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,   // gridlines for the y axis is not displayed
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");   // this callbackfunction will type cast the number of cases in ...k format
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];  // empty chartdata array which will contains all the datapoints as {x,y}
  let lastDataPoint;    // lastDatapoint is the data of previous day of the day into consideration
  for (let date in data.cases) {
    if (lastDataPoint) {
      // making a new data point of cordinates x and y
      let newDataPoint = {
        x: date,      // on the x axis of the graph we have the dates 

        // now as the data can be considered as 2d array so the number of 
        // cases of a particular category on a particular date is accessed as data[casetype][data]
        y: data[casesType][date] - lastDataPoint,   // on y axis we have the difference of cases of two consecutive days
      };
      chartData.push(newDataPoint);   // push the new data point created into the resultant array
    }
    lastDataPoint = data[casesType][date];  // update the previous data point
  }
  return chartData;  // return the resulatant array
};

function LineGraph({ casesType='cases' }) {  // passing the casetype as props so that we can put them in the geading of chart
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      // this api returns in format {cases:{.....},recovered{....},deaths{....}}
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")  //fetching the last 120 days data of cases, recovered and deats from the api
        .then((response) => {         // getting the response
          return response.json();
        })
        .then((data) => {   // mapping the got data to the function which will return an array of datapoints {x,y} where x is the date and y is the cases
          let chartData = buildChartData(data, casesType);
          setData(chartData);      // setting the chartdata by using useState fn as initially it is empty
          console.log(chartData);
          // buildChart(chartData);
        });
    };

    fetchData();
  }, [casesType]);

  return (
    <div>
      {/* This is standard format refer - https://stackoverflow.com/questions/67931980/title-is-undefined-in-react-chart */}
      {/* here this data is the chartData which contains all the points {x,y} which we have set using useState  */}
      {data?.length > 0 && (   // checking that if data is there and is empty or not
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",    //setting the background color for the line chart 
                borderColor: "#CC1034",  // setting the border color
                data: data,
              },
            ],
          }}
          options={options}  // it will contains the tooltips, styles, type nad format of x axis and ticks on y axis
        />
      )}
    </div>
  );
}

export default LineGraph;
