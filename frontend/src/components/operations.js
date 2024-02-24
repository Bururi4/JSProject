import {CustomHttp} from "../../services/custom-http.js";
import config from "../../config/config.js";
import AirDatepicker from 'air-datepicker';
import {CreateOperation} from "./create-operation";
import {EditOperation} from "./edit-operation";

export class Operations {
    urlRoute = window.location.hash.split('?')[0];
    newDate = new Date().toLocaleDateString().split('.');
    dateNow = this.newDate[2] + '-' + this.newDate[1] + '-' + this.newDate[0];
    operationsData = null;

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

        const createIncomeBtn = document.getElementById('create-income');
        const createExpenseBtn = document.getElementById('create-expense');
        createIncomeBtn.onclick = () => {
            new CreateOperation('income');
        }
        createExpenseBtn.onclick = () => {
            new CreateOperation('expense');
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
                    this.operationsData = result;
                    this.createOperationsTable();
                }
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            return console.log(e);
        }
    }

    async getCategories(category) {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' + category);

            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    return result;
                }
            } else {
                throw new Error(result.message);
            }
        } catch (e) {
            return console.log(e);
        }
    }

    createOperationsTable() {
        const tableBody = document.getElementById('tbody');
        tableBody.innerHTML = '';

        if (this.operationsData.length === 0) {
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            const td3 = document.createElement('td');
            const td4 = document.createElement('td');
            const td5 = document.createElement('td');
            const td6 = document.createElement('td');
            const td7 = document.createElement('td');
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);
            tr.appendChild(td7);
            td4.innerText = 'Нет операций по выбранному периоду';
            td4.style.fontStyle = 'italic';
            td4.style.display = 'block';
            td4.style.marginTop = '10px';
            td4.style.marginBottom = '-1px';
            td4.style.fontSize = '18px';
            tableBody.appendChild(tr);
        } else {
            this.operationsData.forEach((operation) => {
                    const tr = document.createElement('tr');
                    tr.className = 'border border-end-0 border-start-0';
                    tableBody.appendChild(tr);

                    const operationNumber = document.createElement('th');
                    operationNumber.setAttribute('scope', 'row');
                    operationNumber.innerText = operation.id;
                    tr.appendChild(operationNumber);

                    const type = document.createElement('td');

                    if (operation.type === 'income') {
                        type.innerText = 'доход';
                        type.className = 'text-success';
                    } else if (operation.type === 'expense') {
                        type.innerText = 'расход';
                        type.className = 'text-danger';
                    }

                    tr.appendChild(type);

                    const category = document.createElement('td');
                    const createIncomeBtn = document.getElementById('create-income');
                    const createExpenseBtn = document.getElementById('create-expense');

                    if (operation.type === 'income') {
                        const getCategory = this.getCategories(operation.type).then((categories) => {
                            if (categories.length === 0) {
                                createIncomeBtn.setAttribute('disabled', 'disabled');
                            } else {
                                return categories.find((category) => {
                                    if (category.title === operation.category) {
                                        return category.title;
                                    }
                                })
                            }
                        })
                        getCategory.then((answer) => {
                            if (answer) {
                                category.innerText = answer.title;
                            }
                        });
                    } else if (operation.type === 'expense') {
                        const getCategory = this.getCategories(operation.type).then((categories) => {
                            if (categories.length === 0) {
                                createExpenseBtn.setAttribute('disabled', 'disabled');
                            } else {
                                return categories.find((category) => {
                                    if (category.title === operation.category) {
                                        return category.title;
                                    }
                                })
                            }
                        })
                        getCategory.then((answer) => {
                            if (answer) {
                                category.innerText = answer.title;
                            }
                        });
                    }
                    tr.appendChild(category);

                    const sum = document.createElement('td');
                    sum.innerText = operation.amount + '$';
                    tr.appendChild(sum);

                    const dateCell = document.createElement('td');
                    const date = operation.date.split('-');
                    dateCell.innerText = date[2] + '.' + date[1] + '.' + date[0];
                    tr.appendChild(dateCell);

                    const comment = document.createElement('td');
                    comment.innerText = operation.comment;
                    tr.appendChild(comment);

                    const options = document.createElement('td');
                    options.className = 'd-flex border-0 p-0 mt-2 justify-content-end';
                    tr.appendChild(options);

                    const editLink = document.createElement('a');
                    editLink.className = 'btn p-1 border-0 btn-delete';
                    editLink.setAttribute('href', 'javascript:void(0)');
                    editLink.insertAdjacentHTML('afterbegin', '<img src="../../images/pen.svg" alt="Редактировать операцию">');
                    editLink.onclick = async () => {
                        new EditOperation(operation.id);
                    }
                    options.appendChild(editLink);

                    const deleteLink = document.createElement('a');
                    deleteLink.className = 'btn p-1 border-0 btn-delete';
                    deleteLink.setAttribute('href', 'javascript:void(0)');
                    deleteLink.insertAdjacentHTML('afterbegin', '<img src="../../images/trash.svg" alt="Удалить операцию">');
                    // deleteLink.onclick = async () => {
                    //     new Popup('Удалить выбранную операцию?', this.urlRoute, operation.id);
                    // }
                    options.appendChild(deleteLink);
                }
            )
        }
    }
}
