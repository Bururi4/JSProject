import {CustomHttp} from "../../services/custom-http.js";
import config from "../../config/config.js";
import AirDatepicker from "air-datepicker";

export class EditOperation {
    urlRoute = window.location.hash.split('?')[0];
    categoryData = null;
    operation = null;

    constructor(id) {
        this.id = id;
        this.getOperation();
    }

    async getOperation() {
        try {
            const result = await CustomHttp.request(config.host + '/operations/' + this.id);
            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    this.operation = result;
                    const date = result.date.split('-');
                    this.dateOfOperation = date[2] + '.' + date[1] + '.' + date[0];
                    this.getCategories(result.type);
                    return result;
                }
            }
        } catch (error) {
            return console.log(error);
        }
    }

    async getCategories(category) {
        try {
            const result = await CustomHttp.request(config.host + '/categories/' + category);
            if (result) {
                if (result.error || result.message) {
                    throw new Error(result.message);
                } else {
                    this.categoryData = result;
                    this.OperationCreationPage();
                    return result;
                }
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            return console.log(error);
        }
    }

    OperationCreationPage() {
        const mainInfo = document.getElementById('main-info');
        mainInfo.innerHTML = '';

        const PageTitle = document.createElement('div');
        PageTitle.className = 'main-info-title fs-1 mb-4 pb-3';
        PageTitle.innerText = 'Редактирование дохода/расхода';
        mainInfo.appendChild(PageTitle);

        const form = document.createElement('div');
        form.className = 'main-info-inputs';
        mainInfo.appendChild(form);

        const firstSelect = document.createElement('div');
        firstSelect.className = 'input-group flex-nowrap mb-2 border border-light-subtle rounded';
        const type = document.createElement('select');
        type.className = 'form-control';
        type.setAttribute('id', 'type-select');
        type.setAttribute('disabled', 'disabled');
        firstSelect.appendChild(type);
        form.appendChild(firstSelect);

        const typeOptions = document.createElement('option');
        if (this.operation.type === 'income') {
            typeOptions.innerText = 'Доход';
        } else if (this.operation.type === 'expense') {
            typeOptions.innerText = 'Расход';
        }
        type.appendChild(typeOptions);

        const secondSelect = document.createElement('div');
        secondSelect.className = 'input-group flex-nowrap mb-2 border border-light-subtle rounded';
        const category = document.createElement('select');
        category.className = 'form-control';
        category.setAttribute('id', 'category-select');
        secondSelect.appendChild(category);
        form.appendChild(secondSelect);
        this.categoryData.forEach(item => {
            const categoryOption = document.createElement('option');
            categoryOption.setAttribute('value', item.id);
            categoryOption.innerText = item.title;
            category.appendChild(categoryOption);
        });

        this.categoryData.find(item => {
            const category = document.getElementById('category-select');
            if (item.title === this.operation.category) {
                const selectOptions = Array.from(category.options);
                const selectOption = selectOptions.find(option => Number(option.value) === item.id);
                if (selectOption) {
                    selectOption.selected = true;
                }
            }
            secondSelect.appendChild(category);
        });

        const firstInput = document.createElement('div');
        firstInput.className = 'input-group flex-nowrap mb-2 border border-light-subtle rounded';
        const sum = document.createElement('input');
        firstInput.appendChild(sum);
        sum.className = 'form-control';
        sum.setAttribute('type', 'number');
        sum.setAttribute('placeholder', 'Сумма, в $...');
        sum.setAttribute('id', 'sum-input');
        form.appendChild(firstInput);

        const secondInput = document.createElement('div');
        secondInput.className = 'input-group flex-nowrap mb-2 border border-light-subtle rounded';
        const date = document.createElement('input');
        date.className = 'form-control';
        date.setAttribute('type', 'text');
        date.setAttribute('placeholder', 'Дата...');
        date.setAttribute('id', 'date-input');
        secondInput.appendChild(date);
        form.appendChild(secondInput);

        new AirDatepicker('#date-input', {
            autoClose: true
        });

        const thirdInput = document.createElement('div');
        thirdInput.className = 'input-group flex-nowrap mb-2 border border-light-subtle rounded';
        const comment = document.createElement('input');
        comment.className = 'form-control';
        comment.setAttribute('type', 'text');
        comment.setAttribute('placeholder', 'Комментарий...');
        comment.setAttribute('id', 'comment-input');
        thirdInput.appendChild(comment);
        form.appendChild(thirdInput);

        const mainInfoButtons = document.createElement('div');
        mainInfoButtons.className = 'main-info-actions mt-3';
        const buttonCreate = document.createElement('button');
        buttonCreate.className = 'btn btn-success action-button px-3 py-2 m-0 me-1';
        buttonCreate.innerText = 'Сохранить';
        buttonCreate.setAttribute('id', 'save');
        buttonCreate.onclick = (e) => {
            e.preventDefault();
            this.editOperation();
        };
        const buttonCancel = document.createElement('button');
        buttonCancel.className = 'btn btn-danger action-button px-3 py-2 m-0 ms-1';
        buttonCancel.innerText = 'Отмена';
        buttonCancel.setAttribute('id', 'cancel');
        buttonCancel.onclick = () => {
            location.href = this.urlRoute;
        };
        mainInfoButtons.appendChild(buttonCreate);
        mainInfoButtons.appendChild(buttonCancel);
        form.appendChild(mainInfoButtons);
    }

    editOperation() {
        const typeSelect = document.getElementById('type-select');
        const categorySelect = document.getElementById('category-select');
        const sumInput = document.getElementById('sum-input');
        const dateInput = document.getElementById('date-input');
        const commentInput = document.getElementById('comment-input');
        const date = dateInput.value.split('.');
        const correctDate = date[2] + '-' + date[1] + '-' + date[0];

        let selectType;
        let category;
        if (typeSelect.value === 'Доход') {
            selectType = 'income';
            category = this.categoryData.find((item) => {
                if (item.id === Number(categorySelect.value)) {
                    return item.id;
                }
            })
        } else if (typeSelect.value === 'Расход') {
            selectType = 'expense';
            category = this.categoryData.find((item) => {
                if (item.title === Number(categorySelect.value)) {
                    return item.id;
                }
            })
        }

        setTimeout(async () => {
            if (selectType && categorySelect.value && sumInput.value && dateInput.value && commentInput.value) {
                try {
                    const result = await CustomHttp.request(config.host + '/' + this.urlRoute.split('/')[1] + this.id, 'PUT', {
                        type: selectType,
                        amount: sumInput.value,
                        date: correctDate,
                        comment: commentInput.value,
                        category_id: category.id
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
                const inputs = document.querySelectorAll('.form-control');
                inputs.forEach(item => {
                    if (!item.value) {
                        item.closest('.input-group').classList.add('error');
                    } else {
                        item.closest('.input-group').classList.remove('error');
                    }
                })
            }
        }, 250);
    }
}