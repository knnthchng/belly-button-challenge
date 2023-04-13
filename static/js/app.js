// 1) Use the D3 library to read in samples.json from the given URL below

// Get the URL
const URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Declare variables
var names;
var samples;
var metadata;

// Call data from API and then log them into the declared variables
d3.json(URL).then(function(data) {
    console.log(data);
});

// 2) Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual:
// Use "sample_values" as the values for the bar chart, otu_ids as the labels for the bar chart,
// ... and otu_labels as the hovertext for the chart.

function dispBARchart (selected_id) {
    // Fetch data from JSON
    d3.json(URL).then((data) => {
    let sampleData = data.samples;
    // Filter data for the object with currently selected subject ID number
    let resultArray = sampleData.filter(subject => subject.id == selected_id);
    let result = resultArray[0];
    // Get the relevant data (sample_values, otu_ids, otu_labels)
    let sample_vals = result.sample_values;
    let otu_id = result.otu_ids;
    let otu_taxa = result.otu_labels;
    // Slice the datasets to just the top 10, and rearrange in descending order
    let sliced_samples = sample_vals.slice(0, 10);
    let sliced_otu_id = otu_id.slice(0, 10);
    let top_OTUs = [];
    let sliced_otu_taxa = otu_taxa.slice(0, 10);
    console.log(sliced_samples, sliced_otu_id, sliced_otu_taxa);
    // Concatenate the top OTU IDs into strings for the bar plot
    for (let i = 0; i < sliced_otu_id.length; i++) {
        let OTU = "OTU " + sliced_otu_id[i];
        top_OTUs.push(OTU);
    };
    // Assemble the plot parameters
    let traceData = {
        x: sliced_samples,
        y: top_OTUs,
        text: sliced_otu_taxa,
        type: "bar",
        orientation: "h",
        transforms: [{
            type: 'sort',
            target: 'x',
            order: 'ascending'
        }]
    };
    let layout = {
        title: "10 Most Common Bellybutton Microorganisms (OTUs) Found"
    };
    Plotly.newPlot("bar", [traceData], layout)
    })
};


// 3) Create a bubble chart that displays each sample.
// Use otu_ids as x-values and to determine marker colors, sample_values for y-values and marker size,
// Use otu_labels for the hovertext.

function dispBBLchart (selected_id) {
    d3.json(URL).then((data) => {
        let sampleData = data.samples;
        let resultArray = sampleData.filter(subject => subject.id == selected_id);
        let result = resultArray[0];

        let otu_id = result.otu_ids;
        let sample_vals = result.sample_values;
        let otu_taxa = result.otu_labels;

        let traceData = {
            x: otu_id,
            y: sample_vals,
            text: otu_taxa,
            mode: "markers",
            marker: {
                size: sample_vals,
                color: otu_id,
                colorscale: "Portland"
            }
        };

        let layout = {
            title: "Bellybutton Microbiota Present",
            xaxis: {title: "OTU ID"}
        };
        Plotly.newPlot("bubble", [traceData], layout)
    })
};

// 4) Display the sample metadata

function dispMetadata (selected_id) {
    d3.json(URL).then((data) => {
        let metadata = data.metadata;
        // Filter data for the object with currently selected subject ID number
        let resultArray = metadata.filter(subject => subject.id == selected_id);
        let result = resultArray[0];
        // Use d3 to select the HTML element for "#sample-metadata"
        let PANEL = d3.select("#sample-metadata");

        // Clear prior existing metadata
        PANEL.html("");

        // Append new metadata
        for (key in result){
            PANEL.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
        };
    });
};

// 5) Update the page when a new sample is selected (through a dropdown menu)
function optionChanged(value) {
    dispBARchart(value);
    dispMetadata(value);
    dispBBLchart(value);
};

// Initialize
function init() {
    // Dropdown menu code
    let ddMenu = d3.select("#selDataset");
    // Retrieve the names from the dataset
    d3.json(URL).then((data) => {
        let names = data.names;
        // Add the ID/names to the dropdown menu
        names.forEach((name) => {
            ddMenu.append("option").text(name).property("value", name)
        });
    
    // Pick the first subject from the dataset
    let sample_init = names[0];

    // Build and initialize the initial plots and metadata display
    dispBARchart(sample_init);
    dispMetadata(sample_init);
    dispBBLchart(sample_init);

    });
};

init();