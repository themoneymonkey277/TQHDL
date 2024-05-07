function countTop3SculptureArtists(data) {
    var sculptureMediumCounts = {};
    
    data.forEach(function(d) {
        var type = d["Type"];
        var medium = d["Medium"];
        
        if (type === "Sculpture") {
            if (!sculptureMediumCounts[medium]) 
                sculptureMediumCounts[medium]=1;
            else 
                sculptureMediumCounts[medium]++;
        }
    });

    var countData = Object.keys(sculptureMediumCounts).map(function(key) {
        return { artist: key, count: sculptureMediumCounts[key] };
    });

    countData.sort(function(a, b) {
        return b.count - a.count;
    });

    countData = countData.slice(0, 6);

    return countData;
}

d3.csv("Art_in_Public_Places.csv").then(function(data) {
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
        .attr("x1", function(d) { return arc.centroid(d)[0]; })
        .attr("y1", function(d) { return arc.centroid(d)[1]; })
        .attr("x2", function(d) { return arc.centroid(d)[0] * 1.5; }) // Adjust the position of the line
        .attr("y2", function(d) { return arc.centroid(d)[1] * 1.5; }); // Adjust the position of the line;

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


        var description = d3.select("#chart-description")
        .html("<p><b>Yêu cầu:</b> Tìm top 6 tác phẩm điêu khắc theo từng chất liệu </p><p><b>Thiết kế biểu đồ:</b></p><p>Với yêu cầu này, ta sử dụng 2 thuộc tính là Type để chất liệu của vật liệu và Medium để đếm số lượng các tác phẩm thuộc loại Sculpture.</p><p>Với từng góc của hình tròn biểu thị số lượng tác phẩm điêu khắc theo từng chất liệu</p><p><b>Đánh giá biểu đồ: </b></p><p>- Thông qua biểu đồ, các chất liệu có nhiều tác phẩm điêu khắc nhiều nhất theo thứ tự sau: Bronze (16), Stone (5), LimeStone (4), Bronze sculpture (3), Kinney and Scholz (3), Concrete (3). Với các thông tin được cung cấp từ biểu đồ, ta có thể sử dụng những thông tin đó để tìm hiểu về thị trường chất liệu tác phẩm điêu khắc, chọn ra chất liệu ưa chuộng cũng như tối ưu nhất khi làm tác phẩm điêu khắc.</p>")
           
            .style("margin-top", "20px");

        // Điều chỉnh vị trí của #chart-description
        description.style("position", "absolute")
            .style("top", 170 + "px")
            .style("left", "70%")
            .style("transform", "translateX(-50%)");
}).catch(function(error) {
    console.error("Error loading the data: " + error);
});