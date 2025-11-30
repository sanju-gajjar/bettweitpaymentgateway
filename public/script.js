// Payment Gateway Demo - Client Side JavaScript

let currentMethod = 'upi';
let selectedBank = '';
let selectedWallet = '';
let selectedUPIApp = '';

// DOM Elements
const methodTabs = document.querySelectorAll('.method-tab');
const paymentForms = document.querySelectorAll('.payment-form');
const payButton = document.getElementById('pay-button');
const processingOverlay = document.getElementById('processing-overlay');
const resultModal = document.getElementById('result-modal');
const retryButton = document.getElementById('retry-button');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializePaymentMethods();
    initializePaymentOptions();
    initializePayButton();
    formatCardInputs();
});

// Payment Method Switching
function initializePaymentMethods() {
    methodTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            switchPaymentMethod(method);
        });
    });
}

function switchPaymentMethod(method) {
    currentMethod = method;
    
    // Update active tab
    methodTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-method') === method) {
            tab.classList.add('active');
        }
    });
    
    // Update active form
    paymentForms.forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${method}-form`).classList.add('active');
    
    // Reset selections
    selectedBank = '';
    selectedWallet = '';
    selectedUPIApp = '';
}

// Initialize Payment Options
function initializePaymentOptions() {
    // UPI Apps
    const upiApps = document.querySelectorAll('.upi-app');
    upiApps.forEach(app => {
        app.addEventListener('click', function() {
            selectedUPIApp = this.getAttribute('data-app');
            upiApps.forEach(a => a.style.background = '#f8f9fa');
            this.style.background = '#2a5298';
            this.style.color = 'white';
        });
    });
    
    // Bank Buttons
    const bankButtons = document.querySelectorAll('.bank-button');
    bankButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectedBank = this.getAttribute('data-bank');
            bankButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Wallet Buttons
    const walletButtons = document.querySelectorAll('.wallet-button');
    walletButtons.forEach(button => {
        button.addEventListener('click', function() {
            selectedWallet = this.getAttribute('data-wallet');
            walletButtons.forEach(w => w.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

// Format Card Inputs
function formatCardInputs() {
    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCVV = document.getElementById('card-cvv');
    
    // Format card number with spaces
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
    
    // Format expiry date MM/YY
    cardExpiry.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
    
    // Only allow numbers in CVV
    cardCVV.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Initialize Pay Button
function initializePayButton() {
    payButton.addEventListener('click', function() {
        processPayment();
    });
}

// Validate and Process Payment
function processPayment() {
    const validation = validatePaymentDetails();
    
    if (!validation.valid) {
        alert(validation.message);
        return;
    }
    
    // Disable button and show loader
    payButton.disabled = true;
    document.querySelector('.button-text').style.display = 'none';
    document.querySelector('.button-loader').style.display = 'inline-block';
    
    // Show processing overlay
    setTimeout(() => {
        processingOverlay.style.display = 'flex';
    }, 500);
    
    // Send payment request
    const paymentData = {
        paymentMethod: getPaymentMethodName(),
        amount: '₹5,500.00',
        details: getPaymentDetails()
    };
    
    fetch('/api/process-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        // Hide processing overlay
        processingOverlay.style.display = 'none';
        
        // Show result modal
        showResult(data);
        
        // Reset button
        payButton.disabled = false;
        document.querySelector('.button-text').style.display = 'inline-block';
        document.querySelector('.button-loader').style.display = 'none';
    })
    .catch(error => {
        processingOverlay.style.display = 'none';
        alert('Network error. Please try again.');
        
        // Reset button
        payButton.disabled = false;
        document.querySelector('.button-text').style.display = 'inline-block';
        document.querySelector('.button-loader').style.display = 'none';
    });
}

// Validate Payment Details
function validatePaymentDetails() {
    switch(currentMethod) {
        case 'upi': {
            const upiId = document.getElementById('upi-id').value.trim();
            if (!upiId && !selectedUPIApp) {
                return { valid: false, message: 'Please enter a UPI ID or select a UPI app.' };
            }
            if (upiId) {
                // UPI ID regex: alphanumeric, dot, dash, underscore, 2-256 chars, @, provider (min 3 chars)
                const upiRegex = /^[\w.-]{2,256}@[\w]{3,}$/i;
                if (!upiRegex.test(upiId)) {
                    return { valid: false, message: 'Please enter a valid UPI ID (e.g., user@upi, 9876543210@paytm).' };
                }
            }
            break;
        }
        case 'card': {
            const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
            const cardName = document.getElementById('card-name').value.trim();
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCVV = document.getElementById('card-cvv').value;
            // Card number: 13-19 digits, Luhn check
            if (!cardNumber || !/^\d{13,19}$/.test(cardNumber) || !luhnCheck(cardNumber)) {
                return { valid: false, message: 'Please enter a valid credit/debit card number.' };
            }
            if (!cardName || !/^([A-Za-z ]{2,})$/.test(cardName)) {
                return { valid: false, message: 'Please enter the cardholder name (letters and spaces only).' };
            }
            // Expiry: MM/YY, not in past
            if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                return { valid: false, message: 'Please enter expiry date in MM/YY format.' };
            }
            const [mm, yy] = cardExpiry.split('/').map(Number);
            if (mm < 1 || mm > 12) {
                return { valid: false, message: 'Expiry month must be between 01 and 12.' };
            }
            const now = new Date();
            const expYear = 2000 + yy;
            const expMonth = mm;
            if (expYear < now.getFullYear() || (expYear === now.getFullYear() && expMonth < (now.getMonth() + 1))) {
                return { valid: false, message: 'Card expiry date cannot be in the past.' };
            }
            // CVV: 3 or 4 digits
            if (!/^\d{3,4}$/.test(cardCVV)) {
                return { valid: false, message: 'Please enter a valid 3 or 4 digit CVV.' };
            }
            break;
        }
        case 'netbanking': {
            const otherBank = document.getElementById('other-bank').value;
            if (!selectedBank && !otherBank) {
                return { valid: false, message: 'Please select a bank.' };
            }
            break;
        }
        case 'wallet': {
            if (!selectedWallet) {
                return { valid: false, message: 'Please select a wallet.' };
            }
            break;
        }
    }
    return { valid: true };
}

// Luhn algorithm for card validation
function luhnCheck(num) {
    let arr = (num + '').split('').reverse().map(x => parseInt(x));
    let sum = arr.reduce((acc, val, idx) => {
        if (idx % 2) {
            val *= 2;
            if (val > 9) val -= 9;
        }
        return acc + val;
    }, 0);
    return sum % 10 === 0;
}

// Get Payment Method Name
function getPaymentMethodName() {
    switch(currentMethod) {
        case 'upi':
            if (selectedUPIApp) {
                return `UPI (${selectedUPIApp})`;
            }
            const upiId = document.getElementById('upi-id').value.trim();
            return `UPI (${upiId})`;
            
        case 'card':
            const cardType = document.querySelector('input[name="card-type"]:checked').value;
            return `${cardType.charAt(0).toUpperCase() + cardType.slice(1)} Card`;
            
        case 'netbanking':
            const otherBank = document.getElementById('other-bank').value;
            return `Net Banking (${selectedBank || otherBank})`;
            
        case 'wallet':
            return `${selectedWallet} Wallet`;
            
        default:
            return currentMethod;
    }
}

// Get Payment Details
function getPaymentDetails() {
    switch(currentMethod) {
        case 'upi':
            return {
                upiId: document.getElementById('upi-id').value.trim(),
                app: selectedUPIApp
            };
            
        case 'card':
            return {
                cardType: document.querySelector('input[name="card-type"]:checked').value,
                cardNumber: document.getElementById('card-number').value.slice(-4),
                cardName: document.getElementById('card-name').value.trim()
            };
            
        case 'netbanking':
            return {
                bank: selectedBank || document.getElementById('other-bank').value
            };
            
        case 'wallet':
            return {
                wallet: selectedWallet
            };
    }
}

// Show Result
function showResult(data) {
    // Simulate redirect to payment gateway page with timer, then fail
    setTimeout(() => {
        window.location.href = 'processing-redirect.html';
    }, 1200); // Short delay to mimic real redirect
}

// Retry Button
retryButton.addEventListener('click', function() {
    resultModal.style.display = 'none';
    
    // Reset form fields
    document.querySelectorAll('.form-input').forEach(input => {
        input.value = '';
    });
    
    // Reset selections
    document.querySelectorAll('.bank-button').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.wallet-button').forEach(w => w.classList.remove('selected'));
    document.querySelectorAll('.upi-app').forEach(app => {
        app.style.background = '#f8f9fa';
        app.style.color = '';
    });
    
    selectedBank = '';
    selectedWallet = '';
    selectedUPIApp = '';
});

// Close modal on overlay click
resultModal.addEventListener('click', function(e) {
    if (e.target === resultModal) {
        resultModal.style.display = 'none';
    }
});
