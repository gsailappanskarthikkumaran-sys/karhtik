import cron from 'node-cron';
import axios from 'axios';
import GoldRate from '../models/GoldRate.js';

// Configuration
const BASE_RATE_22K = 6750; // Approximated base rate
const VARIANCE = 50; // Max daily fluctuation in INR

const fetchMarketRate = async () => {
    // Placeholder for Real API call
    // const response = await axios.get('API_URL');
    // return response.data.price;
    return null; // Force simulation for now
};

const updateDailyGoldRate = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if rate exists for today
        const existingRate = await GoldRate.findOne({
            rateDate: { $gte: today }
        });

        if (existingRate) {
            console.log('Gold rate for today already exists.');
            return;
        }

        console.log('Fetching/Generating daily gold rate...');

        let rate22k = 0;
        let rate24k = 0;

        const marketRate = await fetchMarketRate();

        if (marketRate) {
            rate24k = marketRate; // Assumption
            rate22k = marketRate * 0.916;
        } else {
            // SIMULATION: Generate a realistic fluctuation
            // Get yesterday's rate or use base
            const lastRate = await GoldRate.findOne().sort({ rateDate: -1 });
            const previous22k = lastRate ? lastRate.ratePerGram22k : BASE_RATE_22K;

            const fluctuation = (Math.random() * VARIANCE * 2) - VARIANCE; // +/- VARIANCE
            rate22k = Math.round(previous22k + fluctuation);
            rate24k = Math.round(rate22k * (24 / 22));
        }

        await GoldRate.create({
            rateDate: new Date(),
            ratePerGram22k: rate22k,
            ratePerGram24k: rate24k,
            updatedBy: null // System generated
        });

        console.log(`Daily Gold Rate Updated: 22k=₹${rate22k}, 24k=₹${rate24k}`);

    } catch (error) {
        console.error('Error updating daily gold rate:', error);
    }
};

const initScheduler = () => {
    // Run every day at 9:00 AM
    cron.schedule('0 9 * * *', () => {
        updateDailyGoldRate();
    });

    // Also try to run immediately on server start (if missed)
    updateDailyGoldRate();
};

export default initScheduler;
