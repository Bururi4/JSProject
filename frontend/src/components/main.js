import {Chart} from 'chart.js/auto';

export class PieChart {
    colorHexFirstDiagram = ["#ffc107", "#fd7e14", "#dc3545", "#1acc7a", "#0d6efd"];
    colorHexSecondDiagram = ["#fd7e14", "#0d6efd", "#dc3545", "#ffc107", "#1acc7a"];

    constructor() {
        this.firstPie();
        this.secondPie();
    }

    firstPie() {
        const ctxOne = document.getElementById("first-pie").getContext("2d");

        new Chart(ctxOne, {
            type: 'pie',
            data: {
                datasets: [{
                    data: [10, 30, 20, 10, 5],
                    backgroundColor: this.colorHexFirstDiagram
                }]
            },
            options: {
                rotation: 90
            }
        });
    }

    secondPie() {
        const ctxTwo = document.getElementById("second-pie").getContext("2d");

        new Chart(ctxTwo, {
            type: 'pie',
            data: {
                datasets: [{
                    data: [13, 23, 5, 30, 30],
                    backgroundColor: this.colorHexSecondDiagram
                }]
            },
            options: {
                rotation: 90
            }
        });
    }
}