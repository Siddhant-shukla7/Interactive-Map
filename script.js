document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Leaflet map
    const map = L.map('map').setView([0, 0], 2); // Center the map at [0, 0] with zoom level 2

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Function to handle search
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-btn');

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        console.log('Search term:', searchTerm); // Debug: Show search term

        // Call Nominatim API
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const location = data[0];
                    const lat = location.lat;
                    const lon = location.lon;
                    console.log('Matched location:', [lat, lon]); // Debug: Show location

                    // Center the map on the new location
                    map.setView([lat, lon], 13);

                    // Add a marker to the map
                    L.marker([lat, lon])
                        .addTo(map)
                        .bindPopup(`<b>${searchTerm}</b><br>Latitude: ${lat}, Longitude: ${lon}`)
                        .openPopup();
                } else {
                    alert('No matching location found.');
                }
            })
            .catch(error => console.error('Error fetching location:', error));
    });

    //Add geolocation to center map on user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 13);
                L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup('You are here')
                    .openPopup();
            },
            error => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve your location. Please check your location settings.');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});
