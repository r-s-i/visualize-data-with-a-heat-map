let svg = d3
  .select("section")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%");

let bodyHeight = d3.select("body").node().getBoundingClientRect().height;
let svgWidth = svg._groups[0][0].clientWidth;
let svgHeight = svg._groups[0][0].clientHeight;

let svgWidth90 = svgWidth * 0.8;
let svgHeight90 = svgHeight * 0.8;
let svgMarginX = svgWidth * 0.1;
let svgMarginY = svgHeight * 0.1;
let xOffset = svgMarginX;
let yOffset = svgMarginY;
const baseTemp = 8.66; // lowest temp: 1.684, highest: 13.888
const colors = ["blue", "lightblue", "white", "orange", "red"];

const xScale = d3
  .scaleTime()
  .range([0, svgWidth90])
  .domain([new Date(1753, 0, 1), new Date(2015, 0, 8)]);
const xAxis = d3.axisBottom(xScale).ticks(10);
svg
  .append("g")
  .attr("transform", `translate(${svgMarginX}, ${svgHeight90 + svgMarginY})`)
  .attr("id", "x-axis")
  .call(xAxis);

const yScale = d3
  .scaleBand()
  .range([0, svgHeight90])
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
  .attr("transform", `translate(${svgMarginX}, ${svgMarginY})`)
  .attr("id", "y-axis")
  .call(yAxis);

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((r) => r.json())
  .then((d) => {
    addingCells(d, svgMarginY, svgWidth90, svgHeight90);
    addingLegend(svgMarginY);
  });

function addingCells(d, svgMarginY, svgWidth90, svgHeight90) {
  svg
    .selectAll("rect")
    .data(d.monthlyVariance)
    .enter()
    .append("rect")
    .attr("y", (d, i) => {
      if (i % 12 !== 0) {
        yOffset += svgHeight90 / 12;
      } else {
        yOffset = svgMarginY;
      }
      return yOffset;
    })
    .attr("x", (d, i) => {
      if (i !== 0 && i % 12 === 0) {
        xOffset += svgWidth90 / 263;
      }
      return xOffset;
    })
    .attr("class", "cell")
    .attr("width", svgWidth90 / 263)
    .attr("height", svgHeight90 / 12)
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
      const t = e.target;
      const y = t.y.animVal.value;
      const x = t.x.animVal.value;
      const year = t.__data__.year;
      const month = t.__data__.month;
      const temp = (t.__data__.variance + baseTemp).toFixed(2);

      t.style.opacity = 0.5;
      addingTooltip(x, y, 120, 60, year, month, temp);
    })
    .on("mouseout", (e) => {
      const tooltip = d3.select("#tooltip");
      e.target.style.opacity = 1;
      tooltip.remove();
    });
}

function addingLegend(legendHeight) {
  const prevLegend = d3.select("#legend");
  prevLegend.remove();

  const cellWidthHeight = legendHeight * 0.6;
  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${svgWidth / 2 - cellWidthHeight * 2.5}, 0)`);

  legend
    .selectAll("rect")
    .data(colors)
    .enter()
    .append("rect")
    .attr("y", 0)
    .attr("x", (d, i) => cellWidthHeight * i)
    .attr("width", cellWidthHeight)
    .attr("height", cellWidthHeight)
    .style("fill", (d, i) => colors[i]);

  const xScale = d3
    .scaleThreshold()
    .range(
      Array.from({ length: 7 }, (_, i) =>
        i > 1 ? i * cellWidthHeight - cellWidthHeight : 0
      )
    )
    .domain([1.5, 4, 6.5, 9, 11.5, 14]);
  const xAxis = d3.axisBottom(xScale);
  legend
    .append("g")
    .attr("transform", `translate(${0}, ${cellWidthHeight})`)
    .call(xAxis);

  legend.selectAll("text").style("fill", (_, i) => {
    if (bodyHeight <= 600 && i === 0) {
      return "white";
    } else {
      return "black";
    }
  });
}

function addingTooltip(x, y, w, h, year, month, temp) {
  const g = svg.append("g").attr("id", "tooltip").attr("data-year", year);

  const tooltip = g
    .append("foreignObject")
    .attr("width", w)
    .attr("height", h)
    .html(`<aside id='tooltip'>${year} - ${month} <br> ${temp} ℃ </aside>`);

  if (month <= 6) {
    g.select("foreignObject").attr(
      "transform",
      `translate(${x - w / 2}, ${y + h})`
    );
  } else {
    g.select("foreignObject").attr(
      "transform",
      `translate(${x - w / 2}, ${y - h * 2})`
    );
  }
}

function update() {
  bodyHeight = d3.select("body").node().getBoundingClientRect().height;
  svgWidth = svg._groups[0][0].clientWidth;
  svgHeight = svg._groups[0][0].clientHeight;

  svgWidth90 = svgWidth * 0.8;
  svgHeight90 = svgHeight * 0.8;
  svgMarginX = svgWidth * 0.1;
  svgMarginY = svgHeight * 0.1;
  xOffset = svgMarginX;
  yOffset = svgMarginY;

  xScale.range([0, svgWidth90]);
  d3.select("#x-axis")
    .attr("transform", `translate(${svgMarginX}, ${svgHeight90 + svgMarginY})`)
    .call(xAxis);

  yScale.range([0, svgHeight90]);
  d3.select("#y-axis")
    .attr("transform", `translate(${svgMarginX}, ${svgMarginY})`)
    .call(yAxis);

  svg
    .selectAll("rect")
    .attr("y", (d, i) => {
      if (i % 12 !== 0) {
        yOffset += svgHeight90 / 12;
      } else {
        yOffset = svgMarginY;
      }
      return yOffset;
    })
    .attr("x", (d, i) => {
      if (i !== 0 && i % 12 === 0) {
        xOffset += svgWidth90 / 263;
      }
      return xOffset;
    })
    .attr("width", svgWidth90 / 263)
    .attr("height", svgHeight90 / 12);

  addingLegend(svgMarginY);
}

window.addEventListener("resize", update);

// Non-d3 related code:
const $ = (id) => document.getElementById(id);
// For header:
const title = $("title");
const description = $("description");
const arrow = $("arrow");

title.addEventListener("mouseup", () => {
  const isArrowUp = arrow.textContent.includes("↑");

  if (isArrowUp) {
    arrow.textContent = "↓";
  } else {
    arrow.textContent = "↑";
  }

  description.classList.toggle("visible");
});

// For footer:
const test = $("tests");
const fccTest = $("fcc_test_suite_wrapper");
fccTest.style.visibility = "hidden";
test.addEventListener("mouseup", (i) => {
  if (fccTest.style.visibility === "hidden") {
    fccTest.style.visibility = "visible";
  } else {
    fccTest.style.visibility = "hidden";
  }
});

const infoButton = $("info-b");
const infoAside = $("info-a");
infoButton.addEventListener("mouseup", (i) => {
  infoAside.classList.toggle("visible");
});
