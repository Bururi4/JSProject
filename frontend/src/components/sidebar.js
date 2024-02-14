export class Sidebar {
    constructor() {
        this.menuItems = null;
        this.buttonCategory = null;
        this.categoryDropdown = null;
        this.categoryItem = null;

        this.init();
    }

    init() {
        this.changeMenuItem();
        window.addEventListener('popstate', () => {
            this.changeMenuItem();
        });
    }

    changeMenuItem() {
        const urlRoute = window.location.hash.split('?')[0];

        this.categoryDropdown = document.getElementById("dashboard-collapse");

        this.menuItems = document.querySelectorAll(".menu-link");
        this.menuItems.forEach(item => item.classList.remove('active'));

        this.buttonCategory = document.querySelector(".btn-toggle");
        this.categoryItem = document.querySelectorAll('.category-item-link');
        const hrefChildren = [];
        this.categoryItem.forEach(item => {
            hrefChildren.push(item.getAttribute('href'))
        });

        this.buttonCategory.addEventListener('click', () => {
            this.buttonCategory.classList.add('active')
            this.menuItems.forEach(item => item.classList.remove("active"));
        });

        this.menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && href === urlRoute) {
                item.classList.add('active');
                item.parentNode.classList.add('active');
            } else {
                item.parentNode.classList.remove('active');
            }
            if (hrefChildren.includes(urlRoute)) {
                this.buttonCategory.classList.add('active');
                this.categoryDropdown.classList.add('show');
            } else {
                this.buttonCategory.classList.remove('active');
                this.categoryDropdown.classList.remove('show');
            }
        });
    }
}