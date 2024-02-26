import {CustomHttp} from "../../services/custom-http.js";
import config from "../../config/config.js";

export class Modal {
    constructor(urlRoute, id) {
        this.urlRoute = urlRoute.split('/')[1];
        this.id = id;
        this.openModal();
    }

    async openModal() {
        const popup = document.getElementById('delete-category-popup');
        const btnDelete = document.getElementById('delete-category');
        const btnCancel = document.getElementById('cancel-deletion');
        popup.classList.add('popup-active');

        btnDelete.onclick = () => {
            popup.classList.remove('popup-active');
            this.deleteCategory();
        }

        btnCancel.addEventListener('click', () => {
            popup.classList.remove('popup-active');
        })
    }

    async deleteCategory() {
        try {
            if (this.urlRoute === 'operations') {
                this.result = await CustomHttp.request(config.host +'/' + this.urlRoute + '/' + this.id, 'DELETE')
            } else {
                this.result = await CustomHttp.request(config.host + '/categories/' + this.urlRoute + '/' + this.id, 'DELETE')
            }
            if (this.result) {
                if (this.result.error) {
                    throw new Error(this.result.message);
                } else {
                    location.href = '#/' + this.urlRoute;
                }
            } else {
                throw new Error(this.result.message);
            }
        } catch (error) {
            return console.log(error);
        }
    }

}