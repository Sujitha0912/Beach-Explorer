document.addEventListener('DOMContentLoaded', async () => {
    const beachList = document.getElementById('beach-list');
    const response = await fetch('/beaches');
    const beaches = await response.json();

    beachList.innerHTML = beaches.map(beach => `
        <div class="beach-item" data-id="${beach.id}">
            <h2>${beach.name}</h2>
            <p>Weather: ${beach.weather}</p>
            <p>Crowd: ${beach.crowd}</p>
        </div>
    `).join('');

    beachList.addEventListener('click', (event) => {
        const beachItem = event.target.closest('.beach-item');
        if (beachItem) {
            const beachId = beachItem.getAttribute('data-id');
            window.location.href = `beach-details.html?id=${beachId}`;
        }
    });
});
