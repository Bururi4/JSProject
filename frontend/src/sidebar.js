export class Sidebar {
    constructor() {
        this.menuItems = null;
        this.buttonCategory = null;
        this.categoryDropdown = null;

        // this.sidebarActivity();
    }

    sidebarActivity() {
        this.menuItems = document.querySelectorAll(".menu-link");
        this.buttonCategory = document.querySelector(".btn-toggle");
        this.categoryDropdown = document.getElementById("dashboard-collapse");

        this.menuItems.forEach(item => {
            item.addEventListener("click", function () {
                if (this.buttonCategory.classList.contains("active")) {
                    this.buttonCategory.classList.remove("active");
                    this.categoryDropdown.classList.remove("show");
                }
                this.menuItems.forEach(item => item.classList.remove("active"));
                this.classList.add("active");
            });
        });

        this.buttonCategory.addEventListener("click", function () {
            this.menuItems.forEach(item => item.classList.remove("active"));
            if (!this.classList.contains("active")) {
                this.classList.add("active");
            }
            if (!this.buttonCategory.classList.contains("collapsed")) {

            }
        });
    }
}