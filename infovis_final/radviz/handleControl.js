var check = false;
function CheckAll(){

    var chk = document.getElementsByName("del_unit[]");
    //if(check == false){
    //    check = true;
    //    for(var i=0; i<chk.length;i++){                                                                    
    //        chk[i].checked = true;     //모두 체크
    //    }
    //}else{
        //check = false;
        for(var i=0; i<chk.length;i++){                                                                    
            chk[i].checked = false;     //모두 해제
        }
    //}
}

function selectDelRow() {
    var chk = document.getElementsByName("del_unit[]"); // 체크박스객체를 담는다
    var len = chk.length;    //체크박스의 전체 개수
    var checkRow = '';      //체크된 체크박스의 value를 담기위한 변수
    var checkCnt = 0;        //체크된 체크박스의 개수
    var checkLast = '';      //체크된 체크박스 중 마지막 체크박스의 인덱스를 담기위한 변수
    var rowids = [];             //체크된 체크박스의 모든 value 값 담
    var cnt = 0;


    for (var i=0; i<len; i++) {
        if (chk[i].checked == true) {
            checkCnt++;        //체크된 체크박스의 개수
            checkLast = i;     //체크된 체크박스의 인덱스
        }
    } 

    for(var i=0; i<len; i++){
        if (chk[i].checked == true){  //체크가 되어있는 값 구분
            checkRow = chk[i].value;
                
            if (checkCnt == 1){                            //체크된 체크박스의 개수가 한 개 일때,
                rowids.push(checkRow);        //'value'의 형태 (뒤에 ,(콤마)가 붙지않게)
            } else {                                            //체크된 체크박스의 개수가 여러 개 일때,
                if (i == checkLast){                     //체크된 체크박스 중 마지막 체크박스일 때,
                    rowids.push(checkRow);  //'value'의 형태 (뒤에 ,(콤마)가 붙지않게)
                } else {
                    rowids.push(checkRow);  //'value',의 형태 (뒤에 ,(콤마)가 붙게)                  
                }                 
            }
            cnt++;
            checkRow = '';    //checkRow초기화.
        }
    }
    changeAnchors(rowids);//['value1', 'value2', 'value3'] 의 형태로 출력이 된다.
}

function sorting(){
    var lis = document.getElementsByClassName('nat onoff-menu'); // lis 에 div 를 가지고 들어온다.
    var inputs = document.getElementsByTagName('input');
    var textarea = /[A-Z]/gi;
    
    
    for(var i = 0; i < inputs.length; i++){
        if(inputs[i].getAttribute('type') == 'text')
            textarea = inputs[i].value;
    }
    
        
            var a = [];

            for (var i = 0; i < lis.length; i++) {
                a[i] = lis[i].textContent.trim();
            }
            
            var c = document.getElementById('nat_list');

            var childDivs = document.getElementById('nat_list').getElementsByTagName('div');


            var childDiv = [];
            for(i=0; i<childDivs.length; i++){
                childDiv[i] = childDivs[i];
            }            

            for(var j=0; j<a.length; j++){
                if(a[j].toLowerCase().match(textarea.toLowerCase())){    
                    childDiv[j].style.display = 'block';
                } else {
                    childDiv[j].style.display = 'none';
                }
            }
        
}

function regionClicked(me) {
    if (me != null) {
        if ($(me).attr("class") == "opaque") { // Change opaque region node to normal
            $(me).removeClass("opaque");
        } else { // Currently this region's nodes are normal
            var numOfSpan = $("div.color-info span").length;
            var numOfOpaque = $(".opaque").length;
            var numOfNormal = numOfSpan - numOfOpaque;
            if (numOfNormal == numOfSpan) { // All are normal
                $("div.color-info span").addClass("opaque");
                $(me).removeClass("opaque");
            } else if (numOfNormal == 1) { // I am the only normal
                $("div.color-info span").removeClass("opaque");
            } else { // some are normal
                $(me).addClass("opaque");
            }
        }
    }

    var opa = {};
    $("div.color-info span").each(function() {
        if ($(this).attr("class") == "opaque") {
            opa[$(this).text()] = 0.2;
        } else {
            opa[$(this).text()] = 1.0;
        }
    });
    for (var i = 0; i < inputJson.n.length; i++) {
        inputJson.n[i]["opacity"] = opa[inputJson.n[i].region];
    }
    for(var y = startYear; y < endYear + 1; y++) {
        var oneyeardata = currdata[y].n;
        for (var i = 0; i < oneyeardata.length; i++) {
            if (oneyeardata[i].class == "anchor")
                oneyeardata[i]["opacity"] = 1.0;
            else
                oneyeardata[i]["opacity"] = opa[oneyeardata[i].region];
            //oneyeardata[i]["opacity"] = opa[inputJson.n[i].region];
        }
    };

    changeOpacity();
}

function deleteAllEdgeWidget() {
    $("div.edgeWidget").remove();
}

function deleteEdgeWidget(me) {
    $(me).parent().remove();
}

function addEdgeWidget(d) {
    $("div#widget_" + d.key).remove();

    var html = "<div class=edgeWidget id=widget_" + d.key + " >";

    html += "<div onclick=deleteEdgeWidget(this) class=deleteEW > X </div>";
    html += "<div class=main-anchor-container>" + $("#yeartext").html() + "</div>";
    html += "<div class=main-anchor-container>";
    html += "<div class=anchor-info>";
    html += "<a style=background:" + fillNode(d.region) + "></a>";
    html += "<span>" + d.key + "</span>";
    html += "</div>";
    html += "</div>";

    html += "<div class=anchor-info-container>";
    var simVal = {};
    if (d.key in anchorPos) { // If this node is actually an anchor
        simVal = anchorEdge[$("#yeartext").html()][d.key];
    } else {
        for (var i = 0; i < inputJson.l.length; i++) {
            var idata = inputJson.l[i];
            if (idata.source.key == d.key) {
                simVal[idata.target.key] = idata.value;
            }
        }
    }
    for (var cc3 in anchorPos) {
        if (cc3 == d.key) continue;
        html += "<div class=anchor-info>";
        html += "<a style=background:" + fillNode(nodeInfo[cc3].region) + "></a>";
        html += "<span>" + cc3 + ": " + (simil2link.invert(simVal[cc3]) * 100).toFixed(2) + "% </span>";
        html += "</div>";
    }
    html += "</div>";

    html += "</div>";

    $("#nodeEdges div#insertafterdiv").after(html);
}
