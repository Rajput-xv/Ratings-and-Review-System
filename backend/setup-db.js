const { connectDB } = require('./config/database');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    try {
        const db = await connectDB();
        
        // Reading schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = schema.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await db.execute(statement);
                console.log('Executed:', statement.substring(0, 50) + '...');
            }
        }
        
        console.log('Database setup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Database setup failed:', error);
        process.exit(1);
    }
}

setupDatabase();