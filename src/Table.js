import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries }) { // destructuring the props
  return (
    <div className="table">
      {/* this will loop through all the countries and put the country name and country case in one table row */}
      {countries.map((country) => (
        <tr>
          <td>{country.country}</td>
          <td>
            {/* this will seperate the cases by commas */}
            <strong>{numeral(country.cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
