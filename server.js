const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Payment processing endpoint - simulates payment failure
app.post('/api/process-payment', (req, res) => {
    const { paymentMethod, amount } = req.body;
    
    // Simulate processing delay
    setTimeout(() => {
        // Always return a payment failure
        res.json({
            success: false,
            message: `Unable to process payment via ${paymentMethod}. Please try again in some time.`,
            paymentMethod: paymentMethod,
            amount: amount,
            transactionId: null,
            timestamp: new Date().toISOString()
        });
    }, 2000); // 2 second delay to simulate real processing
});

// Start server
app.listen(PORT, () => {
    console.log(`Payment Gateway Demo running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});
