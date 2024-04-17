// Đọc dữ liệu từ file CSV cho task 2 và vẽ biểu đồ bar chart
d3.csv("Art_in_Public_Places.csv").then(function(data) {
    const artistsCount = d3.rollup(data, v => v.length, d => d['Artist Last Name']);

    const sortedArtists = Array.from(artistsCount, ([artist, count]) => ({ artist, count }))
                                .sort((a, b) => d3.descending(a.count, b.count))
                                .slice(0, 5);

    // Combine first name and last name into a single string
    sortedArtists.forEach(d => {
        const firstName = data.find(item => item['Artist Last Name'] === d.artist)['Artist First Name'];
        d.artist = `${firstName} ${d.artist}`;
    });
    const margin = { top: 40, right: 30, bottom: 70, left: 90 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart-container-task2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleBand()
        .domain(sortedArtists.map(d => d.artist))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(sortedArtists, d => d.count)])
        .nice()
        .range([height, 0]);
    // Tên biểu đồ
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Top 5 nghệ sĩ có nhiều tác phẩm nhất");
    
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("class", "axis-x-label") 
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 50)
        .style("text-anchor", "middle")
        .text("Nghệ sĩ");

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Artworks");
    
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Số lượng tác phẩm");
    

    const colorScale = d3.scaleSequential()
                         .interpolator(d3.interpolateGreens)
                         .domain([sortedArtists.length, 0]); // Đảo ngược thứ tự màu sắc

    svg.selectAll(".bar")
        .data(sortedArtists)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.artist))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("fill", (d, i) => colorScale(i));

    svg.selectAll(".bar-label")
        .data(sortedArtists)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.artist) + x.bandwidth() / 2)
        .attr("y", d => y(d.count) - 10) // Adjusted label position
        .attr("text-anchor", "middle")
        .style("font-size", "10px") // Reduced font size
        .text(d => d.count);
});
