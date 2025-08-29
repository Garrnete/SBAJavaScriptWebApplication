
function $(sel, root = document) {
    return root.querySelector(sel);
}

function setStatus(msg) {
    $('#status').textContent = msg || '';
}

function renderSpells(spells) {
    const list = $('#spellList');
    list.innerHTML = '';

    if (!spells || spells.length === 0) {
        list.innerHTML = '<p>No spells found.</p>';
        return;
    }

    // Highlight Curse spells
    function highlightCurses() {
        document.querySelectorAll(".spell-card h3").forEach(h3 => {
            if (h3.textContent.toLowerCase().includes("curse")) {
                h3.classList.add("curse");
            }
        });
    }

    spells.forEach(spell => {
        const card = document.createElement('div');
        card.className = 'spell-card';

        const isCurse = spell.name.toLowerCase().includes("curse");

        card.innerHTML = `
        <h3 class="${isCurse ? 'curse' : ''}">${spell.name}</h3>
        <p>${spell.incantation || ''}</p>
        <p><em>${spell.type}</em></p>
        <p>${spell.effect}</p>
    `;
        list.appendChild(card);
    });
function renderSpells(spells) {
    const list = $('#spellList');
    list.innerHTML = '';

    if (!spells || spells.length === 0) {
        list.innerHTML = '<p>No spells found.</p>';
        return;
    }

    // Map spell types to Hogwarts houses
    function getHouseClass(type) {
        if (!type) return "gryffindor"; // fallback
        type = type.toLowerCase();

        if (type.includes("curse") || type.includes("dark")) return "slytherin";
        if (type.includes("charm")) return "ravenclaw";
        if (type.includes("healing") || type.includes("counter")) return "hufflepuff";
        if (type.includes("defense") || type.includes("dueling")) return "gryffindor";

        // default
        return "gryffindor";
    }

    spells.forEach(spell => {
        const card = document.createElement('div');
        card.className = 'spell-card';

        const houseClass = getHouseClass(spell.type);

        card.innerHTML = `
            <h3 class="spell-title ${houseClass}">${spell.name}</h3>
            <p>${spell.incantation || ''}</p>
            <p><em>${spell.type}</em></p>
            <p>${spell.effect}</p>
        `;
        list.appendChild(card);
    });
}


    // Run after spells are loaded
    document.addEventListener("DOMContentLoaded", highlightCurses);

    spells.forEach(spell => {
        const card = document.createElement('div');
        card.className = 'spell-card';
        card.innerHTML = `
            <h3>${spell.name}</h3>
            <p><strong>Type:</strong> ${spell.type || 'Unknown'}</p>
            <p>${spell.effect || ''}</p>
        `;
        list.appendChild(card);
    });
}

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

// ---------- Main Script ----------
let spells = [];
let filtered = [];
let page = 1;
let pageSize = 10;

// Mock data
async function fetchSpells() {
    setStatus('Loading spells...');
    try {
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

// Pagination
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

// Event listeners
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

// Initialize
function init() {
    fetchSpells();
    setupEvents();
}

init();

// ✨ Wand sparkle trail
document.addEventListener('mousemove', e => {
  const sparkle = document.createElement('div');
  sparkle.className = 'wand-sparkle';
  sparkle.style.left = e.pageX + 'px';
  sparkle.style.top = e.pageY + 'px';
  document.body.appendChild(sparkle);

  setTimeout(() => sparkle.remove(), 600); // auto-clean
});