const menuItems = document.querySelectorAll(".menu-link");
const buttonCategory = document.querySelector(".btn-toggle");
const categoryDropdown = document.getElementById("dashboard-collapse");
const dropdownList = document.getElementById("dropdown-list");
const dropdown = document.getElementById("dropdown");

menuItems.forEach(item => {
    item.addEventListener("click", function () {
        if (buttonCategory.classList.contains("active")) {
            buttonCategory.classList.remove("active");
            categoryDropdown.classList.remove("show");
        }
        menuItems.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
    });
});

buttonCategory.addEventListener("click", function () {
    menuItems.forEach(item => item.classList.remove("active"));
    if (!this.classList.contains("active")) {
        this.classList.add("active");
    }
    if (!buttonCategory.classList.contains("collapsed")) {

    }
});

dropdown.onclick = function () {
    if (!dropdownList.classList.contains("show")) {
        dropdownList.classList.add("show");
    }
};

document.addEventListener("click", (event) => {
    if (dropdownList.contains(event.target)) {
        console.log("Logout");
    } else {
        if (dropdownList.classList.contains("show") && !dropdown.contains(event.target)) {
            dropdownList.classList.remove("show");
        }
    }
});

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