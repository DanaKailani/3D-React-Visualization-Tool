import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import * as d3 from "d3";
import Graph from './components/Graph.js'

// Random function

const random = (a, b) => a + Math.random() * b;



// Fetch Data from CSV

fetch('./dummy_data.csv')
    .then(r => r.text())
    .then(d3.csvParse)
    .then(data => {
      const nodes = [];
      let topicName = ""
      let KPIsList = [];
      data.forEach((d, index) => {

        d.id = index
        // Generating an offset for each planet to be placed randomly on orbit
        d.offset = random(0, Math.PI * 2)

        if (d.type === "topic") {
          topicName = d.name
        }
        else{
          nodes.push(d)
        }
      });
      // This part can be changed depending on columns in CSV
      // Slice Indexes: startIndex: first KPI column - endIndex: last KPI Column
      KPIsList = Object.keys(data[0])
      KPIsList = KPIsList.slice(2, KPIsList.length - 4) // -4 because we added two columns and we already need to pop that last two

      // ReactDOM render wrapped up inside "fetch" because fetch is asynchronous)
      const rootElement = document.getElementById("root");

      ReactDOM.render(
        <StrictMode>
          <Graph data = {nodes} KPIsList = {KPIsList} topicName = {topicName}/>
        </StrictMode>,
        rootElement
      );

    })
