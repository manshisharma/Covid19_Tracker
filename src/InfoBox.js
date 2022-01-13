import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases, total, active, isRed, ...props }) {  //destructuring the props passed as input
  console.log(title, active);
  return (
    // this is the card component which will contain the info of todayDeaths/todayRecovered/todayCases
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${  // infobox--selected is adding a top color to the box
        isRed && "infoBox--red"
      }`}
    >
      <CardContent>
        {/* Typography is the display of the text */}
        <Typography color="textPrimary" gutterBottom>
          {/* The em unit for gutterBottom is relative like gutterBottom: {marginBottom: '0.35em',}, */}
          <strong><italic>{title}</italic></strong>
        </Typography>

        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}> 
        {/* this insures that isRed is not passed as a props so that it can color the text and border green */}
          {cases}
        </h2>

        <Typography className="infoBox__total" color="textSecondary">
          Total {title} - {total} 
        </Typography>

      </CardContent>
    </Card>
  );
}

export default InfoBox;
