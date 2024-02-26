import {Form} from "./components/form.js";
import {Auth} from "../services/auth.js";
import {Main} from "./components/main.js";
import {Sidebar} from "./components/sidebar.js";
import {Balance} from "./components/balance.js";
import {Operations} from "./components/operations.js";
import {Category} from "./components/category.js";

export class Router {
    constructor() {
        this.registrationElement = document.getElementById('registration');
        this.mainElement = document.getElementById('main');
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');
        this.profilefullNameElement = document.getElementById('profile-full-name');
        this.sidebar = null;

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'styles/main.css',
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: 'styles/login-signup.css',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/login',
                title: 'Вход в систему',
                template: 'templates/login.html',
                styles: 'styles/login-signup.css',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                template: 'templates/income-expenses.html',
                styles: 'styles/income-expenses.css',
                load: () => {
                    new Operations();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: 'styles/category.css',
                load: () => {
                    new Category();
                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                template: 'templates/expense.html',
                styles: 'styles/category.css',
                load: () => {
                    new Category();
                }
            }
        ];
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/login';
            return;
        }

        if (urlRoute === '#/login' || urlRoute === '#/signup') {
            this.registrationElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
            this.stylesElement.setAttribute('href', newRoute.styles);
            this.titleElement.innerText = newRoute.title;
            this.registrationElement.style.display = 'flex';
            this.mainElement.style.display = 'none';
        } else {
            this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
            this.stylesElement.setAttribute('href', newRoute.styles);
            this.titleElement.innerText = newRoute.title;
            this.registrationElement.style.display = 'none';
            this.mainElement.style.display = 'flex';

            if (urlRoute !== '#/login' && urlRoute !== '#/signup') {
                if (!this.sidebar) {
                    this.sidebar = new Sidebar();
                }
            }

            const userInfo = Auth.getUserInfo();
            const accessToken = localStorage.getItem(Auth.accessTokenKey);

            if (userInfo && accessToken) {
                this.profilefullNameElement.innerText = userInfo.name + ' ' + userInfo.lastName;
                new Balance();
            } else {
                window.location.href = '#/login';
            }
        }

        newRoute.load();
    }
}