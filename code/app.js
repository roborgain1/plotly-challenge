function getPlot(id) {
    
    // get the data from the json file
    d3.json("samples.json").then((data)=> {

        var metaData = data.metadata.filter(m => m.id.toString() === id)[0];

        var wFreq = metaData.wfreq;


        // filter total sample array by id, [0] selects theonly sample in array after filter
        var eachSample = data.samples.filter(s => s.id.toString() === id)[0];

        console.log(eachSample);

        
        // get top 10 sample values for each plot and reverse
        var sampleValues = eachSample.sample_values.slice(0, 10).reverse();

        // get the top 10 otu ids for each plot
        var otuIds = eachSample.otu_ids.slice(0, 10).reverse();
        
        // add "OTU" before each OTU ID
        otuIds = otuIds.map(x=> "OTU " + x + " ")

        // get the top 10 labels for each plot
        var otuLabels = eachSample.otu_labels.slice(0, 10).reverse();

        // create trace variable for the plot
        var trace1 = {
            x: sampleValues,
            y: otuIds,
            text: otuLabels,
            type:"bar",
            orientation: "h",
        };

        // create data variable
        var data1 = [trace1];

        // create layout variable to set plots layout
        var layout1 = {
            title: "Top 10 OTUs per Test Subject",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 30,
                b: 20
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", data1, layout1);
        
        // create the trace for the bubble chart
        var trace2 = {
            x: eachSample.otu_ids,
            y: eachSample.sample_values,
            mode: "markers",
            marker: {
                size: eachSample.sample_values,
                color: eachSample.otu_ids
            },
            text: eachSample.otu_labels

        };

        // set the layout for the bubble plot
        var layout2 = {
            xaxis:{title: "OTU IDs"},
            height: 600,
            width: 1300
        };

        // create the data variable 
        var data2 = [trace2];

        // create the bubble plot
        Plotly.newPlot("bubble", data2, layout2); 

        // create guage chart
        var trace3 = 
            {
            domain: { x: [0, 1], y: [0, 1] },
            value: parseFloat(wFreq),
            title: { text: "Belly Button Washing Frequency"},
            type: "indicator",
            mode: "gauge+number",
            gauge: { axis: { range: [null, 9] },
                steps: [
                    { range: [0, 1], color: "darkgreen" },
                    { range: [1, 2], color: "forestgreen" },
                    { range: [2, 3], color: "seagreen" },
                    { range: [3, 4], color: "mediumseagreen" },
                    { range: [4, 5], color: "mediumaquamarine" },
                    { range: [5, 6], color: "deepskyblue" },
                    { range: [6, 7], color: "blue" },
                    { range: [7, 8], color: "darkblue" },
                    { range: [8, 9], color: "midnightblue" },
                    ]}
            };

        var data3 = [trace3];

        var layout3 = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
            };
        Plotly.newPlot("gauge", data3, layout3);

    });    
}
    
// create the function to get the necessary data
function getInfo(id) {
    // read the json file to get data
    d3.json("samples.json").then((data)=> {
        
        // get the metadata info for the demographic panel
        var metadata = data.metadata;

        // filter meta data info by id
        var metaData = metadata.filter(meta => meta.id.toString() === id)[0];
        console.log(metaData)

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata").html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(metaData).forEach((keyvalue) => {
            demographicInfo.append("div").text(keyvalue[0].toUpperCase() + ": " + keyvalue[1]);    
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data)=> {

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();