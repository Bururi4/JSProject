import config from "../../config/config.js";
import {CustomHttp} from "../../services/custom-http.js";

export class CreateCategory {
    urlRoute = window.location.hash.split('?')[0];

    constructor() {
        this.showPage();
    }

    showPage() {
        const categoryTitle = document.getElementById('main-title');
        const url = this.urlRoute.split('/')[1];
        if (url === 'income') {
            categoryTitle.innerText = 'Создание категории доходов';
        } else if (url === 'expense') {
            categoryTitle.innerText = 'Создание категории расходов';
        }

        const categoryCards = document.getElementById('main-cards')
        categoryCards.innerHTML = '';

        const mainInfo = document.getElementById('main-input');
        mainInfo.className = 'main-info-inputs';

        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'input-group flex-nowrap mb-2 border border-light-subtle rounded';
        inputWrapper.setAttribute('id', 'input-wrapper');
        mainInfo.appendChild(inputWrapper);

        const mainInput = document.createElement('input');
        mainInput.setAttribute('type', 'text');
        mainInput.className = 'form-control';
        mainInput.setAttribute('placeholder', 'Название...');
        mainInput.setAttribute('id', 'input-create-category');
        inputWrapper.appendChild(mainInput);

        const mainInfoButtons = document.createElement('div');
        mainInfoButtons.className = 'main-info-actions mt-3';
        const buttonCreate = document.createElement('button');
        buttonCreate.className = 'btn btn-success action-button px-3 py-2 m-0 me-1';
        buttonCreate.innerText = 'Создать';
        buttonCreate.setAttribute('id', 'createCategory');
        buttonCreate.onclick = (e) => {
            e.preventDefault();
            this.createCategory();
        };
        const buttonCancel = document.createElement('button');
        buttonCancel.className = 'btn btn-danger action-button px-3 py-2 m-0 ms-1';
        buttonCancel.innerText = 'Отмена';
        buttonCancel.setAttribute('id', 'cancelCreate');
        buttonCancel.onclick = () => {
            location.href = this.urlRoute;
        };
        mainInfoButtons.appendChild(buttonCreate);
        mainInfoButtons.appendChild(buttonCancel);
        mainInfo.appendChild(mainInfoButtons);
    }

    createCategory() {
        const input = document.getElementById('input-create-category');

        setTimeout(async () => {
            if (input.value) {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/' + this.urlRoute.split('/')[1],
                        'POST', {
                            title: input.value
                        });

                    if (result) {
                        if (result.error || result.message) {
                            throw new Error(result.message);
                        } else {
                            location.href = this.urlRoute;
                        }
                    } else {
                        throw new Error(result.message);
                    }
                } catch (error) {
                    return console.log(error);
                }
            } else {
                const inputWrapper = document.getElementById('input-wrapper');
                const input = document.getElementById('input-create-category');
                if (!input.value) {
                    inputWrapper.classList.add('error');
                } else {
                    inputWrapper.classList.remove('error');
                }
            }
        }, 250);
    }
}