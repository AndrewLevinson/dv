// load data
const rawData = d3.csv("data/clean/movies.csv", d => {
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
  width = window.innerWidth * 0.95;
  height = window.innerHeight * 0.75;
} else if (window.innerWidth <= 925) {
  width = window.innerWidth * 0.95;
  height = window.innerHeight * 0.4;
} else {
  width = window.innerWidth * 0.95;
  height = window.innerHeight * 0.4;
  // height = window.innerHeight * 1.5;
}

let svg = data => {
  // scatter plot
  // linear scale x
  let x = d3
    .scaleLinear()
    .domain([0, 100])
    .range([margin, width - margin]);

  // linear scale y
  // let y = d3
  //   .scaleLinear()
  //   .domain([100, 0])
  //   .range([height, margin]);

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
    .text("Moment")
    .attr("x", margin)
    .attr("y", height - 90);

  graph
    .append("g")
    .attr("id", "xAxisTitle")
    .append("text")
    .text("in Movie %")
    .attr("x", margin)
    .attr("y", height - 72);

  // y axis title
  // let yAxisTitle = graph
  //   .append("g")
  //   .attr("id", "yAxisTitle")
  //   .append("text")
  //   .text("# of Movies")
  //   .attr("x", width / 2)
  //   .attr("y", margin + 20)
  //   .style("text-anchor", "end");

  // Axis ticks
  let xAxis = g =>
    g
      .attr("transform", `translate(${0},${height})`)
      .call(d3.axisBottom(x))
      .attr("id", "xAxis");

  // let yAxis = g =>
  //   g
  //     .attr("transform", `translate(${(width + margin) / 2},0)`)
  //     .call(d3.axisLeft(y))
  //     .attr("id", "yAxis");

  graph.append("g").call(xAxis);
  // graph.append("g").call(yAxis);

  // tooltip method
  var tooltip = {
    element: null,
    init: function() {
      this.element = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    },
    show: function(t) {
      this.element
        .html(t)
        .transition()
        .duration(200)
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY - 60 + "px")
        .style("opacity", 0.95);
    },
    move: function() {
      this.element
        .transition()
        .duration(30)
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY - 60 + "px")
        .style("opacity", 0.95);
    },
    hide: function() {
      this.element
        .transition()
        .duration(500)
        .style("opacity", 0);
    }
  };
  tooltip.init();

  // distribution and curves
  var mean1 = d3.mean(data, function(d) {
    return (d.pp1 / d.runtime) * 100;
  });
  var mean2 = d3.mean(data, function(d) {
    return (d.pp2 / d.runtime) * 100;
  });
  var mean3 = d3.mean(data, function(d) {
    return (d.pp3 / d.runtime) * 100;
  });
  var mean4 = d3.mean(data, function(d) {
    return (d.pp4 / d.runtime) * 100;
  });
  var mean5 = d3.mean(data, function(d) {
    return (d.pp5 / d.runtime) * 100;
  });

  var sd1 = d3.deviation(data, function(d) {
    return (d.pp1 / d.runtime) * 100;
  });
  var sd2 = d3.deviation(data, function(d) {
    return (d.pp2 / d.runtime) * 100;
  });
  var sd3 = d3.deviation(data, function(d) {
    return (d.pp3 / d.runtime) * 100;
  });
  var sd4 = d3.deviation(data, function(d) {
    return (d.pp4 / d.runtime) * 100;
  });
  var sd5 = d3.deviation(data, function(d) {
    return (d.pp5 / d.runtime) * 100;
  });

  // let pp1Min = d3.min(data, d => {
  //   return (d.pp1 / d.runtime) * 100;
  // });
  // let pp1Max = d3.max(data, d => {
  //   return (d.pp1 / d.runtime) * 100;
  // });

  var array1 = normalDist(mean1, sd1);
  var array2 = normalDist(mean2, sd2);
  var array3 = normalDist(mean3, sd3);
  var array4 = normalDist(mean4, sd4);
  var array5 = normalDist(mean5, sd5);

  // var xLine = d3.scaleLinear().rangeRound([margin, 100]);

  //Min q
  var d1 = d3.min(array1, function(d) {
    return d.q;
  });
  var d2 = d3.min(array2, function(d) {
    return d.q;
  });
  var d3p = d3.min(array3, function(d) {
    return d.q;
  });
  var d4 = d3.min(array4, function(d) {
    return d.q;
  });
  var d5 = d3.min(array5, function(d) {
    return d.q;
  });
  var min_d = d3.min([d1, d2, d3p, d4, d5]);
  // var min_d = d3.min([d1]);

  //Max q
  d1 = d3.max(array1, function(d) {
    return d.q;
  });
  d2 = d3.max(array2, function(d) {
    return d.q;
  });
  d3p = d3.max(array3, function(d) {
    return d.q;
  });
  d4 = d3.max(array4, function(d) {
    return d.q;
  });
  d5 = d3.max(array5, function(d) {
    return d.q;
  });
  var max_d = d3.max([d1, d2, d3p, d4, d5]);
  // var max_d = d3.max([d1]);

  //Max p
  d1 = d3.max(array1, function(d) {
    return d.p;
  });
  d2 = d3.max(array2, function(d) {
    return d.p;
  });
  d3p = d3.max(array3, function(d) {
    return d.p;
  });
  d4 = d3.max(array4, function(d) {
    return d.p;
  });
  d5 = d3.max(array5, function(d) {
    return d.p;
  });
  var max_p = d3.max([d1, d2, d3p, d4, d5]);

  // console.log("min_d", min_d);
  // console.log("max_d", max_d);
  // xLine.domain([0, 100]).nice;

  var y = d3
    .scaleLinear()
    .domain([0, max_p])
    .range([height, 0]);

  var line = d3
    .line()
    .x(function(d) {
      return x(d.q);
    })
    .y(function(d) {
      return y(d.p);
    });

  let pathGroup = graph.append("g").attr("id", "path-group");

  pathGroup
    .insert("path")
    .datum(array1)
    .attr("class", "line")
    .attr("id", "plot-one")
    .attr("d", line)
    .on("mouseover", function(d) {
      d3.select(this).moveToFront();
      pathGroup.attr("class", "inactive");
      d3.select(this).attr("class", "active line");
      tooltip.show(
        `<div class="total"><h5>Plot Point 1: Inciting Incident</h5></div>
        <div class="total double">Description</div>
        Often called the point of attack, the inciting incident is the first premonition of impending trouble, dilemma, or circumstance that will create the main tension of the story. It usually falls at the end of the first sequence. But it can sometimes appear in the first few minutes of a film.<br><br>
        <div class="double total">Moment in Movie</div>
        Theory: <span class="total">13%</span> || Popular: <span class="total">${numFormatF(
          mean1
        )}%</span>`
      );
    });

  pathGroup
    .append("path")
    .datum(array2)
    .attr("d", line)
    .attr("class", "line")
    .attr("id", "plot-two")
    .on("mouseover", function(d) {
      d3.select(this).moveToFront();
      pathGroup.attr("class", "inactive");
      d3.select(this).attr("class", "active line");
      tooltip.show(
        `<div class="total"><h5>Plot Point 2: The Lock In</h5></div>
        <div class="total double">Description</div>
        The protagonist is locked into the predicament that is central to the story, which occurs at the end of Act One, This lock in, therefore, propels the protagonist into a new direction in order to accomplish his/her new objective throughout the second act.<br><br>
        <div class="double total">Moment in Movie</div>
        Theory: <span class="total">25%</span> || Popular: <span class="total">${numFormatF(
          mean2
        )}%</span>
        `
      );
    });

  pathGroup
    .append("path")
    .datum(array3)
    .attr("d", line)
    .attr("class", "line")
    .attr("id", "plot-three")
    .on("mouseover", function(d) {
      d3.select(this).moveToFront();
      pathGroup.attr("class", "inactive");
      d3.select(this).attr("class", "active line");
      tooltip.show(
        `
        <div class="total"><h5>Plot Point 3: First Culmination (midpoint)</h5></div>
        <div class="total double">Description</div>
       The first culmination generally occurs around the midpoint of the second act and is a pivotal moment in the story but not as critical as the Lock In or Main Culmination. Consider the first culmination as the second highest or second lowest point in Act Two, the second highest hurdle to be faced.<br><br>
       <div class="double total">Moment in Movie</div>
       Theory: <span class="total">50%</span> || Popular: <span class="total">${numFormatF(
         mean3
       )}%</span>
       `
      );
    });

  pathGroup
    .append("path")
    .datum(array4)
    .attr("d", line)
    .attr("class", "line")
    .attr("id", "plot-four")
    .on("mouseover", function(d) {
      d3.select(this).moveToFront();
      pathGroup.attr("class", "inactive");
      d3.select(this).attr("class", "active line");
      tooltip.show(
        `
        <div class="total"><h5>Plot Point 4: Main Culmination</h5></div>
        <div class="total double">Description</div>
       The final culmination occurs at the end of the second act and brings the main tension to a close while simultaneously helping to create a new tension for Act Three.<br><br>
       <div class="double total">Moment in Movie</div>
       Theory: <span class="total">75%</span> || Popular: <span class="total">${numFormatF(
         mean4
       )}%</span>
       `
      );
    });

  pathGroup
    .append("path")
    .datum(array5)
    .attr("d", line)
    .attr("class", "line")
    .attr("id", "plot-five")
    .on("mouseover", function(d) {
      d3.select(this).moveToFront();
      pathGroup.attr("class", "inactive");
      d3.select(this).attr("class", "active line");
      tooltip.show(
        `
        <div class="total"><h5>Plot Point 5: Third Act Twist</h5></div>
        <div class="total double">Description</div>        
        The twist is an unexpected turn of events in the third act. Without a twist, the third act can seem too linear and predictable. It can also be the last test of the hero.<br><br>
        <div class="double total">Moment in Movie</div>
        Theory: <span class="total">88%</span> || Popular: <span class="total">${numFormatF(
          mean5
        )}%</span>
        `
      );
    });

  pathGroup
    .on("mousemove", function(d) {
      tooltip.move();
    })
    .on("mouseout", function(d) {
      pathGroup.attr("class", "line");
      tooltip.hide();
    });

  function normalDist(mean, sd) {
    dataLine = [];
    for (var i = mean - 4 * sd; i < mean + 4 * sd; i += 1) {
      q = i;
      p = jStat.normal.pdf(i, mean, sd);
      arr = {
        q: q,
        p: p
      };
      dataLine.push(arr);
    }
    return dataLine;
  }
  // console.log(dataLine);

  // add group with points and data
  let group = graph.append("g").attr("id", "group");
  // move to front or back on hover
  // https://github.com/wbkd/d3-extended
  d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
      this.parentNode.appendChild(this);
    });
  };
  d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
      var firstChild = this.parentNode.firstChild;
      if (firstChild) {
        this.parentNode.insertBefore(this, firstChild);
      }
    });
  };

  let reset = document.getElementById("reset");
  reset.addEventListener("click", function() {
    points.attr("class", function(d) {
      return d.movieName;
    });
    reset.style.opacity = 0;
  });

  let points = group
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("class", d => {
      return `${d.movieName}`;
    });

  points
    .on("mouseover", function(d) {
      d3.select(this).moveToFront();
      points.attr("class", "inactive");
      d3.select(this).attr("class", "active");
      tooltip.show(
        `<strong>${d.movieName}</strong><br>Click to see details below ↓`
      );
      reset.style.opacity = 1;
    })
    .on("click", function(d) {
      d3.select(this).moveToFront();
      points.attr("class", "inactive");
      d3.select(this).attr("class", "active");
    })
    .on("mousemove", function(d) {
      // points.attr("class", function(d) {
      //   return d.movieName;
      // });
      tooltip.move();
    })
    .on("mouseout", function(d) {
      // points.attr("class", function(d) {
      //   return d.movieName;
      // });
      tooltip.hide();
    });

  let barWidth = 18;

  let points1 = points
    .append("rect")
    .attr("width", barWidth) // TODO
    .attr("height", (d, i) => {
      return 50;
    }) // TODO
    .attr("x", (d, i) => {
      return x((d.pp1 / d.runtime) * 100);
    })
    .attr("y", (d, i) => {
      return height - 50;
    })
    .attr("stroke", "#3d3d3d")
    .attr("id", "plot-one");

  let points2 = points
    .append("rect")
    .attr("width", barWidth) // TODO
    .attr("height", (d, i) => {
      return 50;
    }) // TODO
    .attr("x", (d, i) => {
      return x((d.pp2 / d.runtime) * 100);
    })
    .attr("y", (d, i) => {
      return height - margin;
    })
    .attr("stroke", "#3d3d3d")
    .attr("id", "plot-two");

  let points3 = points
    .append("rect")
    .attr("width", barWidth) // TODO
    .attr("height", (d, i) => {
      return 50;
    }) // TODO
    .attr("x", (d, i) => {
      return x((d.pp3 / d.runtime) * 100);
    })
    .attr("y", (d, i) => {
      return height - margin;
    })
    .attr("stroke", "#3d3d3d")
    .attr("id", "plot-three");

  let points4 = points
    .append("rect")
    .attr("width", barWidth) // TODO
    .attr("height", (d, i) => {
      return 50;
    }) // TODO
    .attr("x", (d, i) => {
      return x((d.pp4 / d.runtime) * 100);
    })
    .attr("y", (d, i) => {
      return height - margin;
    })
    .attr("stroke", "#3d3d3d")
    .attr("id", "plot-four");

  let points5 = points
    .append("rect")
    .attr("width", barWidth) // TODO
    .attr("height", (d, i) => {
      return 50;
    }) // TODO
    .attr("x", (d, i) => {
      return x((d.pp5 / d.runtime) * 100);
    })
    .attr("y", (d, i) => {
      return height - margin;
    })
    .attr("stroke", "#3d3d3d")
    .attr("id", "plot-five");

  // dynamic info tables
  const numFormatT = d3.format(",d"); // commas
  // const numFormatF = d3.format(".2f"); // 2 decimals
  const numFormatF = d3.format(".0f"); // 0 decimals

  points.on("click", function(d, i) {
    // dynamically set title to active movie
    let activeMove = document.getElementById("active-movie");
    activeMove.innerHTML = `${d.movieName}`;
    reset.style.opacity = 1;
    let infoTable = document.querySelector(".info-table");

    infoTable.innerHTML = `
    <table>
        <caption>
        </caption>
        <thead>
          <tr>
          <th class="left double">Film Info</th>
          <th class="right double"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="left tick">Genre</td>
            <td class="negative">${d.genre[0].name}</td>
          </tr>
          <tr>
          <td class="left tick">IMDB Rating</td>
          <td class="negative">${d.rating}</td>
        </tr>
          <tr>
            <td class="left tick double">Revenue</td>
            <td class="negative double">$${numFormatT(
              d.revenue / 1000000
            )}MM</td>
          </tr>
          </tbody>
          </table>`;

    let pointsText = document.querySelector(".points-text");
    pointsText.innerHTML = `
    <table>
      <caption>
      </caption>
      <thead>
        <tr>
          <th class="left double" colspan="1">Plot Point</th>
          <th class="left double" colspan="1">Moment (${d.runtime} pp)</th>
          <th class="left double" colspan="1">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="left bottom"><span class="plot-icon" id="plot-one"></span><span id="nowrap">Inciting Incident<span></td>
          <td class="left bottom">Page ${d.pp1} | <strong>${numFormatF(
      (d.pp1 / d.runtime) * 100
    )}%</strong></td>
          <td class="left bottom"><div class="plot-desc">${
            d.inciting
          }</div></td>
        </tr>
        <tr>
        <td class="left bottom"><span class="plot-icon" id="plot-two"></span><span id="nowrap">Lock In<span></td>
        <td class="left bottom">Page ${d.pp2} | <strong>${numFormatF(
      (d.pp2 / d.runtime) * 100
    )}%</strong></td>
        <td class="left bottom"><div class="plot-desc">${d.lockIn}</div></td>
      </tr>
        <td class="left bottom"><span class="plot-icon" id="plot-three"></span><span id="nowrap">First Culmination<span></td>
        <td class="left bottom">Page ${d.pp3} | <strong>${numFormatF(
      (d.pp3 / d.runtime) * 100
    )}%</strong></td>
        <td class="left bottom"><div class="plot-desc">${d.midpoint}</div></td>
      </tr>
      </tr>
        <td class="left bottom"><span class="plot-icon" id="plot-four"></span><span id="nowrap">Main Culmination<span></td>
        <td class="left bottom">Page ${d.pp4} | <strong>${numFormatF(
      (d.pp4 / d.runtime) * 100
    )}%</strong></td>
        <td class="left bottom"><div class="plot-desc">${
          d.mainCulmination
        }</div></td>
    </tr>
    </tr>
    <td class="left bottom"><span class="plot-icon" id="plot-five"></span><span id="nowrap">Third Act Twist<span></td>
    <td class="left bottom">Page ${d.pp5} | <strong>${numFormatF(
      (d.pp5 / d.runtime) * 100
    )}%</strong></td>
    <td class="left bottom"><div class="plot-desc">${d.twist}</div></td>
</tr>
     </tbody>
    </table>`;
  });
};
