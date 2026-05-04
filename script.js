<script>
let myCollection = JSON.parse(localStorage.getItem('hw_collection')) || [];
let currentFilter = 'all';
let editingId = null;
let selectedCase = "";

// 2026 Case Databases
const caseData = {
    'A': [
        { name: 'Bugatti Bolide', type: 'Mainline', colNum: '001/250', seriesNum: '1/10' },
        { name: 'Nissan Skyline GT-R (R32)', type: 'Mainline', colNum: '002/250', seriesNum: '1/5' },
        { name: '70 Chevy Nova', type: 'Mainline', colNum: '003/250', seriesNum: '2/10' },
        { name: 'Toyota GR Supra', type: 'Mainline', colNum: '004/250', seriesNum: '3/10' },
        { name: 'Ford Mustang Dark Horse', type: 'Mainline', colNum: '005/250', seriesNum: '1/5' },
        { name: 'Gotta Go', type: 'TH', colNum: '006/250', seriesNum: 'N/A' },
        { name: 'Tesla Model S Plaid', type: 'Mainline', colNum: '007/250', seriesNum: '4/10' },
        { name: 'Bone Shaker', type: 'Mainline', colNum: '008/250', seriesNum: '5/10' }
    ],
    'C': [
        { name: 'Koenigsegg Jesko', type: 'Mainline', colNum: '052/250', seriesNum: '2/10' },
        { name: 'Chevy Corvette C8.R', type: 'Mainline', colNum: '053/250', seriesNum: '3/5' },
        { name: 'Tesla Model S Plaid (Blue)', type: 'Mainline', colNum: '054/250', seriesNum: '4/10' },
        { name: 'Honda Civic Custom', type: 'Mainline', colNum: '055/250', seriesNum: '1/5' },
        { name: 'BMW M3 Wagon', type: 'Mainline', colNum: '056/250', seriesNum: '2/5' },
        { name: '’17 Pagani Huayra Roadster', type: 'TH', colNum: '057/250', seriesNum: 'N/A' }
    ]
};

// Initialize Case Navigator
const cases = ['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q'];
const tabsWrap = document.getElementById('caseTabsContainer');
cases.forEach(l => {
    const t = document.createElement('div');
    t.className = 'tab';
    t.innerText = `Case ${l}`;
    t.onclick = () => setActiveCase(l, t);
    tabsWrap.appendChild(t);
});

function toggleCaseBox() {
    document.getElementById('caseOverlay').classList.toggle('hidden');
}

function setActiveCase(letter, el) {
    document.querySelectorAll('#caseTabsContainer .tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    selectedCase = `2026 ${letter} Case`;
    
    const content = document.getElementById('caseContent');
    const activeList = caseData[letter] || [];

    if (activeList.length > 0) {
        content.innerHTML = `<h3 style="margin-top:0; color:var(--primary); font-size:0.9em; text-transform:uppercase;">2026 ${letter} Checklist</h3>`;
        activeList.forEach(car => {
            const carBtn = document.createElement('div');
            carBtn.style = "background:#222; margin:5px 0; padding:12px; border-radius:8px; cursor:pointer; text-align:left; border:1px solid #333; display:flex; justify-content:space-between; font-size:0.85em;";
            carBtn.innerHTML = `<span><b>${car.name}</b></span> <span style="color:var(--primary); font-weight:bold;">${car.type}</span>`;
            
            carBtn.onclick = () => {
                document.getElementById('newCarName').value = car.name;
                document.getElementById('newCarSeries').value = selectedCase;
                document.getElementById('carType').value = car.type;
                document.getElementById('newCarPrice').value = car.type === 'TH' ? "5.00" : car.type === 'STH' ? "25.00" : "1.25";
                toggleCaseBox();
            };
            content.appendChild(carBtn);
        });
    } else {
        content.innerHTML = `<h3>2026 ${letter} Case</h3><p style="font-size:0.8em;">Checklist for this case is coming soon!</p><button onclick="confirmQuickCase()" style="background:var(--primary); color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; font-weight:bold;">SELECT CASE ONLY</button>`;
    }
}

function confirmQuickCase() {
    document.getElementById('newCarSeries').value = selectedCase;
    toggleCaseBox();
}

function applyPreset(type, price) {
    document.getElementById('carType').value = type;
    document.getElementById('newCarPrice').value = price;
}

function addCar() {
    const name = document.getElementById('newCarName').value;
    const series = document.getElementById('newCarSeries').value || "Unknown";
    const priceInput = document.getElementById('newCarPrice').value || "1.25";
    const type = document.getElementById('carType').value;

    if (name) {
        let autoData = {};
        Object.values(caseData).forEach(list => {
            const found = list.find(c => c.name === name);
            if (found) autoData = found;
        });

        myCollection.push({ 
            id: Date.now(), 
            name: name, 
            series: series, 
            type: type,
            price: priceInput,
            release: "2026",
            seriesNum: autoData.seriesNum || "1/5",
            colNum: autoData.colNum || "001/250",
            pkg: "Long Card",
            color1: "Default",
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
    document.querySelectorAll('.category-tabs .tab').forEach(t => t.classList.remove('active'));
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
                    <img src="images/cars/logo.png" alt="logo" class="car-logo-thumb">
                    <div class="car-text-wrapper">
                        <span class="series-text">${car.series}</span>
                        <span class="name-text">${car.name}</span>
                        <span class="edit-link" onclick="openEditor(${car.id})">Details</span>
                    </div>
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
</script>