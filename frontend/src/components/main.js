import {CustomHttp} from "../../services/custom-http.js";
import config from "../../config/config.js";
import {Pie} from "./pie.js";
import AirDatepicker from 'air-datepicker';

export class Main {
    newDate = new Date().toLocaleDateString().split('.');
    dateNow = this.newDate[2] + '-' + this.newDate[1] + '-' + this.newDate[0];

    constructor() {
        const buttons = document.querySelectorAll('.date-filter');
        const todayBtn = document.getElementById('todayBtn');

        buttons.forEach(item => {
            item.classList.remove('active');
        })
        todayBtn.classList.add('active');

        this.getOperationByDate('today');

        let filterButtons = ['today', 'week', 'month', 'year', 'all'];

        buttons.forEach((item, i) => {
            item.onclick = () => {
                buttons.forEach((i) => i.classList.remove('active'))
                this.getOperationByDate(filterButtons[i]);
                item.classList.add('active');
            }
        })

        const intervalBtn = document.getElementById('interval-btn');
        const dateFromLabel = document.getElementById('date-from-label');
        const dateToLabel = document.getElementById('date-to-label');

        let dateFrom;
        let dateTo;

        new AirDatepicker('#date-from', {
            onSelect: function ({formattedDate}) {
                dateFromLabel.innerText = 'Дата';
                intervalBtn.setAttribute('disabled', 'disabled');

                if (formattedDate) {
                    dateFromLabel.innerText = formattedDate;
                    if (dateTo) {
                        intervalBtn.removeAttribute('disabled');
                    }
                }
                dateFrom = formattedDate;
            },
            autoClose: true
        });

        new AirDatepicker('#date-to', {
            onSelect: function ({formattedDate}) {
                dateToLabel.innerText = 'Дата';
                intervalBtn.setAttribute('disabled', 'disabled');

                if (formattedDate) {
                    dateToLabel.innerText = formattedDate;
                    if (dateFrom) {
                        intervalBtn.removeAttribute('disabled');
                    }
                }
                dateTo = formattedDate;
            },
            autoClose: true
        });

        intervalBtn.onclick = () => {
            if (dateFrom && dateTo) {
                let dateFromData = dateFrom.split('.');
                let dateFromFormatted = dateFromData[2] + '-' + dateFromData[1] + '-' + dateFromData[0];

                let dateToData = dateTo.split('.');
                let dateToFormatted = dateToData[2] + '-' + dateToData[1] + '-' + dateToData[0];

                buttons.forEach((item) => {
                    item.classList.remove('active');
                })

                this.getOperationByDate('interval', dateFromFormatted, dateToFormatted);
                intervalBtn.classList.add('active');
            }
        }
    }

    async getOperationByDate(period, dateFrom, dateTo) {
        try {
            let result;
            if (period === 'today') {
                result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + this.dateNow + '&dateTo=' + this.dateNow);
            } else if (period === 'interval') {
                result = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom=' + dateFrom + '&dateTo=' + dateTo);
            } else {
                result = await CustomHttp.request(config.host + '/operations?period=' + period);
            }
            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    new Pie(result);
                }
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            return console.log(error);
        }
    }
}