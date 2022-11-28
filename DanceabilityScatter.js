/*
    Reference: https://d3-graph-gallery.com/graph/bubble_tooltip.html
 */
// set the dimensions and margins of the graph (More specifically the svg element)
const margin = {
        top: 40,
        right: 20,
        bottom: 40,
        left: 60
    },
    width = 650 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .attr("style", "text-align:center")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data from the CSV, and assign variables for each column to be parsed and used for scaling
d3.csv("songs_normalize.csv").then(data =>{

    data.forEach(d =>{
        d.artist = d["artist"];
        d.popularity = +d["popularity"]; //Using '+'
        d.danceability = +d["danceability"]; //Using '+'
        d.song = d["song"];
    })

    const xValue = d => d.popularity; // Will be our xAxis
    const yValue = d => d.danceability; //Will be our yAxis
    //const zValue = d => d.jobsLost; //will be used for the size of our bubbles

    // Add X axis
    const x = d3.scaleLinear()
        .domain([d3.min(data, xValue), d3.max(data, xValue)])
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x)); //Create the physical xAxis


    // Add Y axis
    const y = d3.scaleLinear()
        .domain([d3.min(data, yValue), d3.max(data, yValue)]) //What are the lowest and highest values expected to be passed in?
        .range([ height, 0]); // Convert (opposite because js renders downwards
    svg.append("g")  //Create the physical yAxis
        .call(d3.axisLeft(y));

    // Add a scale for bubble size
    const z = d3.scaleLinear()
        .domain([d3.min(data, xValue), d3.max(data, xValue)])
        .range([ 4, 4]); //These will be the size of our bubbles, big enough to see, but not so big that it affects everything, decent proportion

    // Add a scale for bubble color
    const myColor = d3.scaleOrdinal()
        .range(d3.schemeSet2); //Color set I chose to use

    // -1- Create a tooltip div that is hidden by default:
    const tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "Gainsboro")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "black")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    const showTooltip = function(event, d) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .style("opacity", 1)
            .html("Artist: " + d.artist + ", Song: " + d.song) //Prints the contents of the bubble onto the tooltip
            .style("left", (event.x)/2 + "px")
            .style("top", (event.y)/2+30 + "px")
    }
    const moveTooltip = function(event, d) {
        tooltip
            .style("left", (event.x)/2 + "px")
            .style("top", (event.y)/2+30 + "px")
    }
    const hideTooltip = function(event, d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    // Add the dots, their x, y positions, their size, what state they represent, and turn the tooltips on for each
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("class", "bubbles")
        .attr("cx", d => x(d.popularity))
        .attr("cy", d => y(d.danceability))
        .attr("r", d => z(d.popularity))
        .style("fill", "#1DB954")
        .style("opacity", "0.7")
        .attr("stroke", "black")
        // -3- Trigger the functions
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )

    //Create x-axis title
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width / 2 + 40)
        .attr("y", height + 35)
        .style("font-size", "24px")
        .style("fill", "gainsboro")
        .text("Popularity");
//Create y-axis title
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -height / 2 + 40)
        .attr("y", -55)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .style("font-size", "24px")
        .style("fill", "gainsboro")
        .text("Danceability");

})