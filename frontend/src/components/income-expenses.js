const editCategory = document.querySelectorAll(".btn-edit");

editCategory.forEach(button => {
    button.addEventListener("click", function () {
        window.location.href = './edit-income-expenses.html';
    });
});

