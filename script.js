const svg = d3
  .select("section")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%");
const xAxis = d3.select("svg").append("g").attr("id", "x-axis");
