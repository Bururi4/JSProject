import config from "../../config/config.js";
import {CustomHttp} from "../../services/custom-http.js";
import {CreateCategory} from "./create-category.js";
import {EditCategory} from "./edit-category.js";

export class Category {
    urlRoute = window.location.hash.split('?')[0];
    categories = null;

    constructor() {
        this.getCategories();
    }

    async getCategories() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' + this.urlRoute.split('/')[1]);

            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    this.categories = result;
                    await this.showCategories();
                    return result;
                }
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            return console.log(e);
        }
    }

    async showCategories() {
        const categoryTitle = document.getElementById('main-title');
        const url = this.urlRoute.split('/')[1];
        if (url === 'income') {
            categoryTitle.innerText = 'Доходы';
        } else if (url === 'expense') {
            categoryTitle.innerText = 'Расходы';
        }

        const categoryCards = document.getElementById('main-cards')
        categoryCards.innerHTML = '';

        this.categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'card w-25';
            categoryCard.setAttribute('id', category.id);
            categoryCards.appendChild(categoryCard);

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            categoryCard.appendChild(cardBody);

            const cardTitle = document.createElement('h1');
            cardTitle.className = 'card-title';
            cardTitle.innerText = category.title;
            cardBody.appendChild(cardTitle);

            const cardButtons = document.createElement('div');
            cardButtons.className = 'card-buttons d-flex';
            cardBody.appendChild(cardButtons);

            const cardEditButton = document.createElement('button');
            cardEditButton.className = 'button edit-button btn btn-primary me-2 px-3 py-2';
            cardEditButton.innerText = 'Редактировать';

            cardEditButton.onclick = () => {
                new EditCategory(category.id);
            }
            cardButtons.appendChild(cardEditButton);

            const cardDeleteButton = document.createElement('button');
            cardDeleteButton.className = 'button delete-button btn btn-danger px-3 py-2';
            cardDeleteButton.innerText = 'Удалить';
            // cardDeleteButton.onclick = async () => {
            //     const url = this.urlRoute.split('/')[1];
            //     if (url === 'income') {
            //         new Popup('Вы действительно хотите удалить категорию?', this.urlRoute, category.id);
            //     }
            //     if (url === 'expense') {
            //         new Popup('Вы действительно хотите удалить категорию?', this.urlRoute, category.id);
            //     }
            // }
            cardButtons.appendChild(cardDeleteButton);
        })

        const createCard = document.createElement('div');
        createCard.className = 'card w-25';
        createCard.setAttribute('id', 'create-card');
        createCard.style.cursor = 'pointer';
        categoryCards.appendChild(createCard);

        const createCardLink = document.createElement('a');
        createCardLink.className = 'card-body py-5 d-flex justify-content-center m-1';
        createCard.appendChild(createCardLink);

        createCardLink.addEventListener('click', () => {
            new CreateCategory();
        });

        const linkImage = document.createElement('img');
        linkImage.setAttribute('src', '../../images/plus.svg');
        linkImage.setAttribute('alt', 'add-card');
        createCardLink.appendChild(linkImage);
    }
}