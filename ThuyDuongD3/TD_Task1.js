d3.csv("Art_in_Public_Places.csv").then(function(data) {
  var countData = countTop3SculptureArtists(data)

  // Thiết lập kích thước của biểu đồ
  var width = 800;
  var height = 500;
  var margin = {top: 70, right: 20, bottom: 20, left: 180};

  var svg = d3.select("#chart-container-task1")
    .append("svg")
    .attr("width", width + margin.left + margin.right + 100)
    .attr("height", height + margin.top + margin.bottom + 100) 
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Thiết lập scale cho trục x và y
  var x = d3.scaleBand()
    .domain(countData.map(function(d) { return d.artist; }))
    .range([0, width])

  var y = d3.scaleLinear()
    .domain([0, d3.max(countData, function(d) { return d.count; })])
    .nice()
    .range([height, 0]);

  svg.append("text")
  .attr("x", width / 2)
  .attr("y", margin.top - 120)
  .attr("text-anchor", "middle")
  .style("font-size", "21px")
  .style("font-weight", "bold")
  .text(" Tìm top 3 nghệ sĩ có nhiều tác phẩm thuộc loại Sculpture nhất");
   
  // Tạo trục x và y
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  // Vẽ các cột
  svg.selectAll(".bar")
    .data(countData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.artist) + (x.bandwidth()) / 4; })
    .attr("y", function(d) { return y(d.count); })
    .attr("width", x.bandwidth() / 2)
    .attr("height", function(d) { return height - y(d.count); })
    .attr("fill", function(d, i) { 
      // Chọn màu theo chỉ số của cột
      return ["#ff7f0e", "#1f77b4", "#2ca02c"][i];
    });

  // Thêm label phía trên của mỗi cột
  svg.selectAll(".text")
  .data(countData)
  .enter().append("text")
  .attr("class", "label")
  .attr("x", function(d) { return x(d.artist) + x.bandwidth() / 2; })
  .attr("y", function(d) { return y(d.count) - 5; }) 
  .text(function(d) { return d.count; })
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("fill", "black")

  // Thêm tên cho trục x
svg.append("text")
  .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 18) + ")")
  .style("text-anchor", "middle")
  .style("font-weight", "bold") 
  .text("Nghệ sĩ");


  // Thêm tên cho trục y
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "9em")
  .style("text-anchor", "middle")
  .style("font-weight", "bold") 
  .text("Số lượng tác phẩm");
}).catch(function(error) {
  console.error("Error loading the data: " + error);
});


function countTop3SculptureArtists(data) {
  var sculptureArtistCounts = {};

  // Lặp qua mảng dữ liệu và tính số lượng của mỗi nghệ sĩ với loại tác phẩm là Sculpture
  data.forEach(function(d) {
    var type = d["Type"];
    var artistName = d["Artist Last Name"] + " " + d["Artist First Name"];
    
    // Kiểm tra nếu loại tác phẩm là Sculpture
    if (type === "Sculpture") {
      if (sculptureArtistCounts[artistName]) 
        sculptureArtistCounts[artistName]++;
      else 
        sculptureArtistCounts[artistName] = 1;
    }
  });

  var countData = Object.keys(sculptureArtistCounts).map(function(key) {
    return { artist: key, count: sculptureArtistCounts[key] };
  });

  // Sắp xếp mảng theo số lượng giảm dần
  countData.sort(function(a, b) {
    return b.count - a.count;
  });

  countData = countData.slice(0, 3);

  return countData;
}

