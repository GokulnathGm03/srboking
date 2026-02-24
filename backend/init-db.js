const db = require('./db');
require('dotenv').config();


async function setupDatabase() {
    try {
        console.log("Setting up database schema...");

        // 1. Create rooms table
        await db.query(`
            CREATE TABLE IF NOT EXISTS rooms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                description TEXT,
                image_url VARCHAR(255)
            )
        `);
        console.log("Rooms table ensured.");

        // 2. Create bookings table
        await db.query(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_name VARCHAR(255) NOT NULL,
                customer_email VARCHAR(255) NOT NULL,
                check_in_date DATE NOT NULL,
                check_out_date DATE NOT NULL,
                room_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
            )
        `);
        console.log("Bookings table ensured.");

        // 3. Insert some initial dummy data IF empty
        const [rows] = await db.query('SELECT COUNT(*) as count FROM rooms');
        if (rows[0].count === 0) {
            console.log("Empty rooms table detected. Inserting initial data...");
            await db.query(`
                INSERT INTO rooms (name, type, price, description, image_url) VALUES 
                ('Cozy Single Room', 'Single', 50.00, 'A small but comfortable room for one.', 'https://images.unsplash.com/photo-1598928506311-c55dd121a97d?auto=format&fit=crop&q=80&w=400&h=300'),
                ('Luxury Double Room', 'Double', 120.00, 'Spacious room with a queen bed and city view.', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=400&h=300'),
                ('Family Suite', 'Suite', 250.00, 'Perfect for families, includes a living area and two bedrooms.', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=400&h=300'),
                ('Ocean View Deluxe', 'Deluxe', 180.00, 'Wake up to the sound of waves in this beautiful room.', 'https://images.unsplash.com/photo-1618773928120-2946c2c9d2bc?auto=format&fit=crop&q=80&w=400&h=300')
            `);
            console.log("Initial room data inserted.");
        } else {
            console.log("Rooms table already has data. Skipping initial insertion.");
        }

        console.log("Database setup complete!");
        process.exit(0);

    } catch (error) {
        console.error("Error setting up database:", error);
        process.exit(1);
    }
}

setupDatabase();
