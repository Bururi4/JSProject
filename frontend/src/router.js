import {Form} from "./components/form.js";
import {Auth} from "../services/auth.js";
import {PieChart} from "./components/main.js";
import {Sidebar} from "./sidebar.js";

export class Router {
    constructor() {
        this.registrationElement = document.getElementById('registration');
        this.mainElement = document.getElementById('main');
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');
        this.profilefullNameElement = document.getElementById('profile-full-name');

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                styles: 'styles/main.css',
                load: () => {
                    new PieChart()
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
                route: '#/income',
                title: 'Доходы',
                template: 'templates/gain.html',
                styles: 'styles/gain.css',
                load: () => {

                }
            },
            {
                route: '#/expense',
                title: 'Расходы',
                template: 'templates/cost.html',
                styles: 'styles/cost.css',
                load: () => {

                }
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                template: 'templates/income-expenses.html',
                styles: 'styles/income-expenses.css',
                load: () => {

                }
            },
            {
                route: '#/operations-edit',
                title: 'Редактировать доход/расход',
                template: 'templates/edit-income-expenses.html',
                styles: 'styles/create-income-expenses.css',
                load: () => {

                }
            },
            {
                route: '#/operations-create',
                title: 'Редактировать доход/расход',
                template: 'templates/create-income-expenses.html',
                styles: 'styles/create-income-expenses.css',
                load: () => {

                }
            },
            {
                route: '#/create-income',
                title: 'Создание категории доходов',
                template: 'templates/create-gain-category.html',
                styles: 'styles/create-category.css',
                load: () => {

                }
            },
            {
                route: '#/create-expense',
                title: 'Создание категории расходов',
                template: 'templates/create-cost-category.html',
                styles: 'styles/create-category.css',
                load: () => {

                }
            },
            {
                route: '#/edit-income',
                title: 'Редактирование категории доходов',
                template: 'templates/edit-gain-category.html',
                styles: 'styles/edit-category.css',
                load: () => {

                }
            },
            {
                route: '#/edit-expense',
                title: 'Редактирование категории расходов',
                template: 'templates/edit-cost-category.html',
                styles: 'styles/edit-category.css',
                load: () => {

                }
            },
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
                new Sidebar();
            }

            const userInfo = Auth.getUserInfo();
            const accessToken = localStorage.getItem(Auth.accessTokenKey);

            if (userInfo && accessToken) {
                this.profilefullNameElement.innerText = userInfo.name + ' ' + userInfo.lastName;
            } else {
                window.location.href = '#/login';
            }
        }

        newRoute.load();
    }
}