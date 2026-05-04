let myCollection = JSON.parse(localStorage.getItem('hw_collection')) || [
    { id: 1, name: "Porsche 911 GT4RS", series: "HW Exotics", owned: false },
    { id: 2, name: "Nissan Skyline R34", series: "J-Imports", owned: true }
];

// Handles switching between "Add Mode" and "Collection Mode"
function toggleTab(view) {
    const mainView = document.getElementById('mainView');
    const backBtn = document.getElementById('backBtn');
    const collectionBtn = document.getElementById('collectionTabBtn');
    const title = document.getElementById('viewTitle');

    if (view === 'collection') {
        mainView.classList.add('hidden');
        backBtn.classList.remove('hidden');
        collectionBtn.classList.add('hidden');
        title.innerText = "Full Collection";
    } else {
        mainView.classList.remove('hidden');
        backBtn.classList.add('hidden');
        collectionBtn.classList.remove('hidden');
        title.innerText = "HotWheels_Index";
    }
    renderCars(myCollection);
}

function addCar() {
    const name = document.getElementById('newCarName').value;
    const series = document.getElementById('newCarSeries').value;
    
    if (name && series) {
        myCollection.push({ id: Date.now(), name, series, owned: false });
        document.getElementById('newCarName').value = '';
        document.getElementById('newCarSeries').value = '';
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem('hw_collection', JSON.stringify(myCollection));
    renderCars(myCollection);
}

function toggleOwned(id) {
    const car = myCollection.find(c => c.id === id);
    if (car) { car.owned = !car.owned; saveAndRender(); }
}

function deleteCar(id) {
    myCollection = myCollection.filter(c => c.id !== id);
    saveAndRender();
}

function renderCars(data) {
    const list = document.getElementById('carList');
    list.innerHTML = '';
    
    data.forEach(car => {
        list.innerHTML += `
            <div class="car-card">
                <div class="car-info">
                    <img src="images/placeholder.png" class="car-thumb">
                    <div>
                        <span class="name">${car.name}</span>
                        <span class="series">${car.series}</span>
                    </div>
                </div>
                <div class="actions">
                    <button class="delete-btn" onclick="deleteCar(${car.id})">Delete</button>
                    <input type="checkbox" class="checkbox" ${car.owned ? 'checked' : ''} onchange="toggleOwned(${car.id})">
                </div>
            </div>`;
    });
}

function filterCars() {
    let term = document.getElementById('searchInput').value.toLowerCase();
    let filtered = myCollection.filter(c => c.name.toLowerCase().includes(term) || c.series.toLowerCase().includes(term));
    renderCars(filtered);
}

// Initial load
renderCars(myCollection);