const createEl = (elTag, elClass) => {
  const el = document.createElement(elTag);
  if (elClass) {
    el.classList.add(elClass);
  }
  return el;
};

function createRepo(data) {
  const repoElement = createEl("li", "repos__item");
  repoElement.innerHTML = `<p>${data.name}</p>`;
  reposList.appendChild(repoElement);
  repoElement.addEventListener("click", () => {
    createRepoInfo(data);
  });
}

const mainWrapper = createEl("div", "mainWrapper");
const mainDiv = createEl("div");
mainDiv.classList.add("main");
document.body.appendChild(mainWrapper);
mainWrapper.appendChild(mainDiv);
document.body.style.backgroundColor = "#eee";

const searchInput = createEl("input", "main__input");
searchInput.type = "text";
searchInput.placeholder = "Type your text here...";
mainDiv.appendChild(searchInput);
const searchSpan = createEl("span", "main__searchSpan");
mainDiv.appendChild(searchSpan);
const repos = createEl("div", "repos");
const reposList = createEl("ul", "repos__list");
mainDiv.appendChild(repos);
repos.appendChild(reposList);
const reposInfo = createEl("div", "repos__info");
mainDiv.appendChild(reposInfo);

const repo_per_page = 5;

async function searchRepos() {
  const inputValue = searchInput.value.trim();
  if (inputValue === "") {
    reposList.innerHTML = "";
    reposList.style.display = "none";
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${inputValue}&per_page=${repo_per_page}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    reposList.innerHTML = "";
    responseData.items.forEach((repo) => createRepo(repo));
    reposList.style.display = "block";
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
const debounce = (fn, debounceTime) => {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime);
  };
};

searchInput.addEventListener("keyup", debounce(searchRepos, 400));
function createRepoInfo(data) {
  const repoInfo = createEl("div", "repos__infoList");
  repoInfo.innerHTML = `<div class="repos__textInfo"><div class = "repos__name"><p>Name: ${data.name}</p></div>
  <div class = "repos__owner"><p>Owner: ${data.owner.login}</p></div>
  <div class = "repos__stars"><p>Stars: ${data.stargazers_count}</p></div>
  <div class="border"></div></div>
  <div class="button repos__button"></div><button class="button__close" type="button"></button></div>`;
  reposInfo.appendChild(repoInfo);
}

document.querySelector("body").onclick = function (e) {
  if (e.target.className != "button__close") {
    return;
  }
  let item = e.target.closest(".repos__infoList");
  item.remove();
};
