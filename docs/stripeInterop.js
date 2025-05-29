let stripe = null;
let elements = null;
let card = null;
let googleCallback = null;
let appleCallback = null;

let paymentRequest;

export function initStripe(publicKey) {
    stripe = Stripe(publicKey);
    elements = stripe.elements();
    card = elements.create("card");
    card.mount("#card-element");
}

export async function createPaymentMethod() {
    const result = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
    });

    if (result.error) {
        console.error("Stripe error:", result.error.message);
        throw result.error.message;
    } else {
        return result.paymentMethod.id;
    }
}

export async function payWithGoogleOrApple(amountInCents, currency, countryCode, label, onGooglePay, onApplePay) {
    paymentRequest = stripe.paymentRequest({
        country: countryCode,
        currency: currency,
        total: { label: label, amount: amountInCents },
        requestPayerName: true,
        requestPayerEmail: true
    });

    const result = await paymentRequest.canMakePayment();

        document.getElementById("google-pay-button-container").style.display = "block";
    if (result?.googlePay) {
        googleCallback = onGooglePay;
    }

        document.getElementById("apple-pay-button-container").style.display = "block";
    if (result?.applePay) {
        appleCallback = onApplePay;
    }

    paymentRequest.on("paymentmethod", (ev) => {
        if (ev.paymentMethod && ev.paymentMethod.id) {
            if (result?.googlePay && googleCallback) {
                googleCallback(ev.paymentMethod.id);
            } else if (result?.applePay && appleCallback) {
                appleCallback(ev.paymentMethod.id);
            }
        }
        ev.complete("success");
    });
}

export function triggerGooglePay() {
    //paymentRequest.show();
}

export function triggerApplePay() {
    //paymentRequest.show();
}