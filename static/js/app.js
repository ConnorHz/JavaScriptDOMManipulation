var debug = true;
var tableData = data;

function debugLog(message) {
    if (debug) {
        console.log(message);
    }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
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

function filterTable() {
    debugLog("begin filter");

    d3.event.preventDefault();

    var startDate = new Date(d3.select("#startDate").property("value"));
    var endDate = new Date(d3.select("#endDate").property("value")).addDays(1);

    debugLog(`Start Date: ${startDate}`);
    debugLog(`End Date: ${endDate}`);
    
    fillTable(tableData.filter(row => {
        var d = new Date(row.datetime);
        return d >= startDate && d <= endDate;
    }));

    debugLog("end filter");
}

var dates = tableData.map(row => {
    return new Date(row.datetime)
})

var minDate = formatDate(Math.min.apply(null,dates));
var maxDate = formatDate(Math.max.apply(null,dates));

d3.select("#filter-btn").on("click", filterTable);

d3.select("#startDate").attr("value", minDate);
d3.select("#endDate").attr("value", maxDate);

fillTable(tableData);
