/**
 * Loads the Razorpay SDK script dynamically.
 * @returns {Promise<boolean>} Resolves to true if loaded successfully.
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Initializes and opens the Razorpay checkout modal.
 * @param {number} amount - The amount in INR (will be converted to paise internally).
 * @param {Object} userDetails - Contains user info like name, email, contact.
 * @param {Function} onSuccess - Callback for successful payment.
 * @param {Function} onFailure - Callback for failed payment.
 */
export const openRazorpayCheckout = async (amount, userDetails, onSuccess, onFailure) => {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  // Razorpay accepts amount in paise (1 INR = 100 paise)
  const amountInPaise = amount * 100;
  
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: amountInPaise.toString(),
    currency: "INR",
    name: "Veda Beauty",
    description: "Purchase from Veda Beauty",
    image: "/icons/icon-192x192.png", // Assuming this exists based on common PWA setups
    handler: function (response) {
      // Payment was successful
      if (onSuccess) onSuccess(response);
    },
    prefill: {
      name: userDetails?.name || "Customer Name",
      email: userDetails?.email || "customer@example.com",
      contact: userDetails?.contact || "9999999999",
    },
    notes: {
      address: "Veda Beauty Office",
    },
    theme: {
      color: "#FF4D4D", // Match Veda Beauty branding if red is the primary color
    },
    modal: {
      ondismiss: function () {
        if (onFailure) onFailure({ description: "Payment cancelled by user. Please try again." });
      }
    }
  };

  const paymentObject = new window.Razorpay(options);
  
  paymentObject.on('payment.failed', function (response) {
    if (onFailure) onFailure(response.error);
  });

  paymentObject.open();
};
