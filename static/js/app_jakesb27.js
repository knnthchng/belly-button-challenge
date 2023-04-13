//jakesb27

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// declare global variables
var dropdownMenu = d3.select("#selDataset");
var demographics = d3.select("#sample-metadata");
var selSample;
var names;
var samples;
var metadata;

// fetch json data from url
d3.json(url).then(function(data) {
  console.log(data);

  // update variables
  names = data.names;
  samples = data.samples;
  metadata = data.metadata;
  selSample = names[0];

  // add id no. to the dropdown list
  names.forEach((name) => dropdownMenu.append("option").text(name));

  // update demographic display for first sample
  metadata.forEach((sample) => {
    if (sample.id == selSample) {
      for (var key in sample) {
        // add new html paragraph element and add id attribute
        demographics.append("p").text(`${key}: ${sample[key]}`).attr("id", `sample-${key}`);
      };
    };
  });

  // create bar chart
  samples.forEach((sample) => {
    if (sample.id == selSample) {
      let xValues = sample.sample_values.slice(0, 10).reverse();
      let yValues = sample.otu_ids.slice(0, 10).reverse();

      let trace1 = {
        x: xValues,
        y: yValues.map(otu => `OTU ${otu}`),
        text: sample.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      };
      Plotly.newPlot("bar", [trace1]);
    };
  });

  // create bubble chart
  samples.forEach((sample) => {
    if (sample.id == selSample) {
      let xValues = sample.otu_ids;
      let yValues = sample.sample_values;

      let trace1 = {
        x: xValues,
        y: yValues,
        text: sample.otu_labels.slice(0, 10).reverse(),
        mode: "markers",
        marker: {
          size: yValues,
          color: xValues,
          colorscale: "Earth"
        }
      };
      Plotly.newPlot("bubble", [trace1]);
    };
  });
});

// function used to update visualizations with new selection
function optionChanged(value) {
  selSample = value;
  updateDemographics();
  updateBarChart();
  updateBubbleChart();
};

// function used to update bar chart
function updateBarChart() {
  samples.forEach((sample) => {
    if (sample.id == selSample) {
      let xValues = sample.sample_values.slice(0, 10).reverse();
      let yValues = sample.otu_ids.slice(0, 10).reverse();

      let trace1 = {
        x: xValues,
        y: yValues.map(otu => `OTU ${otu}`),
        text: sample.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      };
      Plotly.react("bar", [trace1]);
    };
  });
};

// function used to update bubble chart
function updateBubbleChart() {
  samples.forEach((sample) => {
    if (sample.id == selSample) {
      let xValues = sample.otu_ids;
      let yValues = sample.sample_values;

      let trace1 = {
        x: xValues,
        y: yValues,
        text: sample.otu_labels.slice(0, 10).reverse(),
        mode: "markers",
        marker: {
          size: yValues,
          color: xValues,
          colorscale: "Earth"
        }
      };
      Plotly.react("bubble", [trace1]);
    };
  });
};

// function used to update demographics
function updateDemographics() {

  // loop through array to find matching sample id of the selected id
  metadata.forEach((sample) => {
    if (sample.id == selSample) {
      for (var key in sample) {
        // update html element's text with new information using id
        d3.select(`#sample-${key}`).text(`${key}: ${sample[key]}`);
      };
    };
  });
};