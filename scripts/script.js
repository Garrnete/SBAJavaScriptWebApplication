// app.js
async function fetchSpells() {
    try {
        const res = await axios.get('https://hp-api.onrender.com/api/spells');
        const data = res.data;
        console.log("Fetched spells:", data);
        // Do more with `data` here...
    } catch (err) {
        console.error("Error fetching spells:", err);
    }
}

fetchSpells();

// -------------------- Helper Functions --------------------
function $(sel, root = document) {
    return root.querySelector(sel);
}

function setStatus(msg) {
    $('#status').textContent = msg || '';
}

function getHouseClass(type) {
    if (!type) return "gryffindor";
    type = type.toLowerCase();
    if (type.includes("curse") || type.includes("dark")) return "slytherin";
    if (type.includes("charm")) return "ravenclaw";
    if (type.includes("healing") || type.includes("counter")) return "hufflepuff";
    if (type.includes("defense") || type.includes("dueling")) return "gryffindor";
    return "gryffindor";
}

// -------------------- Spell Cast Animation --------------------
function castSpellAnimation(card) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'wand-sparkle';
        sparkle.style.left = centerX + 'px';
        sparkle.style.top = centerY + 'px';
        sparkle.style.width = sparkle.style.height = Math.random() * 6 + 4 + 'px';
        sparkle.style.background = `radial-gradient(circle, #fff 0%, #${Math.floor(Math.random() * 16777215).toString(16)} 50%)`;

        const angle = Math.random() * 2 * Math.PI;
        const distance = 50 + Math.random() * 30;
        const xOffset = Math.cos(angle) * distance;
        const yOffset = Math.sin(angle) * distance;

        sparkle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${xOffset}px, ${yOffset}px) scale(0.5)`, opacity: 0 }
        ], {
            duration: 600 + Math.random() * 200,
            easing: 'ease-out',
            fill: 'forwards'
        });

        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
    }
}

// -------------------- Custom Alert --------------------
function customAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'custom-alert';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    alertDiv.animate([
        { opacity: 0, transform: 'translateY(-10px)' },
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-10px)' }
    ], { duration: 2500, easing: 'ease-out' });

    setTimeout(() => alertDiv.remove(), 2500);
}

// -------------------- Render Spells --------------------
function renderSpells(spells) {
    const list = $('#spellList');
    list.innerHTML = '';

    if (!spells || spells.length === 0) {
        list.innerHTML = '<p>No spells found.</p>';
        return;
    }

    spells.forEach(spell => {
        const card = document.createElement('div');
        card.className = 'spell-card';

        const houseClass = getHouseClass(spell.type);
        const isCurse = spell.name.toLowerCase().includes("curse");

        card.innerHTML = `
            <h3 class="spell-title ${houseClass} ${isCurse ? 'curse' : ''}">${spell.name}</h3>
            <p>${spell.incantation || ''}</p>
            <p><em>${spell.type}</em></p>
            <p>${spell.effect}</p>
        `;

        // Click: sparkle + custom alert
        card.addEventListener('click', () => {
            castSpellAnimation(card);
            customAlert(`✨ Spell Cast! ✨\nName: ${spell.name}\nType: ${spell.type}\nEffect: ${spell.effect}`);
        });

        list.appendChild(card);
    });
}

// -------------------- Pagination & Filters --------------------
function updatePager({ page, canPrev, canNext }) {
    $('#pageIndicator').textContent = `Page ${page}`;
    $('#prevBtn').disabled = !canPrev;
    $('#nextBtn').disabled = !canNext;
}

function populateTypes(types) {
    const sel = $('#typeFilter');
    sel.innerHTML = '<option value="">All Types</option>';
    types.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        sel.appendChild(opt);
    });
}

// -------------------- Main Script --------------------
let spells = [];
let filtered = [];
let page = 1;
let pageSize = 10;

async function fetchSpells() {
    setStatus('Loading spells...');
    try {
        // Mock data
        spells = [
            { name: 'Expelliarmus', type: 'Charm', effect: 'Disarms opponent' },
            { name: 'Lumos', type: 'Charm', effect: 'Lights wand tip' },
            { name: 'Avada Kedavra', type: 'Curse', effect: 'Kills target' },
            { name: 'Alohomora', type: 'Charm', effect: 'Opens locked objects' },
            { name: 'Stupefy', type: 'Charm', effect: 'Stuns target' },
            { name: 'Crucio', type: 'Curse', effect: 'Inflicts pain' },
            { name: 'Wingardium Leviosa', type: 'Charm', effect: 'Levitation spell' },
            { name: 'Obliviate', type: 'Charm', effect: 'Erases memories' },
            { name: 'Protego', type: 'Charm', effect: 'Shield spell' },
            { name: 'Sectumsempra', type: 'Curse', effect: 'Cuts opponent' }
        ];

        filtered = [...spells];
        populateTypes([...new Set(spells.map(s => s.type))]);
        setStatus('');
        renderPage();
    } catch (err) {
        setStatus('Failed to load spells.');
        console.error(err);
    }
}

// -------------------- Pagination --------------------
function renderPage() {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageSpells = filtered.slice(start, end);
    renderSpells(pageSpells);

    updatePager({
        page,
        canPrev: page > 1,
        canNext: end < filtered.length
    });
}

// -------------------- Event Handlers --------------------
function setupEvents() {
    $('#search').addEventListener('input', e => {
        const term = e.target.value.toLowerCase();
        filtered = spells.filter(s => s.name.toLowerCase().includes(term));
        page = 1;
        renderPage();
    });

    $('#typeFilter').addEventListener('change', e => {
        const type = e.target.value;
        filtered = type ? spells.filter(s => s.type === type) : [...spells];
        page = 1;
        renderPage();
    });

    $('#pageSize').addEventListener('change', e => {
        pageSize = parseInt(e.target.value);
        page = 1;
        renderPage();
    });

    $('#prevBtn').addEventListener('click', () => {
        if (page > 1) {
            page--;
            renderPage();
        }
    });

    $('#nextBtn').addEventListener('click', () => {
        if ((page * pageSize) < filtered.length) {
            page++;
            renderPage();
        }
    });
}

// -------------------- Initialize --------------------
function init() {
    fetchSpells();
    setupEvents();
}

init();

// -------------------- Wand Sparkle Effect --------------------
document.addEventListener('mousemove', e => {
    const sparkle = document.createElement('div');
    sparkle.className = 'wand-sparkle';
    sparkle.style.left = e.pageX + 'px';
    sparkle.style.top = e.pageY + 'px';
    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 600);
});
