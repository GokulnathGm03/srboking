const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// --- API Endpoints ---

// 1. Get all available rooms
app.get('/api/rooms', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM rooms');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

// 2. Submit a new booking
app.post('/api/bookings', async (req, res) => {
    const { name, email, checkIn, checkOut, roomId } = req.body;

    if (!name || !email || !checkIn || !checkOut || !roomId) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO bookings (customer_name, customer_email, check_in_date, check_out_date, room_id) VALUES (?, ?, ?, ?, ?)',
            [name, email, checkIn, checkOut, roomId]
        );
        res.status(201).json({ message: 'Booking successful!', bookingId: result.insertId });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
