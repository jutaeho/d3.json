const fc = require('../../data/topo_korea.json');
const d3 = require('d3');

const proj = d3.geoMercator().translate([0,0]).scale(1);
const path = d3.geoPath().projection(proj);
const color = d3.scaleQuantize([1, fc.features.length], d3.schemeGreens[9]);

(function(_w, _d) {


    const width = 1200;
    const height = 900;

    var b = path.bounds(fc);
    var s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    const zoom = d3.zoom().scaleExtent([1,8]).on("zoom", (event) => {
        const {transform} = event;
        d3.selectAll("g")
        .attr("transform", transform)
        .attr("stroke-width", 1 / transform.k);
    });

    proj.scale(s).translate(t);

    d3.select("#map").append("div").attr("class", "tooltip");

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .selectAll("path")
            .data(fc.features)
            .join("path")
            .attr("fill", (d, i) => color(i))
            .attr("stroke", "#fff")
            .attr("cursor", "pointer")
        .attr("d", path)
        .on("mouseover", function (e, f) {

            d3.select('.tooltip')
                .transition()
                .duration(50)
                .style("left", `${e.pageX + 28}px`)
                .style("top",`${e.pageY - 28}px`);

            d3.select('.tooltip')
                .classed("active", true)
                .html(`<p>${f.properties.sgg_nm}</p>`);

            d3.select(this).classed("active", true);

        })
        .on("mouseout", function (d) {
            d3.select('.tooltip')
                .classed("active", false);

            d3.select(this).classed("active", false);
        });

    svg.call(zoom);



}(this,document));
