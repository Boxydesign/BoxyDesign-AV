let owners = [];
let totalShares = 0;
let agendaItems = [];

function processFile() {
    const fileUpload = document.getElementById('file-upload').files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n').map(line => line.split(','));

        // Zorg ervoor dat de eerste regel de kolomnamen bevat
        if (lines.length < 2) {
            alert('Het bestand moet minstens één eigenaar bevatten.');
            return;
        }

        owners = lines.slice(1).map(row => ({
            apartment: row[0] || 'Onbekend',
            name: row[1] || 'Onbekend',
            shares: parseFloat(row[2]) || 0,
            present: false
        }));

        // Verwijder lege rijen
        owners = owners.filter(owner => owner.apartment && owner.name && !isNaN(owner.shares));
        totalShares = owners.reduce((sum, owner) => sum + owner.shares, 0);

        displayOwners();
        updateTotals();
    };

    reader.readAsText(fileUpload);
}

function displayOwners() {
    const ownerList = document.getElementById('owner-list');
    ownerList.innerHTML = '';

    owners.forEach((owner, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${owner.apartment}</td>
            <td>${owner.name}</td>
            <td>${owner.shares}</td>
            <td><input type="checkbox" onchange="toggleAttendance(${index})"></td>
        `;
        ownerList.appendChild(row);
    });
}

function toggleAttendance(index) {
    owners[index].present = !owners[index].present;
}

function updateTotals() {
    const totalOwners = owners.length;
    document.getElementById('total-owners').innerText = totalOwners;
    document.getElementById('total-shares').innerText = totalShares;
}

function calculateQuorum() {
    const attendees = owners.filter(owner => owner.present);
    const presentShares = attendees.reduce((sum, owner) => sum + owner.shares, 0);

    document.getElementById('attendees-count').innerText = attendees.length;
    document.getElementById('shares-count').innerText = presentShares;

    const requiredAttendees = Math.ceil(owners.length / 2);
    const requiredQuorum = Math.ceil(totalShares / 2);

    const quorumReached1 = (attendees.length >= requiredAttendees && presentShares >= requiredQuorum);
    
    const statusElement = document.getElementById('quorum-status');
    const explanationElement = document.getElementById('quorum1-explanation');

    if (quorumReached1) {
        statusElement.innerText = "Quorum 1: OK";
        statusElement.style.color = 'green';
        explanationElement.innerText = "Aantal aanwezigen moet minstens 50% zijn van het totaal aantal eigenaars.";
        document.getElementById('agenda-section').style.display = 'block'; // Toon agenda sectie
    } else {
        statusElement.innerText = "Quorum 1: Niet OK";
        statusElement.style.color = 'red';
        explanationElement.innerText = "Niet genoeg aanwezigen of aandelen.";
    }

    const requiredQuorum2 = Math.ceil((totalShares * 3 / 4) + 1);
    const quorumReached2 = presentShares >= requiredQuorum2;

    document.getElementById('quorum2-requirement').innerText = requiredQuorum2;
    document.getElementById('quorum-status').innerText = quorumReached2 ? 'Ja' : 'Nee';
    document.getElementById('quorum-reason').innerText = quorumReached2 ? '' : 'Niet genoeg aandelen.';
}

function addAgendaItem() {
    const agendaItemInput = document.getElementById('agenda-item').value;
    const majorityRule = document.getElementById('majority-rule').value;

    if (agendaItemInput) {
        agendaItems.push({ item: agendaItemInput, majorityRule: majorityRule });
        updateAgendaList();
        document.getElementById('agenda-item').value = ''; // Reset het invoerveld
    }
}

function updateAgendaList() {
    const agendaList = document.getElementById('agenda-list');
    agendaList.innerHTML = '';

    agendaItems.forEach((agendaItem, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${agendaItem.item} - ${agendaItem.majorityRule} <button onclick="startVoting(${index})">Stem</button>`;
        agendaList.appendChild(li);
    });
}

function startVoting(index) {
    const votingSection = document.getElementBy
