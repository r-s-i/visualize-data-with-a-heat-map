const svg = d3
  .select("section")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%");

const xAxis = d3.select("svg").append("g").attr("id", "x-axis");
const yAxis = d3.select("svg").append("g").attr("id", "y-axis");
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
        console.log("d", d);
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
  });
