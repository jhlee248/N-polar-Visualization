function changeAnchors(newAnchors) {
    var newAnchorPos = {};

    // update on anchor positions
    for (var i = 0; i < newAnchors.length; i++) {
        var cc3 = newAnchors[i];
        if (cc3 in anchorPos) { // already an anchor
            var currPos = inputJson.n[nodeInfo[cc3].index];
            newAnchorPos[cc3] = {"x": currPos.x, "y": currPos.y};
        } else {
            newAnchorPos[cc3] = calcEmptyAnchorPos();//{"x":null, "y": null};
        }
    }

    anchorPos = newAnchorPos;
    updateOnAnchorSet();
}

function calcEmptyAnchorPos() {
    var radian0 = {"x": centerX, "y": centerY - bigRadius};
    var center = {"x": centerX, "y": centerY};

    // get positions of all anchors
    var positions = [];
    for (var cc3 in anchorPos) {
        var currPos = inputJson.n[nodeInfo[cc3].index];
        positions.push({"cc3": cc3, "x": currPos.x, "y": currPos.y});
    }

    // handle the edge cases
    if (positions.length == 0) return radian0;
    if (positions.length == 1) {
        return {"x": centerX*2 - positions[0].x, "y": centerY*2 - positions[0].y};
    }

    // sort them clockwise
    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        pos["radian"] = angleFromRadian0(pos);
    }
    positions.sort(function(a,b) {
        return a.radian - b.radian;
    });

    // compare each consecutive pair and find the biggest arc
    var angleSoFar = 0, bigangle_a, bigangle_b, biggesta, biggestb, len = positions.length;
    var angle1; 
    for (var i = 0; i < len; i++) {
        var a = positions[i], b = positions[(i+1)%len];
        // calc the arc length - or just the angle
        var anglea = angleFromRadian0(a), angleb = angleFromRadian0(b);
        if ((i+1) == len) angleb = 2 * Math.PI + angleb;
        var currangle = angleb - anglea;
        if (currangle > angleSoFar) {
            biggesta = a; biggestb = b;
            angle1 = (anglea + angleb) * 0.5;
            angleSoFar = currangle;
        }
    }

    // get the mid point of the biggest arc
    //var average = {"x": (biggesta.x + biggestb.x)/2, "y": (biggesta.y + biggestb.y)/2};
    //var angle1 = angleFromRadian0(average);

    var p1 = {"x": centerX + bigRadius * Math.sin(angle1), "y": centerY - bigRadius * Math.cos(angle1)};
    return p1;
}

/**
 * Calculates the angle (in radians) between two vectors pointing outward from one center
 *
 * @param A first point
 * @param B second point
 * @param C center point
 */
function angleFromRadian0(B) {
    var A = {"x": centerX, "y": centerY - bigRadius}; // radian0
    var C = {"x": centerX, "y": centerY}; // center
    var a = Math.sqrt(Math.pow(B.x-C.x,2) + Math.pow(B.y-C.y,2));
    var b = Math.sqrt(Math.pow(C.x-A.x,2) + Math.pow(C.y-A.y,2));
    var c = Math.sqrt(Math.pow(A.x-B.x,2) + Math.pow(A.y-B.y,2));
    var angle = Math.acos((a*a + b*b - c*c)/(2*a*b));
   
    if (Math.round(B.x) < centerX) return 2 * Math.PI - angle;
    return angle;
}
/*function findCenterAngle(A, B, C) {
    var a = Math.sqrt(Math.pow(B.x-C.x,2) + Math.pow(B.y-C.y,2));
    var b = Math.sqrt(Math.pow(C.x-A.x,2) + Math.pow(C.y-A.y,2));
    var c = Math.sqrt(Math.pow(A.x-B.x,2) + Math.pow(A.y-B.y,2));
    var angle = Math.acos((a*a + b*b - c*c)/(2*a*b));
    
    return angle;
}*/

function setAnchorPos() {
    //(function() {
        var i = 0;
        for (var anchor in anchorPos) {
            var numAnchors = Object.keys(anchorPos).length;
            var x = bigRadius * Math.sin( (2*Math.PI) * (i / numAnchors) );
            var y = bigRadius * Math.cos( (2*Math.PI) * (i / numAnchors) );
            if (anchorPos[anchor].x == null || anchorPos[anchor].y == null) 
                anchorPos[anchor] = {"x": centerX + x, "y": centerY - y, };
            i++;
        }
    //})();
}
