const svg = d3
  .select("section")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%");
const svgWidth = svg._groups[0][0].clientWidth;
const svgHeight = svg._groups[0][0].clientHeight;
const baseTemp = 8.66; // lowest temp: 1.684, highest: 13.888
const colors = ["blue", "lightblue", "white", "orange", "red"];

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((r) => r.json())
  .then((d) => {
    let xOffset = 0;
    let yOffset = 0;
    svg
      .selectAll("rect")
      .data(d.monthlyVariance)
      .enter()
      .append("rect")
      .attr("y", (d, i) => {
        if (i % 12 !== 0) {
          yOffset += svg._groups[0][0].clientHeight / 12;
        } else {
          yOffset = 0;
        }
        return yOffset;
      })
      .attr("x", (d, i) => {
        if (i !== 0 && i % 12 === 0) {
          xOffset += svg._groups[0][0].clientWidth / 263;
        }
        return xOffset;
      })
      .attr("class", "cell")
      .attr("width", svg._groups[0][0].clientWidth / 263)
      .attr("height", svg._groups[0][0].clientHeight / 12)
      .attr("data-month", (d) => d.month - 1)
      .attr("data-year", (d) => d.year)
      .attr("data-temp", (d) => d.variance + baseTemp)
      .style("fill", (d) => {
        let temp = d.variance + baseTemp;
        if (temp < 4) return colors[0];
        else if (temp < 6.5) return colors[1];
        else if (temp < 9) return colors[2];
        else if (temp < 11.5) return colors[3];
        else if (temp < 14) return colors[4];
      })
      .on("mouseover", (e) => {
        const y = e.target.y.animVal.value;
        const x = e.target.x.animVal.value;
        const year = e.target.__data__.year;
        const month = e.target.__data__.month;
        const temp = (e.target.__data__.variance + baseTemp).toFixed(2);
        e.target.style.outline = "1px black solid";
        addingTooltip(x, y, 100, 50, year, month, temp);
      })
      .on("mouseout", (e) => {
        e.target.style.outline = "none";
        const tooltip = d3.select("#tooltip");

        tooltip.remove();
      });
    addingAxis();
    addingLegend(240);
  });

function addingAxis() {
  // Adding x-axis:
  const xScale = d3
    .scaleTime()
    .range([0, svgWidth])
    .domain([new Date(1753, 0, 1), new Date(2015, 0, 8)]);

  const xAxis = d3.axisBottom(xScale).ticks(10);

  svg
    .append("g")
    .attr("transform", `translate(${0}, ${svgHeight - 30})`)
    .attr("id", "x-axis")
    .call(xAxis);

  // Adding y-axis:
  const yScale = d3
    .scaleBand()
    .range([0, svgHeight])
    .domain([
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]);

  const yAxis = d3.axisLeft(yScale).ticks(10);

  svg
    .append("g")
    .attr("transform", `translate(${0}, ${0})`)
    .attr("id", "y-axis")
    .call(yAxis);
}

function addingLegend(legendWidth) {
  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${svgWidth / 2 - legendWidth / 2}, 0)`);
  legend
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("y", 0)
    .attr("x", (d, i) => (legendWidth / 5) * i)
    .attr("width", legendWidth / 5)
    .attr("height", legendWidth / 5)
    .style("fill", (d, i) => colors[i]);
}
function addingTooltip(x, y, w, h, year, month, temp) {
  const g = svg.append("g").attr("id", "tooltip").attr("data-year", year);
  const tooltip = g
    .append("foreignObject")

    .attr("width", w)
    .attr("height", h)
    .html(`<aside id='tooltip'>${year} - ${month} <br> ${temp} ℃ </aside>`)
    .attr("transform", `translate(${x - w / 2}, ${y - h})`);
}
