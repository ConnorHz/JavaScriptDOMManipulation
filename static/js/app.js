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

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
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

    if (data.length > 0) {
        data.forEach(row => {
            var newRow = tableBody.append("tr");
            newRow.append("td").text(row.datetime || "");
            newRow.append("td").text(titleCase(row.city) || "");
            newRow.append("td").text(row.state.toUpperCase() || "");
            newRow.append("td").text(row.country.toUpperCase() || "");
            newRow.append("td").text(row.shape || "");
            newRow.append("td").text(row.durationMinutes || "");
            newRow.append("td").text(row.comments || "");
        });
    } else {
        var newRow = tableBody.append("tr");
        newRow.attr("class", "no-data")
        var noData = newRow.append("td")
        noData.attr("colspan", "7");
        noData.text("No Data")
    }

    debugLog("end fill");
}

function filterTable() {
    debugLog("begin filter");

    d3.event.preventDefault();

    var startDate = new Date(d3.select("#startDate").property("value"));
    var endDate = new Date(d3.select("#endDate").property("value")).addDays(1);

    var cityFilter = document.getElementById('city-filter')
    var city = cityFilter.options[cityFilter.selectedIndex].value;

    var stateFilter = document.getElementById('state-filter')
    var state = stateFilter.options[stateFilter.selectedIndex].value;

    debugLog(`Start Date: ${startDate}`);
    debugLog(`End Date: ${endDate}`);
    debugLog(`City: ${city}`);

    var filteredData = tableData.filter(row => {
        var d = new Date(row.datetime);
        return (d >= startDate && d <= endDate) && (city == "default" | row.city == city) && (state == "default" | row.state == state);
    });

    fillTable(filteredData);

    debugLog("end filter");
}

var dates = tableData.map(row => {
    return new Date(row.datetime);
});

var cities = tableData.map(row => {
    return titleCase(row.city);
}).filter(onlyUnique).sort();

cities.forEach(city => {
    var newOption = d3.select("#city-filter").append("option");
    newOption.text(city);
    newOption.attr("value", city.toLowerCase());
});

var states = tableData.map(row => {
    return row.state.toUpperCase();
}).filter(onlyUnique).sort();

states.forEach(state => {
    var newOption = d3.select("#state-filter").append("option");
    newOption.text(state);
    newOption.attr("value", state.toLowerCase());
});

var minDate = formatDate(Math.min.apply(null,dates));
var maxDate = formatDate(Math.max.apply(null,dates));

d3.select("#filter-btn").on("click", filterTable);

d3.select("#startDate").attr("value", minDate);
d3.select("#endDate").attr("value", maxDate);

fillTable(tableData);
