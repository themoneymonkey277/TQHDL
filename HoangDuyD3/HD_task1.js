// Đọc dữ liệu từ file CSV cho task 1 và vẽ biểu đồ bar chart
d3.csv("Traffic_Accidents.csv").then(function (data) {
    // Lọc dữ liệu chỉ chứa các vụ tai nạn hit-and-run
    const hitAndRunData = data.filter(d => d['Hit and Run'] === "TRUE");

    // Rollup dữ liệu để đếm số vụ tai nạn hit-and-run của mỗi thành phố
    const accidentsByCity = d3.rollup(hitAndRunData, v => v.length, d => d.City);

    const sortedAccidents = Array.from(accidentsByCity, ([city, count]) => ({ city, count }))
        .sort((a, b) => d3.descending(a.count, b.count))
    //.slice(0, 10);

    const margin = { top: 40, right: 30, bottom: 70, left: 90 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#chart-container-task1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleBand()
        .domain(sortedAccidents.map(d => d.city))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(sortedAccidents, d => d.count)])
        .nice()
        .range([height, 0]);

    // svg.append("text")
    //     .attr("x", width / 2)
    //     .attr("y", -margin.top)
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "24px")
    //     .style("font-weight", "bold")
    //     .text("Số vụ tai nạn Hit-and-run theo từng thành phố");

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 50)
        .style("text-anchor", "middle")
        .text("Thành phố");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Hit-and-Run Accidents");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Số lượng tai nạn Hit-and-run");
    const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateBlues)
        .domain([sortedAccidents.length, 0]); // Đảo ngược thứ tự màu sắc

    svg.selectAll(".bar")
        .data(sortedAccidents)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.city))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("fill", (d, i) => colorScale(i));

    svg.selectAll(".bar-label")
        .data(sortedAccidents)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.city) + x.bandwidth() / 2)
        .attr("y", d => y(d.count) - 20) // Đặt nhãn ở phía dưới thanh bar
        .attr("dy", "1em") // Đặt khoảng cách từ thanh bar
        .attr("text-anchor", "middle")
        .text(d => d.count);

});
