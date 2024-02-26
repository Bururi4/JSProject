import {Chart} from 'chart.js/auto';

export class Pie {
    incomeOperations = [];
    expenseOperations = [];

    constructor(operations) {
        operations.forEach(operation => {
            if (operation.type === 'income') {
                this.incomeOperations.push(operation);
            }
            if (operation.type === 'expense') {
                this.expenseOperations.push(operation);
            }
        })

        this.firstPie(this.incomeOperations);
        this.secondPie(this.expenseOperations);
    }

    firstPie(operations) {
        let chartPie = Chart.getChart("firstPie");
        if (chartPie !== undefined) {
            chartPie.destroy();
        }

        let labels = [];
        let partsPie = [];
        let colorHexFirstDiagram = [];
        const ctxOne = document.getElementById('first-pie');
        const mainPageChartNoData = document.getElementById('categories-income');
        if (!operations.length) {
            mainPageChartNoData.style.display = 'block';
        } else {
            mainPageChartNoData.style.display = 'none';

            operations.forEach(operation => {
                partsPie.push(operation.amount);
                labels.push(operation.category);
                colorHexFirstDiagram.push("#" + Math.floor(Math.random()*16777215).toString(16))
            });

            new Chart(ctxOne, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Доход',
                            data: partsPie,
                            backgroundColor: colorHexFirstDiagram,
                        }
                    ]
                },
                options: {
                    rotation: 90,
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true
                        }
                    }
                },
            });
        }
    }

    secondPie(operations) {
        let chartPie = Chart.getChart("secondPie");
        if (chartPie !== undefined) {
            chartPie.destroy();
        }

        let partsPie = [];
        let labels = [];
        let colorHexSecondDiagram = [];
        const ctxTwo = document.getElementById('second-pie');
        const mainPageChartNoData = document.getElementById('categories-expense');
        if (!operations.length) {
            mainPageChartNoData.style.display = 'block';
        } else {
            mainPageChartNoData.style.display = 'none';

            operations.forEach(operation => {
                partsPie.push(operation.amount);
                labels.push(operation.category);
                colorHexSecondDiagram.push("#" + Math.floor(Math.random()*16777215).toString(16))
            });

            new Chart(ctxTwo, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Расход',
                            data: partsPie,
                            backgroundColor: colorHexSecondDiagram,
                        }
                    ]
                },
                options: {
                    rotation: 90,
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true
                        }
                    }
                },
            });
        }
    }
}