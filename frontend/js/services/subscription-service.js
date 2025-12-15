// inicijalna vrijednost billing moda
if (typeof selectedBilling === 'undefined') {
  var selectedBilling = 'monthly';
}

var cachedPlans = [];

// inicijalizacija toggle prekidaca
function initPricingToggle() {
  const toggle = document.getElementById("togglePlan");
  if (!toggle) return;

  toggle.addEventListener("change", function () {
    selectedBilling = this.checked ? "yearly" : "monthly";
    updateDisplayedPrices();
  });

  loadPlans();
}

window.initPricingToggle = initPricingToggle;

// ucitavanje svih planova i provjera aktivne pretplate
function loadPlans() {
  const token = localStorage.getItem("user_token");
  if (!token) {
    document.getElementById("pricingCards").innerHTML = `
      <div class="col-12 text-center">
        <p class="text-danger fw-bold">You must be logged in to view subscription plans.</p>
      </div>`;
    return;
  }

  RestClient.get("subscriptions/available", function (templatePlans) {
    cachedPlans = templatePlans;

    RestClient.get("subscriptions/active", function (userSubscription) {
      const hasActive = !!userSubscription;

      // ako postoji aktivna pretplata, onemoguci toggle
      const toggle = document.getElementById("togglePlan");
      if (toggle && hasActive) {
        toggle.disabled = true;
      }

      const container = document.getElementById("pricingCards");
      container.innerHTML = "";

      // prolazak kroz sve planske sablone
      templatePlans.forEach(plan => {
        const isSubscribedToThisPlan = userSubscription && userSubscription.plan === plan.plan;
        const isThisButtonDisabled = !!userSubscription;

        const price = selectedBilling === "yearly"
          ? (parseFloat(plan.price) * 11).toFixed(2)
          : parseFloat(plan.price).toFixed(2);

        let cancelText = "";
        if (isSubscribedToThisPlan) {
          cancelText = userSubscription.billing === "yearly"
            ? "Cancel available in 30 days"
            : "Cancel available in 25 days";
        }

        const formattedDescription = plan.description.replace(/\n/g, "<br>");

        // generisanje kartica sa planovima
        container.innerHTML += `
          <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm p-4" style="border-radius: 12px;">
              <h5 class="text-center mb-3" style="font-size: 1.2rem; font-weight: bold; color: #005b96">
                ${plan.plan}
              </h5>
              <p class="text-muted text-center mb-3" style="font-size: 0.9rem; line-height: 1.4;">
                ${formattedDescription}
              </p>
              <p class="text-center mb-4 price-text" style="font-size: 1rem;" data-plan="${plan.plan}">
                <strong>$${price}</strong> / ${selectedBilling}
              </p>
              <button 
                class="btn ${isSubscribedToThisPlan ? 'btn-warning' : 'btn-dark'} w-100 choose-plan-btn"
                ${isThisButtonDisabled ? 'disabled' : ''}
                data-id="${plan.id}" 
                data-plan="${plan.plan}" 
                data-price="${price}" 
                data-billing="${selectedBilling}">
                ${isSubscribedToThisPlan ? cancelText : 'CHOOSE PLAN'}
              </button>
            </div>
          </div>`;
      });

      attachClickHandlers();
    });
  });
}

// postavljanje event listenera na dugmad
function attachClickHandlers() {
  document.querySelectorAll(".choose-plan-btn:not([disabled])").forEach(btn => {
    btn.addEventListener("click", function () {
      const planName = this.dataset.plan;
      const planPrice = this.dataset.price;
      const billing = this.dataset.billing;
      const planId = this.dataset.id;

      document.getElementById("modalPlanName").innerText = planName;
      document.getElementById("confirmSubscription").dataset.planId = planId;
      document.getElementById("confirmSubscription").dataset.price = planPrice;
      document.getElementById("confirmSubscription").dataset.plan = planName;
      document.getElementById("confirmSubscription").dataset.billing = billing;

      new bootstrap.Modal(document.getElementById("subscriptionModal")).show();
    });
  });
}

// azurira prikaz cijena prilikom promjene toggle opcije
function updateDisplayedPrices() {
  const priceTexts = document.querySelectorAll(".price-text");

  RestClient.get("subscriptions/active", function (userSubscription) {
    priceTexts.forEach(el => {
      const planName = el.dataset.plan;
      const plan = cachedPlans.find(p => p.plan === planName && p.is_template == 1);
      if (!plan) return;

      const newPrice = selectedBilling === "yearly"
        ? (parseFloat(plan.price) * 11).toFixed(2)
        : parseFloat(plan.price).toFixed(2);

      el.innerHTML = `<strong>$${newPrice}</strong> / ${selectedBilling}`;

      const btn = el.parentElement.querySelector("button.choose-plan-btn");
      const isSubscribed = userSubscription && userSubscription.plan === planName;

      if (isSubscribed) {
        btn.innerText = selectedBilling === "yearly"
          ? "Cancel available in 300 days"
          : "Cancel available in 25 days";
      }

      btn.dataset.price = newPrice;
      btn.dataset.billing = selectedBilling;
    });
  });
}

// pokretanje prilikom ucitavanja stranice
document.addEventListener("DOMContentLoaded", () => {
  initPricingToggle();
});

// potvrda kupovine plana
document.addEventListener("click", function (e) {
  const target = e.target;
  if (!target || target.id !== "confirmSubscription") return;

  const plan = target.dataset.plan;
  const price = target.dataset.price;
  const billing = target.dataset.billing;

  const cardNumber = document.getElementById("CARDNUMBER").value.replace(/\s+/g, '');
  const expiry = document.getElementById("EXPIRYDATE").value;
  const cvc = document.getElementById("CVC").value;

  if (!/^\d{16}$/.test(cardNumber)) {
    toastr.error("Card number must be 16 digits.");
    return;
  }

  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    toastr.error("Expiry must be in MM/YY format.");
    return;
  }

  const [expMonth, expYear] = expiry.split('/').map(Number);
  const now = new Date();
  const expDate = new Date(2000 + expYear, expMonth);
  if (isNaN(expDate) || expDate <= now) {
    toastr.error("Card is expired.");
    return;
  }

  if (!/^\d{3}$/.test(cvc)) {
    toastr.error("CVC must be 3 digits.");
    return;
  }

  const today = new Date();
  const startDate = today.toISOString().split("T")[0];

  let endDate;
  if (billing === "yearly") {
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    endDate = oneYearLater.toISOString().split("T")[0];
  } else {
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    endDate = oneMonthLater.toISOString().split("T")[0];
  }

  const sub = {
    plan: plan,
    price: price,
    billing: billing,
    description: `Subscribed to ${plan}`,
    start_date: startDate,
    end_date: endDate
  };

  RestClient.post("subscriptions/subscribe", sub, function () {
    toastr.success("Subscription successful!");
    bootstrap.Modal.getInstance(document.getElementById("subscriptionModal")).hide();
    loadPlans();
  }, function (error) {
    toastr.error("Error while subscribing.");
    console.error("Subscription error:", error);
  });
});
