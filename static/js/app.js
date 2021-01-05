var debug = false;
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

    var countryFilter = document.getElementById('country-filter')
    var country = countryFilter.options[countryFilter.selectedIndex].value;

    var shapeFilter = document.getElementById('shape-filter')
    var shape = shapeFilter.options[shapeFilter.selectedIndex].value;

    debugLog(`Start Date: ${startDate}`);
    debugLog(`End Date: ${endDate}`);
    debugLog(`City: ${city}`);

    var filteredData = tableData.filter(row => {
        var d = new Date(row.datetime);
        return (d >= startDate && d <= endDate) &&
               (city == "default" | row.city == city) &&
               (state == "default" | row.state == state) &&
               (country == "default" | row.country == country) &&
               (shape == "default" | row.shape == shape);
    });

    fillTable(filteredData);

    debugLog("end filter");
}

function resetFilter() {
    debugLog("begin reset filter");

    var dates = tableData.map(row => new Date(row.datetime));

    var minDate = formatDate(Math.min.apply(null,dates));
    var maxDate = formatDate(Math.max.apply(null,dates));

    document.getElementById("startDate").value = minDate;
    document.getElementById("endDate").value = maxDate;

    d3.selectAll('select').property('value', 'default');

    fillTable(tableData);
    debugLog("end reset filter");
}

var cities = tableData.map(row => titleCase(row.city)).filter(onlyUnique).sort();

cities.forEach(city => {
    var newOption = d3.select("#city-filter").append("option");
    newOption.text(city);
    newOption.attr("value", city.toLowerCase());
});

var states = tableData.map(row => row.state.toUpperCase()).filter(onlyUnique).sort();

states.forEach(state => {
    var newOption = d3.select("#state-filter").append("option");
    newOption.text(state);
    newOption.attr("value", state.toLowerCase());
});

var countries = tableData.map(row => row.country.toUpperCase()).filter(onlyUnique).sort();

countries.forEach(country => {
    var newOption = d3.select("#country-filter").append("option");
    newOption.text(country);
    newOption.attr("value", country.toLowerCase());
});

var shapes = tableData.map(row => titleCase(row.shape)).filter(onlyUnique).sort();

shapes.forEach(shape => {
    var newOption = d3.select("#shape-filter").append("option");
    newOption.text(shape);
    newOption.attr("value", shape.toLowerCase());
});

d3.select("#filter-btn").on("click", filterTable);
d3.select("#reset-filter").on("click", resetFilter);

resetFilter();
