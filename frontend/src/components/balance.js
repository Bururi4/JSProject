import {CustomHttp} from "../../services/custom-http.js";
import config from "../../config/config.js";

export class Balance {
    constructor() {
        this.getBalance();
        const balance = document.getElementById('balance-amount');

        balance.onclick = (e) => {
            const popup = document.getElementById('balance-popup');
            const popupInput = document.getElementById('balance-popup-input');
            const popupConfirmBtn = document.getElementById('balance-popup-btn-confirm');
            const popupCancelBtn = document.getElementById('balance-popup-btn-cancel');

            popup.classList.add('popup-active');

            popupConfirmBtn.onclick = () => {
                if (popupInput.value && popupInput.value.match(/^\d+$/)) {
                    popup.classList.remove('popup-active');
                    this.changeBalance(popupInput.value);
                }
            };

            popupCancelBtn.addEventListener('click', () => {
                popup.classList.remove('popup-active');
            })
        };
    }

    async getBalance() {
        try {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    let balance = document.getElementById('balance-amount');
                    balance.innerText = result.balance;
                }
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            return console.log(e);
        }
    }

    async changeBalance(number) {
        try {
            const result = await CustomHttp.request(config.host + '/balance', 'PUT', {
                "newBalance": number
            });

            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    let balance = document.getElementById('balance-amount');
                    balance.innerText = result.balance;
                }
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            return console.log(e);
        }
    }
}