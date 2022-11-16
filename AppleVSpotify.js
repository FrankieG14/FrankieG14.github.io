// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("PremiumSubs_CS360Final.csv").then(data =>{

    data.forEach(d =>{
        d.year = d["Year"];
        d.spotifySubs = +d["SpotifySubscribers(in millions)"]; //Using '+'
        d.appleSubs = +d["AppleMusic"]; //Using '+'
    })

    const yValue = d => d.spotifySubs;


    // List of subgroups = header of the csv files = soil condition here
    const subgroups = data.columns.slice(1)
    console.log(subgroups)

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = data.map(d => d.year)

    console.log(groups)

    // Add X axis
    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, yValue)])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));


    //Add Title
    svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('y', margin.top / 2 + 20)
        .style("font-size", "24px")
        .style("fill", "gainsboro")
        .text('Spotify vs. Apple Music User Growth');

    // Another scale for subgroup position?
    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#4daf4a', '#f94c57'])

    //Create x-axis title
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width / 2 + 20)
        .attr("y", height + 20)
        .style("fill", "gainsboro")
        .style("font-size", "16px")
        .text("Year");
//Create y-axis title
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -height / 2 + 100)
        .attr("y", -45)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .style("fill", "gainsboro")
        .style("font-size", "16px")
        .text("Number of Subcribers (in millions)");


    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${x(d.year)}, 0)`)
        .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        .join("rect")
        .attr("x", d => xSubgroup(d.key))
        .attr("y", d => y(d.value))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.key));

})