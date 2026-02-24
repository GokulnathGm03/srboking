document.addEventListener('DOMContentLoaded', () => {
    const roomsContainer = document.getElementById('rooms-container');
    const bookingModal = document.getElementById('booking-modal');
    const closeBtn = document.querySelector('.close-btn');
    const bookingForm = document.getElementById('booking-form');
    const modalRoomName = document.getElementById('modal-room-name');
    const roomIdInput = document.getElementById('room-id');
    const bookingMessage = document.getElementById('booking-message');
    const submitBtn = document.getElementById('submit-btn');

    // API Base URL (relative path works for both local and production since frontend is served by backend)
    const API_URL = '/api';

    // Set minimum dates for inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').min = today;
    document.getElementById('checkOut').min = today;

    // Fetch and display rooms
    async function fetchRooms() {
        try {
            const response = await fetch(`${API_URL}/rooms`);
            if (!response.ok) throw new Error('Failed to fetch rooms');

            const rooms = await response.json();
            displayRooms(rooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            roomsContainer.innerHTML = '<div class="loading" style="color: var(--error);">Failed to load rooms. Please try again later.</div>';
        }
    }

    // Render rooms to the DOM
    function displayRooms(rooms) {
        if (rooms.length === 0) {
            roomsContainer.innerHTML = '<div class="loading">No rooms currently available.</div>';
            return;
        }

        roomsContainer.innerHTML = rooms.map(room => `
            <div class="room-card">
                <img src="${room.image_url || 'https://via.placeholder.com/400x300?text=Room'}" alt="${room.name}" class="room-img">
                <span class="room-type">${room.type}</span>
                <div class="room-info">
                    <h3 class="room-title">${room.name}</h3>
                    <p class="room-desc">${room.description || 'A cozy room for your stay.'}</p>
                    <div class="room-footer">
                        <div class="room-price">$${Number(room.price).toFixed(2)} <span>/ night</span></div>
                        <button class="book-btn" onclick="openModal(${room.id}, '${room.name}')">Book Now</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Modal Logic
    window.openModal = function (id, name) {
        roomIdInput.value = id;
        modalRoomName.textContent = `Book: ${name}`;
        bookingMessage.className = 'message hidden'; // reset message
        bookingModal.classList.add('show');
        bookingModal.style.display = 'flex';
        bookingForm.reset(); // clear previous inputs
    };

    function closeModal() {
        bookingModal.classList.remove('show');
        setTimeout(() => {
            bookingModal.style.display = 'none';
        }, 300); // Wait for transition
    }

    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeModal();
        }
    });

    // Handle Form Submission
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic validation for dates
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;

        if (new Date(checkIn) >= new Date(checkOut)) {
            showMessage('Check-out date must be after check-in date.', 'error');
            return;
        }

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            checkIn: checkIn,
            checkOut: checkOut,
            roomId: roomIdInput.value
        };

        // Disable button while submitting
        submitBtn.textContent = 'Booking...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                showMessage(`Success! Your booking (ID: ${result.bookingId}) is confirmed.`, 'success');
                setTimeout(closeModal, 3000); // Close after 3 seconds
            } else {
                showMessage(result.error || 'Failed to book. Please try again.', 'error');
            }

        } catch (error) {
            console.error('Booking error:', error);
            showMessage('A network error occurred. Please try again later.', 'error');
        } finally {
            submitBtn.textContent = 'Confirm Booking';
            submitBtn.disabled = false;
        }
    });

    function showMessage(text, type) {
        bookingMessage.textContent = text;
        bookingMessage.className = `message ${type}`;
    }

    // Initialize
    fetchRooms();
});
