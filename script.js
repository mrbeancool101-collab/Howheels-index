let myCollection = JSON.parse(localStorage.getItem('hw_collection')) || [];
let currentFilter = 'all';
let editingId = null;

function applyPreset(type, price) {
    document.getElementById('carType').value = type;
    document.getElementById('newCarPrice').value = price;
}

function addCar() {
    const name = document.getElementById('newCarName').value;
    const series = document.getElementById('newCarSeries').value || "Unknown";
    const priceInput = document.getElementById('newCarPrice').value || "1.25";
    
    if (name) {
        myCollection.push({ 
            id: Date.now(), 
            name: name, 
            series: series, 
            type: document.getElementById('carType').value,
            price: priceInput,
            release: "2026",
            seriesNum: "1/5",
            colNum: "001/250",
            pkg: "Long",
            color1: "Unknown",
            color2: "None",
            wheels: "Default",
            condition: "Mint",
            estValue: priceInput,
            store: "Target"
        });
        saveAndRefresh();
        document.getElementById('newCarName').value = '';
        document.getElementById('newCarSeries').value = '';
    }
}

function openEditor(id) {
    editingId = id;
    const car = myCollection.find(c => c.id === id);
    if (car) {
        document.getElementById('editMainName').innerText = car.name;
        document.getElementById('editModel').value = car.name;
        document.getElementById('editSeries').value = car.series;
        document.getElementById('editRelease').value = car.release || "";
        document.getElementById('editSeriesNum').value = car.seriesNum || "";
        document.getElementById('editColNum').value = car.colNum || "";
        document.getElementById('editType').value = car.type || "";
        document.getElementById('editPkg').value = car.pkg || "";
        document.getElementById('editColor1').value = car.color1 || "";
        document.getElementById('editColor2').value = car.color2 || "";
        document.getElementById('editWheels').value = car.wheels || "";
        document.getElementById('editCondition').value = car.condition || "";
        document.getElementById('editPrice').value = car.price || "";
        document.getElementById('editVal').value = car.estValue || "";
        document.getElementById('editStore').value = car.store || "";
        
        document.getElementById('adminPanel').classList.remove('hidden');
    }
}

function saveDetails() {
    const car = myCollection.find(c => c.id === editingId);
    if (car) {
        car.name = document.getElementById('editModel').value;
        car.series = document.getElementById('editSeries').value;
        car.release = document.getElementById('editRelease').value;
        car.seriesNum = document.getElementById('editSeriesNum').value;
        car.colNum = document.getElementById('editColNum').value;
        car.type = document.getElementById('editType').value;
        car.pkg = document.getElementById('editPkg').value;
        car.color1 = document.getElementById('editColor1').value;
        car.color2 = document.getElementById('editColor2').value;
        car.wheels = document.getElementById('editWheels').value;
        car.condition = document.getElementById('editCondition').value;
        car.price = document.getElementById('editPrice').value;
        car.estValue = document.getElementById('editVal').value;
        car.store = document.getElementById('editStore').value;
        
        closeAdmin();
        saveAndRefresh();
    }
}

function closeAdmin() { document.getElementById('adminPanel').classList.add('hidden'); }

function filterType(type, el) {
    currentFilter = type;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    renderCars();
}

function renderCars() {
    const list = document.getElementById('carList');
    const search = document.getElementById('searchInput').value.toLowerCase();
    list.innerHTML = '';
    let totalVal = 0;

    myCollection.filter(c => {
        const matchesTab = currentFilter === 'all' || c.type === currentFilter;
        const matchesSearch = c.name.toLowerCase().includes(search) || c.series.toLowerCase().includes(search);
        return matchesTab && matchesSearch;
    }).forEach(car => {
        totalVal += parseFloat(car.price || 0);
        list.innerHTML += `
            <div class="car-card">
                <div class="car-info">
                    <span class="series-text">${car.series}</span>
                    <span class="name-text">${car.name}</span>
                    <span class="edit-link" onclick="openEditor(${car.id})">Details</span>
                </div>
                <div class="price-section">
                    <div class="price-text">$${parseFloat(car.price || 0).toFixed(2)}</div>
                    <div class="remove-btn" onclick="deleteCar(${car.id})">Remove</div>
                </div>
            </div>`;
    });

    document.getElementById('totalCount').innerText = myCollection.length;
    document.getElementById('totalValue').innerText = `$${totalVal.toFixed(2)}`;
}

function saveAndRefresh() {
    localStorage.setItem('hw_collection', JSON.stringify(myCollection));
    renderCars();
}

function deleteCar(id) {
    if(confirm("Delete car?")) {
        myCollection = myCollection.filter(c => c.id !== id);
        saveAndRefresh();
    }
}

renderCars();