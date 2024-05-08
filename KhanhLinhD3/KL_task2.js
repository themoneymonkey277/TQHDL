function countTop3SculptureArtists(data) {
    var sculptureMediumCounts = {};

    data.forEach(function (d) {
        var type = d["Type"];
        var medium = d["Medium"];

        if (type === "Sculpture") {
            if (!sculptureMediumCounts[medium])
                sculptureMediumCounts[medium] = 1;
            else
                sculptureMediumCounts[medium]++;
        }
    });

    var countData = Object.keys(sculptureMediumCounts).map(function (key) {
        return { artist: key, count: sculptureMediumCounts[key] };
    });

    countData.sort(function (a, b) {
        return b.count - a.count;
    });

    countData = countData.slice(0, 6);

    return countData;
}

d3.csv("Art_in_Public_Places.csv").then(function (data) {
    var countData = countTop3SculptureArtists(data);
    var width = 800;
    var height = 800;
    var margin = 80;
    var radius = Math.min(width, height) / 2 - margin;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal()
        .domain(countData.map(function (d) { return d.artist; }))
        .range(d3.schemeCategory10);

    var pie = d3.pie()
        .value(function (d) { return d.count; });

    var arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.8);

    var arcs = svg.selectAll("arc")
        .data(pie(countData))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("fill", function (d) { return color(d.data.artist); })
        .attr("d", arc);

    arcs.append("line")
        .attr("class", "line")
        .attr("x1", function (d) { return arc.centroid(d)[0]; })
        .attr("y1", function (d) { return arc.centroid(d)[1]; })
        .attr("x2", function (d) { return arc.centroid(d)[0] * 1.5; }) // Adjust the position of the line
        .attr("y2", function (d) { return arc.centroid(d)[1] * 1.5; }); // Adjust the position of the line;

    arcs.append("text")
        .attr("class", "bold-text")
        .attr("transform", function (d) {
            var pos = arc.centroid(d);
            pos[0] *= 1.5; // Adjust the position of the text
            pos[1] *= 1.5; // Adjust the position of the text
            return "translate(" + pos + ")";
        })
        .attr("text-anchor", "middle")
        .text(function (d) { return d.data.artist + " (" + d.data.count + ")"; });
}).catch(function (error) {
    console.error("Error loading the data: " + error);
});