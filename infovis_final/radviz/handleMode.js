function askForPermission(mode) {
    toggleControl(mode);
    var r = confirm('WARNING: It might take several seconds to ready the static animation.\n\n' + 
    'The message "LOADING" across the screen will disappear to let you know when it is ready.\n\n' + 
    'I apologize for the inconvenience and thank you for your patience.');
    if (!r) {
        $("div.loadingText").remove();
        $("div#control0").removeClass("unclickable");
        $("div#control").removeClass("unclickable");
        $("input[value=dynamic]:radio").prop("checked", true);
    }
    return r;
}
function toggleControl(mode) {
    if (mode == "dynamic") {
        $("div#control0").removeClass("unclickable");
        $("div#control").removeClass("unclickable");
    } else if (mode == "static") {
        $("body").prepend("<div class=loadingText>LOADING</div>");
        $("div#control0").addClass("unclickable");
        $("div#control").addClass("unclickable");
    }
}

function changeMode(mode) { 
    $("line").remove();
    $("g.s").remove();
    $("g.d").remove();
    if (mode == "dynamic") {
        d3.selectAll("g.s").style("display", "none");
        d3.selectAll("g.d").style("display", null);
        d3.selectAll("line").style("display", null);
        makeTransition($("#yeartext").html());
    } else if (mode == "static") {
        precalcNodePositions();
        initialDisplay_onStaticNodes();
        d3.selectAll("g.d").style("display", "none");
        d3.selectAll("line").style("display", "none");
        d3.selectAll("g.s").style("display", null);
        makeStaticTransition($("#yeartext").html());
    }
}

function makeTransition_stabilize(slideryear) {
    inputJson = currdata[slideryear];
    update();
    var safety = 0;
    while (force.alpha() > 0.01) {
        force.tick();
        if (safety++ > 500) {
            break;
        }
    }
    return inputJson;
}

var precalcNodes = {}, staticInputNodes;
function precalcNodePositions() {
    for (var y = startYear; y < endYear + 1; y++) {
        var h = makeTransition_stabilize(y);
        console.log("Uploading year", y, "... done");
        precalcNodes[y] = h.n;
    }
    $(".loadingText").remove();
}

function initialDisplay_onStaticNodes() {
    staticInputNodes = precalcNodes[startYear];

    var node = vis.selectAll("g.s")
                .data(staticInputNodes)
                .enter().append("g")
                .attr("class", "s")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("circle")
                .attr("type", function(d) { return d.type; })
                .attr("r", function(d) { return d.radius; })
                .style("stroke", "black")
                .style("fill", function(d) { return d.fill; })
                .style("opacity", function(d) {
                    if (d.class == "notUN") return 0.0;
                    return 1.0;
                });
        //        .on("mouseover", function(d){return tooltip.style("visibility", "visible").text(d.key);})
        //        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        //        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

        node.append("text")
                .text(function(d) {
                        if (d.class != "notUN") return d.key;
                    })
                .style("font-size", function(d) {
                    return "7px";
                })
                .attr("dy", ".35em");
        
        node.attr("", function(d){
            if (d.class == "anchor") {
                var sel = d3.select(this);
                sel.moveToFront();
            }
        });

}

function makeStaticTransition(slideryear) {
    staticInputNodes = precalcNodes[slideryear];

    var node = vis.selectAll("g.s")
                .data(staticInputNodes)
                .transition()
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.select("circle")
                .attr("type", function(d) { return d.type; })
                .attr("r", function(d) { return d.radius; })
                .style("stroke", "black")
                .style("fill", function(d) { return d.fill; })
                .style("opacity", function(d) {
                    if (d.class == "notUN") return 0.0;
                    return 1.0;
                });

        node.select("text")
                .text(function(d) {
                        if (d.class != "notUN") return d.key;
                    })
                .style("font-size", function(d) {
                    return "7px";
                })
                .attr("dy", ".35em");
        
}

