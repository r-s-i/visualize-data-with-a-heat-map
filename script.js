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
      });
    addingAxis();
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
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]);

  const yAxis = d3.axisLeft(yScale).ticks(10);

  svg
    .append("g")
    .attr("transform", `translate(${0}, ${svgHeight / 24})`)
    .attr("id", "y-axis")
    .call(yAxis);
}
