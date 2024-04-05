const convertTime = (seconds) => {
    const hh = Math.floor(seconds / 3600);
    const rem = seconds % 3600;
    const mm = Math.floor(rem / 60);
    return { hh, mm };
};

const getCategories = () => {
    fetch("https://openapi.programming-hero.com/api/videos/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.data));
};

getCategories();

const displayCategories = (data) => {
    let tabContainer = document.getElementById("tab-container");
    let cardContainer = document.getElementById("card-container");
    let firstTab = true;

    data.forEach((value, index) => {
        let tab = document.createElement("div");
        tab.classList.add("tab");
        tab.textContent = value.category;
        tab.dataset.index = index;

        if(firstTab){
            tab.classList.add("selected");
            getCards(value.category_id);
            firstTab = false;
        }

        tab.addEventListener("click", () => {
            let agerTab = tabContainer.querySelector(".selected");
            if (agerTab) {
                agerTab.classList.remove("selected");
            }
            tab.classList.add("selected");
            cardContainer.innerHTML = '';
            getCards(value.category_id);
        });
        
        tabContainer.appendChild(tab);
    });

};

const isSorted = () => {
    const sortButton = document.getElementById('sortButton');
    sortButton.addEventListener('click', addCard);
};
const getCards = (id) => {
    fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
        const cardsContainer = document.getElementById("card-container");

        if(data.data.length === 0) {
            cardsContainer.innerHTML = `
            <div class = "justify-content-center align-items-center vh-200 m-10 p-5">
                <img class = "img-fluid p-3 text-center" src="/Icon.png" alt="Empty Category" style="width: 100%; max-width: 300px;">
                <h1>Oops!! Sorry, There is no content here</h1>
            </div>
        `;
        } else {

        data.data.forEach((value) => {
            console.log(value);
            const cardContainer = document.createElement("div");
            cardContainer.classList.add("col-sm-12", "col-lg-3","px-2", "py-2");

            const card = document.createElement("div");
            card.classList.add("card", "border-white");

            card.innerHTML = `
            <div class = "card-bd"> 
                    <div class="position-relative">
                    <img class="card-img-top" src="${value.thumbnail}">
                    <p class="position-absolute text-white bg-dark p-2" style="bottom: 0; right: 0; font-size: smaller; border-radius: 5px">
                        ${value.others.posted_date ? `${convertTime(value.others.posted_date).hh}hr ${convertTime(value.others.posted_date).mm}min ago` : ''}
                    </p>
                </div>
        
                <div class="row">
                    <div class="col-4 p-3">
                        <img class="author-img img-fluid rounded-circle d-block m-auto" src ="${value.authors[0].profile_picture}">
                    </div>
                    <div class="col-8 p-2">
                        <h2 class="card-title">${value.title}</h2>
                        <div class = "d-flex">
                                <p class="author-name">${value.authors[0].profile_name}</p>
                                ${value.authors[0].verified ? `<img class="logo-image" src="/verified.png" />` : ''}
                        </div>
                        <p class="views">${value.others.views} views</p>
                        </div> 
                    </div>
                </div>
            </div>
            `;
            cardContainer.appendChild(card);
            cardsContainer.appendChild(cardContainer);
        });
        }
    });
};

isSorted();

function addCard() {
    const cardsContainer = document.getElementById("card-container");
    const cards = Array.from(cardsContainer.children);
    cards.sort((a, b) => {
        const viewsA = parseInt(a.querySelector('.views').textContent);
        const viewsB = parseInt(b.querySelector('.views').textContent);
        return viewsB - viewsA;
    });
    
    cards.forEach(card => {
        cardsContainer.appendChild(card);
    });
};
