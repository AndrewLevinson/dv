// load data
const rawData = d3.csv("../data/clean/movies.csv", d => {
  return {
    movieName: d["Unique Films"],
    revenue: +d["revenue"],
    rating: +d["rating"],
    genre: JSON.parse(d["genre"]),
    popularity: +d["popularity"],
    inciting: d["Inciting Incident"],
    pp1: +d["pp1"],
    lockIn: d["Lock In"],
    pp2: +d["pp2"],
    midpoint: d["First Culmination (Midpoint)"],
    pp3: +d["pp3"],
    mainCulmination: d["Main Culmination (End of Act Two)"],
    pp4: +d["pp4"],
    twist: d["Third Act Twist"],
    pp5: +d["pp5"],
    runtime: +d["runtime"]
  };
});

rawData.then(data => {
  const dataClean = data.filter(d => d.pp1 > 0);
  svg(dataClean);
  console.log(dataClean);
});

// global svg variables
let margin = 50;
let marginBottom = 0;
let marginRight = 0;
let width, height;

// update svg sizing to work with breakpoints in css media queries
if (window.innerWidth <= 550) {
  width = window.innerWidth * 0.925;
  height = window.innerHeight * 0.75;
} else if (window.innerWidth <= 925) {
  width = window.innerWidth * 0.925;
  height = window.innerHeight * 0.75;
} else {
  width = window.innerWidth * 0.9;
  // height = window.innerHeight * 0.8;
  height = window.innerHeight * 1.5;
}

let svg = data => {
  // scatter plot
  // linear scale x
  let x = d3
    .scaleLinear()
    // .domain([5, 9])
    .domain([18, 200])

    .range([margin, width]);

  // linear scale y
  let y = d3
    .scaleLinear()
    .domain([100, 0])
    .range([height, margin]);

  let graph = d3
    .select(".chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height + 20);

  // x axis title
  let xAxisTitle = graph
    .append("g")
    .attr("id", "xAxisTitle")
    .append("text")
    .text("Rating")
    .attr("x", width)
    .attr("y", margin + 10)
    .style("text-anchor", "end");

  // y axis title
  let yAxisTitle = graph
    .append("g")
    .attr("id", "yAxisTitle")
    .append("text")
    .text("Percentage time through movie")
    .attr("x", width / 2)
    .attr("y", margin + 20)
    .style("text-anchor", "end");

  // Axis ticks
  let xAxis = g =>
    g
      .attr("transform", `translate(${0},${margin})`)
      .call(d3.axisTop(x))
      .attr("id", "xAxis");

  let yAxis = g =>
    g
      .attr("transform", `translate(${(width + margin) / 2},0)`)
      .call(d3.axisLeft(y))
      .attr("id", "yAxis");

  graph.append("g").call(xAxis);
  graph.append("g").call(yAxis);

  // add group with points and data
  let group = graph.append("g").attr("id", "group");
  let points = group
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    // .attr("class", "points");
    .attr("class", d => {
      return d.movieName;
    });

  // ppt1 theory
  points
    .append("circle")
    .attr("cy", d => {
      return y((12 / 120) * 100);
    })
    .attr("cx", d => {
      return (width + margin) / 2;
    })
    .attr("r", d => {
      return 20;
    })
    // .attr("id", "theory-one")
    .attr("id", "plot-one");

  // ppt2 theory
  points
    .append("circle")
    .attr("cy", d => {
      return y((30 / 120) * 100);
    })
    .attr("cx", d => {
      // return x(7);
      return (width + margin) / 2;
    })
    .attr("r", d => {
      return 20;
    })
    .attr("id", "theory-two")
    .attr("id", "plot-two");
  // ppt3 theory
  points
    .append("circle")
    .attr("cy", d => {
      return y((60 / 120) * 100);
    })
    .attr("cx", d => {
      // return x(7);
      return (width + margin) / 2;
    })
    .attr("r", d => {
      return 20;
    })
    .attr("id", "theory-three")
    .attr("id", "plot-three");
  // ppt4 theory
  points
    .append("circle")
    .attr("cy", d => {
      return y((90 / 120) * 100);
    })
    .attr("cx", d => {
      // return x(7);
      return (width + margin) / 2;
    })
    .attr("r", d => {
      return 20;
    })
    .attr("id", "theory-four")
    .attr("id", "plot-four");

  // ppt5 theory
  points
    .append("circle")
    .attr("cy", d => {
      return y((110 / 120) * 100);
    })
    .attr("cx", d => {
      // return x(7);
      return (width + margin) / 2;
    })
    .attr("r", d => {
      return 20;
    })
    .attr("id", "theory-five")
    .attr("id", "plot-five");

  // points
  //   .on("mouseover", function() {
  //     d3.select("#group")
  //       .selectAll("g")
  //       .attr("class", "inactive");
  //     d3.select(this).attr("class", "active");
  //     d3.select(this)
  //       .select("text")
  //       .text(d => {
  //         return `${d.country} (${d.access}%, ${d.ease})`;
  //       });
  //   })

  //   .on("mouseout", function() {
  //     d3.select("#group")
  //       .selectAll("g")
  //       .attr("class", "up");
  //     d3.select(this)
  //       .select("text")
  //       .text(d => {
  //         return d.country;
  //       });
  //   });

  // let revenueFactor = 0.00000003;
  let revenueFactor = 0;

  let revenueMin = 10;

  // plot points - plot point 1
  points
    .append("circle")
    .attr("cy", d => {
      return y((d.pp1 / d.runtime) * 100);
    })
    .attr("cx", d => {
      return x(d.popularity);
    })
    .transition()
    .delay(function(d, i) {
      return i * 20;
    }) // <-- delay as a function of i
    .attr("r", d => {
      return d.revenue * revenueFactor + revenueMin;
    })
    .attr("id", "plot-one");

  // text labels on point one
  // points
  //   .on("mouseover", function(d, i) {
  //     d3.select(this)
  //       .append("text")
  //       // .attr("text-anchor", "end")
  //       .attr("x", d => {
  //         return x(d.popularity) + 8;
  //       })
  //       .attr("y", d => {
  //         return y((d.pp1 / d.runtime) * 100) + 4;
  //       })
  //       .text(d => {
  //         return `${d.movieName}:1, ${d.popularity}, ${d.pp1}`;
  //       });
  //   })
  //   .on("mouseout", function(d, i) {
  //     d3.select(this)
  //       .select("text")
  //       .text(d => {
  //         return;
  //       });
  //   });

  // plot points - plot point 2
  points
    .append("circle")
    .attr("cy", d => {
      return y((d.pp2 / d.runtime) * 100);
    })
    .attr("cx", d => {
      return x(d.popularity);
    })
    .transition()
    .delay(function(d, i) {
      return i * 20;
    }) // <-- delay as a function of i
    .attr("r", d => {
      return d.revenue * revenueFactor + revenueMin;
    })
    .attr("id", "plot-two");

  // // text labels on point 2
  // points
  //   .append("text")
  //   // .attr("text-anchor", "end")
  //   .attr("x", d => {
  //     return x(d.popularity) + 8;
  //   })
  //   .attr("y", d => {
  //     return y((d.pp2 / d.runtime) * 100) + 4;
  //   })
  //   .transition()
  //   .delay(function(d, i) {
  //     return i * 20;
  //   }) // <-- delay as a function of i
  //   .text(d => {
  //     return `${d.movieName}:2, ${d.popularity}, ${d.pp2}`;
  //   });

  // plot points - plot point 3
  points
    .append("circle")
    .attr("cy", d => {
      return y((d.pp3 / d.runtime) * 100);
    })
    .attr("cx", d => {
      return x(d.popularity);
    })
    .transition()
    .delay(function(d, i) {
      return i * 20;
    }) // <-- delay as a function of i
    .attr("r", d => {
      return d.revenue * revenueFactor + revenueMin;
    })
    .attr("id", "plot-three");

  // text labels on point 3
  // points
  //   .append("text")
  //   // .attr("text-anchor", "end")
  //   .attr("x", d => {
  //     return x(d.popularity) + 8;
  //   })
  //   .attr("y", d => {
  //     return y((d.pp3 / d.runtime) * 100) + 4;
  //   })
  //   .transition()
  //   .delay(function(d, i) {
  //     return i * 20;
  //   }) // <-- delay as a function of i
  //   .text(d => {
  //     return `${d.movieName}:3, ${d.popularity}, ${d.pp2}`;
  //   });

  // plot points - plot point 4
  points
    .append("circle")
    .attr("cy", d => {
      return y((d.pp4 / d.runtime) * 100);
    })
    .attr("cx", d => {
      return x(d.popularity);
    })
    .transition()
    .delay(function(d, i) {
      return i * 20;
    }) // <-- delay as a function of i
    .attr("r", d => {
      return d.revenue * revenueFactor + revenueMin;
    })
    .attr("id", "plot-four");

  // text labels on point 4
  // points
  //   .append("text")
  //   // .attr("text-anchor", "end")
  //   .attr("x", d => {
  //     return x(d.popularity) + 8;
  //   })
  //   .attr("y", d => {
  //     return y((d.pp4 / d.runtime) * 100) + 4;
  //   })
  //   .transition()
  //   .delay(function(d, i) {
  //     return i * 20;
  //   }) // <-- delay as a function of i
  //   .text(d => {
  //     return `${d.movieName}:4, ${d.popularity}, ${d.pp4}`;
  //   });

  // plot points - plot point 5
  points
    .append("circle")
    .attr("cy", d => {
      return y((d.pp5 / d.runtime) * 100);
    })
    .attr("cx", d => {
      return x(d.popularity);
    })
    .transition()
    .delay(function(d, i) {
      return i * 20;
    }) // <-- delay as a function of i
    .attr("r", d => {
      return d.revenue * revenueFactor + revenueMin;
    })
    .attr("id", "plot-five");

  // text labels on point 5
  // points
  //   .append("text")
  //   // .attr("text-anchor", "end")
  //   .attr("x", d => {
  //     return x(d.popularity) + 8;
  //   })
  //   .attr("y", d => {
  //     return y((d.pp5 / d.runtime) * 100) + 4;
  //   })
  //   .transition()
  //   .delay(function(d, i) {
  //     return i * 20;
  //   }) // <-- delay as a function of i
  //   .text(d => {
  //     return `${d.movieName}:5, ${d.popularity}, ${d.pp5}`;
  //   });

  points
    .append("text")
    .attr("x", d => {
      // return x(d.popularity) + 8;
      return width * 0.95;
    })
    .attr("y", d => {
      // return y((d.pp2 / d.runtime) * 100) + 4;
      return height * 0.1;
    })
    .attr("text-anchor", "END")
    .text(d => {
      return;
    });

  points
    .on("mouseover", function(d) {
      d3.select(this)
        .select("text")
        .text(d => {
          return `${d.movieName}, ${d.genre[0].name}`;
        });
    })
    .on("mouseout", function(d) {
      d3.select(this)
        .select("text")
        .text(d => {
          return;
        });
    });
};
