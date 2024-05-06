// HD_task2.js

document.addEventListener("DOMContentLoaded", function () {
    d3.csv("Art_in_Public_Places.csv").then(function (data) {
        // Đếm tổng số loại hình nghệ thuật và lưu vào biến totalTypes
        var totalTypes = data.length;

        // Tính toán số lượng các loại hình nghệ thuật và lưu trữ vào biến typeCounts
        var typeCounts = d3.rollup(data, v => v.length, d => d.Type);
        // Chuyển đổi typeCounts thành mảng để dễ dàng truy cập và sắp xếp
        var typeData = Array.from(typeCounts, ([type, count]) => ({ type, count }));

        // Sắp xếp dữ liệu theo số lượng giảm dần
        typeData.sort((a, b) => b.count - a.count);

        // Giới hạn số lượng slice tối đa là 6, slice còn lại sẽ được gộp vào slice "Others"
        if (typeData.length > 5) {
            var top6 = typeData.slice(0, 5); // Lấy 5 slice có số lượng lớn nhất
            var othersCount = d3.sum(typeData.slice(5), d => d.count); // Tính tổng số lượng của slice còn lại
            top6.push({ type: "Others", count: othersCount }); // Thêm slice "Others" vào mảng top6
            typeData = top6; // Gán lại typeData với mảng top6 đã được chỉnh sửa
        }

        var customColors = ["#FDCAC9", "#95B3CB", "#7EB47A", "#4E89AE", "#F9D923", "#F37121", "#F9D923"];
        var colorScale = d3.scaleOrdinal()
            .domain(typeData.map(d => d.type))
            .range(customColors);

        // Thiết lập kích thước và margin cho biểu đồ
        var width = 550;
        var height = 550;
        var margin = 40;

        // Tạo SVG cho biểu đồ pie chart và đặt nó trong div có id "chart-container-task2"
        var svg = d3.select("#chart-container-task2")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // Tạo generator để tạo ra các cung cho biểu đồ pie
        var pie = d3.pie()
            .value(d => d.count); // Sử dụng số lượng của mỗi loại hình nghệ thuật làm giá trị

        // Áp dụng generator pie vào dữ liệu
        var data_ready = pie(typeData);

        // Vẽ các cung của biểu đồ pie và thêm màu sắc
        svg.selectAll("path")
            .data(data_ready)
            .enter()
            .append("path")
            .attr("d", d3.arc()
                .innerRadius(0)
                .outerRadius(Math.min(width, height) / 2 - margin)
            )
            .attr("fill", d => colorScale(d.data.type)) // Sử dụng màu sắc tương ứng với loại hình nghệ thuật
            .attr("stroke", "grey")
            .style("stroke-width", "0.5px");

        // Thêm chú thích về phần trăm của từng loại hình nghệ thuật
        svg.selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('text')
            .text(d => ((d.data.count / totalTypes) * 100).toFixed(2) + "%") // Hiển thị loại hình và phần trăm tương ứng
            .attr("transform", function(d) {
                //var pos = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2 - margin).centroid(d);
                var pos = d3.arc()
                        .innerRadius(0)
                        .outerRadius(Math.min(width, height) / 2 - margin)
                        .centroid(d);
                if (d.index > 1) {
                    // Tính toán góc quay cho nhãn
                    var angle = (d.startAngle + d.endAngle) / 2; // Góc trung bình của slice
                    angle = angle * (180 / Math.PI); // Chuyển đổi sang đơn vị độ
                    pos[1] -= 30;
                    pos [0] -=10;
                    // Xác định hướng của nhãn dựa trên góc quay
                    var labelDirection = (angle < 180) ? 1 : -1; // 1 cho nhãn quay về phía trong, -1 cho nhãn quay về phía ngoài
                    return "translate(" + pos + ") rotate(" + (angle + 270 * labelDirection) + ")"; // Quay nhãn và dịch chuyển đến vị trí của slice
                } else {
                    // Trả về vị trí mặc định nếu slice là 1 trong 2 slices đầu tiên
                    return "translate(" + pos + ")";
                }
        })
            .style("text-anchor", "middle")
            .style("font-size", function(d) {
                // Đặt vị trí căn chỉnh cho văn bản
                if (d.index > 1) {
                    return 10; // Căn giữa văn bản nếu không phải là 1 trong 2 slices đầu tiên
                } else {
                    return 14; // Căn trái văn bản nếu là 1 trong 2 slices đầu tiên
                }
            }); // Đặt font size cho chú thích

        // Tạo legend
        var legend = svg.selectAll(".legend")
            .data(typeData)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // Thêm màu sắc cho legend
        legend.append("rect")
            .attr("x", width / 2 + margin)
            .attr("y", -height / 2 + margin)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", d => colorScale(d.type));

        // Thêm chú thích cho legend
        legend.append("text")
            .attr("x", width / 2 + margin + 25)
            .attr("y", -height / 2 + margin + 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(d => d.type );


    });
});
