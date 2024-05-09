d3.csv("Traffic_Accidents.csv").then(function (data) {
    var countData = countInjuriesBycollision(data);
    countData.sort(function (a, b) {
        return b.count - a.count;
    });


    var width = 700;
    var height = 500;
    var margin = { top: 20, right: 20, bottom: 250, left: 300 };

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .domain(countData.map(function (d) { return d.collision; }))
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(countData, function (d) { return d.count; })])
        .nice()
        .range([height, 0]);


    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    svg.append("g")
        .call(d3.axisLeft(y));


    svg.selectAll(".bar")
        .data(countData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.collision); })
        .attr("y", function (d) { return y(d.count); })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return height - y(d.count); })
        .attr("fill", "#fa2f4a");


    svg.selectAll(".text")
        .data(countData)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", function (d) { return x(d.collision) + x.bandwidth() / 2; })
        .attr("y", function (d) { return y(d.count) - 5; })
        .text(function (d) { return d.count; })
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "black");


    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 220) + ")")
        .style("text-anchor", "middle")
        .style("color", "red")
        .style("font-weight", "bold")
        .text("Loại va chạm");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 200)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text("Số lượng người bị thương khi xảy ra va chạm");


}).catch(function (error) {
    console.error("Error loading the data: " + error);
});

function countInjuriesBycollision(data) {
    var injuriesCounts = {};


    data.forEach(function (d) {
        var collision = d["Collision Type Description"];
        var numberInjuries = +d["Number of Injuries"];
        if (collision === "" || collision === "OTHER" || collision === "UNKNOWN") {
            collision = "OTHER";
        }
        if (numberInjuries > 0) {
            if (!injuriesCounts[collision]) {
                injuriesCounts[collision] = 0;
            }
            injuriesCounts[collision] += numberInjuries;
        }
    });

    var countData = Object.keys(injuriesCounts).map(function (key) {
        return { collision: key, count: injuriesCounts[key] };
    });

    return countData;
}