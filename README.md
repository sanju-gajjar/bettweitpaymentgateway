# Payment Gateway Demo

A realistic payment gateway simulation for client demonstrations. This single-page application simulates all major Indian payment methods with authentic UI/UX, but always declines payments with appropriate error messages.

## Features

- **Multiple Payment Methods:**
  - UPI (Google Pay, Paytm, PhonePe, BHIM)
  - Credit/Debit Cards (Visa, Mastercard, RuPay, Amex)
  - Net Banking (SBI, HDFC, ICICI, Axis, and more)
  - Digital Wallets (Paytm, PhonePe, Mobikwik, Freecharge, Amazon Pay)

- **Realistic Experience:**
  - Professional payment gateway UI
  - SSL security badges
  - Processing animations
  - Form validations
  - INR currency display

- **Demo Mode:**
  - All payments are declined after processing
  - Shows realistic error messages
  - Retry functionality

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

Start the server:
```bash
npm start
```

The application will be available at: `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Select a payment method (UPI, Card, Net Banking, or Wallet)
3. Fill in the required details (any test data works)
4. Click "Pay ₹2,948.82"
5. Watch the processing animation
6. See the payment failure message
7. Click "Try Again" to test other payment methods

## Demo Credentials

Since this is a simulation, you can use any test data:

- **UPI ID:** any@upi, test@paytm, etc.
- **Card Number:** Any 13-16 digit number (e.g., 4111 1111 1111 1111)
- **Expiry:** Any future date (MM/YY format)
- **CVV:** Any 3 digits
- **Bank/Wallet:** Select any option

All payment attempts will be declined with the message:
"Unable to process payment via [Payment Method]. Please try again in some time."

## Technology Stack

- **Backend:** Node.js + Express
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Styling:** Custom CSS with gradient backgrounds and animations

## File Structure

```
PaymentGateway/
├── server.js           # Express server
├── package.json        # Dependencies
├── public/
│   ├── index.html     # Main page
│   ├── styles.css     # Styling
│   └── script.js      # Client-side logic
└── README.md          # This file
```

## Notes

- This is a **demonstration tool only** - no real payments are processed
- No actual payment gateway integration
- No data is stored or transmitted externally
- All payment attempts result in simulated failures
- Perfect for client demos and presentations

## Customization

You can customize:
- Order amount in `index.html` (update all ₹2,948.82 references)
- Product name in order summary
- Available banks and wallets
- Error messages in `server.js`

## License

ISC
