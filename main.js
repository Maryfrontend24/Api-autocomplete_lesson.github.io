let form = document.querySelector('.form');
let input = document.querySelector('.input_search');
let searchResultsList = document.querySelector(".wrapper__rep");
let res = document.createElement("li");
let repos = [];

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
                    let repoObj = { name : item.name, login : item.owner.login, stars : item['stargazers_count']}
                    updateRepos(repoObj, repos);
                    newWrapper.innerHTML = null;
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

function updateRepos(repo, repos) {
    if (repos.length >= 5) {
        repos.pop();
    }
    repos.unshift(repo);
    searchResultsList.innerHTML = null;

    // let resultList = [];
    repos.map(item => {
        const itemCard = createRepos(item)
        searchResultsList.prepend(itemCard);
    })

    console.log(repos);
}



function createRepos(repo) {
    let block = document.createElement("li");
    let content = document.createElement("div");
    let button = document.createElement("button");
    content.textContent = `Name: ${repo.name} 
  Owner: ${repo.owner} 
  Stars: ${repo.stars}`;
    block.classList.add("result__content");
    block.classList.add("result__rep-card");
    button.classList.add("repos__button-close");
    content.classList.add("texts");
    block.append(content, button);
    button.addEventListener("click", function () {
        button.removeEventListener("click", arguments.callee);
        block.remove();
    });
    return block;
}



// function searchNames(value) {
//     input.value = value;
//     removeElements();
// }

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

