let ctxOne = document.getElementById("first-pie").getContext("2d");
let ctxTwo = document.getElementById("second-pie").getContext("2d");
let colorHexFirstDiagram = ["#ffc107", "#fd7e14", "#dc3545", "#1acc7a", "#0d6efd"];
let colorHexSecondDiagram = ["#fd7e14", "#0d6efd", "#dc3545", "#ffc107", "#1acc7a"];

let firstDiagram = new Chart(ctxOne, {
    type: 'pie',
    data: {
        datasets: [{
            data: [10, 30, 20, 10, 5],
            backgroundColor: colorHexFirstDiagram
        }]
    },
    options: {
        rotation: 90
    }
});

let secondDiagram = new Chart(ctxTwo, {
    type: 'pie',
    data: {
        datasets: [{
            data: [13, 23, 5, 30, 30],
            backgroundColor: colorHexSecondDiagram
        }]
    },
    options: {
        rotation: 90
    }
});