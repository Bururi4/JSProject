import {CustomHttp} from "../../services/custom-http.js";
import {Auth} from "../../services/auth.js";
import config from "../../config/config.js";

export class Form {
    constructor(page) {
        this.processElement = null;
        this.page = page;
        this.password = null;

        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/';
            return;
        }

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            }
        ];

        if (page === 'signup') {
            this.fields = [
                {
                    name: 'data',
                    id: 'data',
                    element: null,
                    regex: /^[А-ЯЁ][а-яё]{2,}([-][А-ЯЁ][а-яё]{2,})?\s[А-ЯЁ][а-яё]{2,}\s[А-ЯЁ][а-яё]{2,}$/,
                    valid: false,
                },
                {
                    name: 'email',
                    id: 'email',
                    element: null,
                    regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    valid: false,
                },
                {
                    name: 'password',
                    id: 'password',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                },
                {
                    name: 'repeatPassword',
                    id: 'repeat-password',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                },
            ];
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.parentNode.classList.add('error');
            field.valid = false;
        } else {
            element.parentNode.classList.remove('error');
            field.valid = true;
        }

        if (field.name === 'password') {
            this.password = element.value;
        }

        if (field.name === 'repeatPassword') {
            if (element.value !== this.password) {
                element.parentNode.classList.add('error');
                field.valid = false;
            } else {
                element.parentNode.classList.remove('error');
                field.valid = true;
            }
        }
        this.validateForm();
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;
            let rememberMeCheckbox = true;

            if (this.page === 'signup') {
                try {
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: this.fields.find(item => item.name === 'data').element.value.split(' ')[0],
                        lastName: this.fields.find(item => item.name === 'data').element.value.split(' ')[1],
                        email: email,
                        password: password,
                        repeatPassword: this.fields.find(item => item.name === 'repeatPassword').element.value
                    });

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    return console.log(error);
                }
            }

            if (this.page === 'login') {
                rememberMeCheckbox = document.getElementById('rememberMeCheckbox').checked;
            }

            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                        email: email,
                        password: password,
                        rememberMeCheckbox: rememberMeCheckbox
                    }
                );

                if (result) {
                    if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken
                        || !result.user.name || !result.user.lastName || !result.user.id) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,
                        userId: result.user.id
                    })
                    location.href = '#/';
                }
            } catch (error) {
                return console.log(error);
            }
        }
    }
}