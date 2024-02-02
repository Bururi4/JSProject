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