// @TODO: YOUR CODE HERE!
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }
    // Creating a SVG group
    var svgWidth = window.innerWidth-200;
    var svgHeight = window.innerHeight;
    //margins
    var margin = {
        top: 20,
        right:40,
        bottom: 80,
        left:60
    };
    // chart area minus margins
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width",svgWidth)
        .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // Retrieve data from the CSV file and execute everything below

    d3.csv("assets/data/data.csv", function (err, newsData) {
        if (err) throw err;

        console.log(newsData);

        // // Convert data values to integer from String

        newsData.forEach(function (newsData) {
            newsData.poverty = +newsData.poverty;
            newsData.healthcare = +newsData.healthcare;
            console.log(newsData.abbr)
            // data.age=+data.age;
            // data.smokes=+data.smokes;

        });
        //Creating xscale for data
        var xScale = d3.scaleLinear()
            .domain([d3.min(newsData, d => d.poverty)-1,d3.max(newsData,d=>d.poverty)+1.1])
            .range([0, width]);

        // Creating y scale
        var yScale = d3.scaleLinear()
            .domain([d3.min(newsData, d => d.healthcare)-.5,d3.max(newsData,d=>d.healthcare)+1])
            .range([height, 0]);

        // creating axes
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        // Adding axes to chart
        chartGroup.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);

        chartGroup.append("g").call(yAxis);
        // newsData.forEach(function(data){
        //     console.log(data.poverty)
        //     console.log(data.healthcare)
        // })
        var circleGroup = chartGroup.selectAll("circle")
            .data(newsData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", 10)
            .attr("fill", "lightblue")
            .attr("opacity", ".7");

        // Creating axes labels
        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var povertyLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "hair_length") // value to grab for event listener
            .classed("active", true)
            .text("In Poverty(%)");

        // var albumsLabel = labelsGroup.append("text")
        //     .attr("x", 0)
        //     .attr("y", 40)
        //     .attr("value", "num_albums") // value to grab for event listener
        //     .classed("inactive", true)
        //     .text("# of Albums Released");

        // append y axis
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("active", true)
            .text("Lacks Healthcare(%)");

        // /Append text in circles
        chartGroup.selectAll("text")
            .data(newsData)
            .enter()
            .append("text")
            .attr("font-size",10)
            .attr("x", d => xScale(d.poverty)-6)
            .attr("y", d => yScale(d.healthcare)+4)
            .text(function (d) {
                // console.log(d.abbr)
                return d.abbr;
            })
            .attr("class", "circleText");

    })



    // // Creating the tool tip
    // // Append div to body to create a tool tip
    // var toolTip = d3.tip()
    // .attr("class", "tooltip")
    // .html(function(d){
    //     return(`${d.state}<hr>Poverty: <strong>${d.poverty}</strong><hr>Healthcare: <strong>${d.healthcare}</strong>`)
    // });

    // circleGroup.call(toolTip);
    // circleGroup.on("mouseover",function(data){
    //     toolTip.show(data);
    // })

    //     // Step 3: Add an onmouseout event to make the tooltip invisible
    //     .on("mouseout", function() {
    //       toolTip.style("display", "none");
    //     });
}

makeResponsive();
d3.select(window).on("resize", makeResponsive);