d3.csv("Traffic_Accidents.csv")
  .then(function (data) {
    var countData = countAccidentsByIllumination(data);
    // Sắp xếp countData theo số lượng giảm dần
    countData.sort(function (a, b) {
      return b.count - a.count;
    });

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
      .domain(
        countData.map(function (d) {
          return d.illumination;
        })
      )
      .range([0, width])
      .padding(0.1);

    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(countData, function (d) {
          return d.count;
        }),
      ])
      .nice()
      .range([height, 0]);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top - 140)
      .attr("text-anchor", "middle")
      .style("font-size", "21px")
      .style("font-weight", "bold")
      .text(
        "Báo cáo số lượng tai nạn không xảy ra va chạm theo từng loại thông tin chiếu sáng"
      );

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

    // Vẽ các cột
    svg
      .selectAll(".bar")
      .data(countData)
      .enter()
      .append("rect")
      .attr("class", "bar2")
      .attr("x", function (d) {
        return x(d.illumination);
      })
      .attr("y", function (d) {
        return y(d.count);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - y(d.count);
      })
      .attr("fill", function (d, i) {
        // Chọn màu theo chỉ số của cột
        return [
          "#FF8F00",
          "#FFA000",
          "#FFB300",
          "#FFC107",
          "#FFCA28",
          "#FFD54F",
          "#FFE082",
          "#FFECB3",
          "#FFF8DC",
        ][i];
      });

    // Thêm label phía trên của mỗi cột
    svg
      .selectAll(".text")
      .data(countData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", function (d) {
        return x(d.illumination) + x.bandwidth() / 2;
      })
      .attr("y", function (d) {
        return y(d.count) - 5;
      })
      .text(function (d) {
        return d.count;
      })
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "black");

    // Thêm tên cho trục x
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 40) + ")"
      )
      .style("text-anchor", "middle")
      .style("color", "red")
      .style("font-weight", "bold")
      .text("Loại chiếu sáng");

    // Thêm tên cho trục y
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Số lượng tai nạn không xảy ra va chạm");
  })
  .catch(function (error) {
    console.error("Error loading the data: " + error);
  });

function countAccidentsByIllumination(data) {
  var illuminationCounts = {};

  // Lặp qua mảng dữ liệu và tính số lượng tai nạn không xảy ra va chạm cho mỗi loại Illumination Description
  data.forEach(function (d) {
    var illumination = d["Illumination Description"];
    var collisionType = d["Collision Type Description"];

    // Kiểm tra nếu loại va chạm là "NOT COLLISION W/MOTOR VEHICLE-TRANSPORT"
    if (collisionType === "NOT COLLISION W/MOTOR VEHICLE-TRANSPORT") {
      if (illuminationCounts[illumination]) {
        illuminationCounts[illumination]++;
      } else {
        illuminationCounts[illumination] = 1;
      }
    }
  });

  var countData = Object.keys(illuminationCounts).map(function (key) {
    return { illumination: key, count: illuminationCounts[key] };
  });

  return countData;
}
