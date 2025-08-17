import express from 'express';
import routers from './routes';
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import dbConnect from './MongoConnection';

// Suppress dotenv console logs during testing
dotenv.config({ debug: false });

const PORT = process.env.PORT || 3005;

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    credentials: true,
}));

// ScrappingFoodsOfRestaurantService();
// ScrappingRestaurantsService();

// Add logging middleware only in non-test environments
if (process.env.NODE_ENV !== 'test') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
}

app.use('/api', routers);

// Only initialize server if this file is run directly (not imported for testing)
if (require.main === module) {
    const dbName = process.env.MONGO_DB_NAME || 'sophali_db';

    const initializeServer = async () => {
        try {
            await dbConnect(dbName);
            
            app.listen(PORT,  () => {
                console.log(`Server is running on port ${PORT}`);
            });
        } catch (err) {
            console.error('MongoDB connection error:', err);
        }
    }

    initializeServer();
}

export default app;
// Debug: Log incoming requests