d3.csv("Traffic_Accidents.csv")
  .then(function(data) {
    var countData = countAccidentsByIllumination(data);

    // Thiết lập kích thước của biểu đồ
    var width = 800;
    var height = 500;
    var margin = { top: 90, right: 20, bottom: 150, left: 70 };

    var svg = d3
      .select("#chart-container-task2")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Thiết lập scale cho trục x và y
    var x = d3
      .scaleBand()
      .domain(countData.map(function(d) { return d.illumination; }))
      .range([0, width])
      .padding(0.1);

    var y = d3
      .scaleLinear()
      .domain([0, d3.max(countData, function(d) { return d.count2020 + d.count2021; })])
      .nice()
      .range([height, 0]);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top - 140)
      .attr("text-anchor", "middle")
      .style("font-size", "21px")
      .style("font-weight", "bold")
      .text("Báo cáo số lượng tai nạn theo điều kiện ánh sáng trong năm 2020 và 2021");

    // Tạo trục x và y
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    svg.append("g").call(d3.axisLeft(y));

    // Vẽ các cột chồng
    var stack = d3.stack()
      .keys(["count2020", "count2021"])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);
    
    var stackedData = stack(countData);

    svg.selectAll(".bar")
      .data(stackedData)
      .enter().append("g")
      .attr("fill", function(d, i) { return ["#67BBDB", "#FFC107"][i]; })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
      .attr("x", function(d) { return x(d.data.illumination); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
      .append("title") 
      .text(function(d) { 
        return d[1] - d[0];
    });
  // Tạo chú thích
  var legend = svg.selectAll(".legend")
    .data(["2020", "2021"])
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", function(d, i) { return ["#67BBDB", "#FFC107"][i]; });

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });

  // Thêm tên cho trục x
  svg
    .append("text")
    .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 40) + ")")
    .style("text-anchor", "middle")
    .style("color", "red")
    .style("font-weight", "bold")
    .text("Điều kiện ánh sáng");

  // Thêm tên cho trục y
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Số lượng vụ tai nạn");
  })
  .catch(function(error) {
    console.error("Error loading the data: " + error);
  });

function countAccidentsByIllumination(data) {
  var illuminationCounts = {};

  data.forEach(function(d) {
    var illumination = d["Illumination Description"] || "NULL"; 
    var dateTime = d["Date and Time"];
    var year = new Date(dateTime).getFullYear();
    
    if (year === 2020 || year === 2021) {
      if (!illuminationCounts[illumination]) {
        illuminationCounts[illumination] = { "count2020": 0, "count2021": 0 };
      }
     
      if (year === 2020) {
        illuminationCounts[illumination]["count2020"]++;
      } else if (year === 2021) {
        illuminationCounts[illumination]["count2021"]++;
      }
    }
  });

  var countData = Object.keys(illuminationCounts).map(function(key) {
    return { 
      illumination: key, 
      count2020: illuminationCounts[key]["count2020"],
      count2021: illuminationCounts[key]["count2021"]
    };
  });

  countData.sort(function(a, b) {
    return b.count2020 - a.count2020;
  });

  return countData;
}
