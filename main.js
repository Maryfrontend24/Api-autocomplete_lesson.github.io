let form = document.querySelector('.form');
let input = document.querySelector('.input_search');
let searchResultsList = document.querySelector(".wrapper__rep");
let res = document.createElement("li");

let updateWordItem = debounceFunc(e => search(e), 450)


function search(e) {
    searchRepositories(e.target.value).then(
        results => {
            let arrResults = [];
            let newWrapper = document.createElement("ul");
            newWrapper.classList.add("wrapper__results-container");
            removeElements();
            results.items.forEach(item => {
                let res = document.createElement("li")
                res.classList.add("results__item")
                res.textContent = item.name;
                newWrapper.appendChild(res);

                res.addEventListener("click", e => {
                    e.preventDefault();
                    let login = item.owner.login;
                    let stars = item['stargazers_count'];
                    createRepos(item.name, login, stars);
                    wrapper.innerHTML = null;
                    input.value = "";

                })

            })
            let oldWrapper = document.querySelector(".wrapper__results-container");
            oldWrapper.replaceWith(newWrapper);
        }
    );
}

input.addEventListener('input', updateWordItem)



async function searchRepositories(query) {
    return await fetch(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=5`).then((response) => {
        if (response.ok) {
            return response.json();
        }
    });
}



function createRepos(name, owner, stars) {
    let block = document.createElement("div");
    let content = document.createElement("div");
    let button = document.createElement("button");
    content.textContent = `Name: ${name} 
  Owner: ${owner} 
  Stars: ${stars}`;
    block.classList.add("result__content");
    block.classList.add("result__rep-card");
    button.classList.add("repos__button-close");
    content.classList.add("texts");
    block.append(content, button);
    searchResultsList.appendChild(block);
    button.addEventListener("click", function () {
        button.removeEventListener("click", arguments.callee);
        block.remove();
    });

}



function searchNames(value) {
    input.value = value;
    removeElements();
}

function removeElements() {
    let items = document.querySelectorAll(".results__item");
    items.forEach((item) => {
        item.remove();
    })
}

function debounceFunc(func, ms) {
    let timeout;
    return function() {
        let fnCall=()=>{
            func.apply(this, arguments);
        }
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, ms);
    };
}

