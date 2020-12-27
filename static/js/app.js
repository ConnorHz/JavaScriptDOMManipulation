var debug = true;
var tableData = data;

function debugLog(message) {
    if (debug) {
        console.log(message);
    }
}

function fillTable(data) {
    debugLog("begin fill");

    var tableBody = d3.select("#ufo-table-body");
    tableBody.html("");

    data.forEach(row => {
        var newRow = tableBody.append("tr");
        newRow.append("td").text(row.datetime || "");
        newRow.append("td").text(row.city || "");
        newRow.append("td").text(row.state || "");
        newRow.append("td").text(row.country || "");
        newRow.append("td").text(row.shape || "");
        newRow.append("td").text(row.duration || "");
        newRow.append("td").text(row.comments || "");
    });


    debugLog("end fill");
}

fillTable(tableData);
