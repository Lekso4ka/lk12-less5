
function createCard(cat, el = box) {
    const card = document.createElement("div");
    card.className = "card";
    if (!cat.image) {
        card.classList.add("default");
    } else {
        card.style.backgroundImage = `url(${cat.image})`;
    }
    const name = document.createElement("h3");
    name.innerText = cat.name;
    const like = document.createElement("i");
    like.className = "fa-heart card__like";
    like.classList.add(cat.favorite ? "fa-solid" : "fa-regular");
    like.addEventListener("click", e => {
        e.stopPropagation();
        if (cat.id) {
            fetch(`${path}/update/${cat.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({favorite: !cat.favorite})
            })
            .then(res => {
                if (res.status === 200) {
                    like.classList.toggle("fa-solid");
                    like.classList.toggle("fa-regular");
                    cats = cats.map(c => {
                        if (c.id === cat.id) {
                            c.favorite = !cat.favorite;
                        }
                        return c;
                    })
                    localStorage.setItem("cats-data", JSON.stringify(cats));
                }
            })
        }
    })
    const trash = document.createElement("i");
    trash.className = "fa-solid fa-trash card__trash";
    trash.addEventListener("click", e => {
        e.stopPropagation();
        // deleteCard(???, e.currentTarget.parentElement);
        deleteCard(cat.id, card);
    })
    card.append(like, name, trash);
    if (cat.age >= 0) {
        const age = document.createElement("span");
        age.innerText = cat.age;
        card.append(age);
    }
    card.addEventListener("click", e => {
        location.replace(`page.html?id=${cat.id}`)
    })
    // card.addEventListener("click", (e) => {
    //     deleteCard(cat.id, card);
    // });
    el.append(card);
}

function deleteCard(id, el) {
    if (id) {
        fetch(`${path}/delete/${id}`, {
            method: "delete"
        })
            .then(res => {
                // console.log(res);
                // console.log(res.status);
                if (res.status === 200) {
                    el.remove();
                    cats = cats.filter(c => c.id !== id)
                    localStorage.setItem("cats-data", JSON.stringify(cats));
                }
            })
    }
}

/*
    AJAX - отправить запрос на другой сервис (сервер) без перезагрузки страницы (fetch / xhr - XmlHttpRequest / axios)
    Async
    JavaScript
    And
    XML
*/


/*
    request fetch:
        1) path - путь запроса
        2) http-заголовки - объект со всеми параметрами запроса (method, headers, body - то что отправляется на сервер (данные))

        Из объекта в строку
        JSON.stringify(obj) <> {a: 123} => '{"a": 123}' 
        Из стргоки в объект
        JSON.parse(str) <> '{"a": 123}'=> {a: 123}
*/
// let ids = [];
// fetch(path + "/ids")
//     .then(res => res.json())
//     .then(data => {
//         console.log(data);
//         ids = [...data];
//         myCat.id = ids.length ? ids[ids.length - 1] + 1 : 1;
//         // myCat.id = 7;
//         // addCat(myCat);
//     })

function addCat(cat) {
    fetch(path + "/add", {
        method: "POST", // та же логика прописывается к put и patch - запросам
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cat)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
}


if (cats) {
    try {
        cats = JSON.parse(cats); // сделать из строки объект
        console.log(cats);
        for (let cat of cats) {
            createCard(cat, box);
            console.log(cat);
        }
    } catch(err) {
        if (err) {
            cats = null;
        }
    }
} else {
    // Если котов не было - попросить их с сервера
    fetch(path + "/show")
        .then(function(res) {
            console.log(res);
            if (res.statusText === "OK") {
                /*
                    Все методы res возвращают Promise
                    res.text() => возвращает текстовое содержимое (HTML-файл)
                    res.blob() => возвращает двоичный код (бинарный формат данных) 10 => 00001010 => 0a => файлы (картинки / файл)
                    res.json() => отображает данные в ввиде объекта
                */
                return res.json();
            }
        })
        .then(function(data) {
            // data - отввет от сервера
            // console.log(data);
            if (!data.length) {
                box.innerHTML = "<div class=\"empty\">У вас пока еще нет питомцев</div>"
            } else {
                cats = [...data];
                localStorage.setItem("cats-data", JSON.stringify(data));
                for (let c of data) {
                    createCard(c, box);
                }
            }
        })
}
