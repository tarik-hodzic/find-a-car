// inicijalizacija karusela za testimoniale
function initCarousel() {
    let carouselElement = document.querySelector("#testimonialCarousel");
    if (carouselElement) {
        new bootstrap.Carousel(carouselElement, {
            interval: 5000,
            pause: "hover",
        });
    }
}

/*
// prebacivanje izmedju mjesecnih i godisnjih cijena
function initPricingToggle() {
    const toggle = document.getElementById("togglePlan");
    if (!toggle) return;

    const monthlyPrices = document.querySelectorAll(".price-monthly");
    const yearlyPrices = document.querySelectorAll(".price-yearly");

    function updatePricing() {
        if (toggle.checked) {
            toggleVisibility(monthlyPrices, "d-none", true);
            toggleVisibility(yearlyPrices, "d-none", false);
        } else {
            toggleVisibility(monthlyPrices, "d-none", false);
            toggleVisibility(yearlyPrices, "d-none", true);
        }
    }

    toggle.addEventListener("change", updatePricing);
    updatePricing();
}
*/

// pomocna funkcija za prebacivanje vidljivosti elemenata
function toggleVisibility(elements, className, addClass) {
    elements.forEach(element => element.classList.toggle(className, addClass));
}

// inicijalizacija faq sekcije (otvaranje pitanja/odgovora)
function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");
        const icon = question.querySelector(".icon");

        if (answer.classList.contains("show")) {
            answer.style.maxHeight = answer.scrollHeight + "px";
            icon.textContent = "−";
        }

        question.addEventListener("click", () => toggleFAQAnswer(answer, icon));
    });
}

// prikazivanje ili sakrivanje odgovora u faq
function toggleFAQAnswer(answer, icon) {
    if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
        answer.classList.remove("show");
        icon.textContent = "+";
    } else {
        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.classList.add("show");
        icon.textContent = "−";
    }
}

// otvaranje login/register modala sa izmjenom teksta
function openAuthModal(mode) {
    const modalTitle = document.getElementById("authModalLabel");
    const registerFields = document.getElementById("register-extra-fields");
    const authForm = document.getElementById("authForm");

    if (mode === "register") {
        modalTitle.textContent = "Register";
        registerFields.style.display = "block";
        document.getElementById("toggleAuthMode").innerHTML =
            `<a href="#" onclick="openAuthModal('login'); return false;">Already have an account? Login</a>`;
    } else {
        modalTitle.textContent = "Login";
        registerFields.style.display = "none";
        document.getElementById("toggleAuthMode").innerHTML =
            `<a href="#" onclick="openAuthModal('register'); return false;">Don't have an account? Register</a>`;
    }

    authForm.reset();
    removeModalBackdrop();

    let authModal = new bootstrap.Modal(document.getElementById("authModal"));
    authModal.show();
}

// uklanjanje modala sa strane kad se zatvori
function removeModalBackdrop() {
    document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
    document.body.classList.remove("modal-open");
}

// postavljanje event listenera kada se dokument ucita
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("toggleAuthMode").addEventListener("click", function (event) {
        event.preventDefault();
    });

    document.getElementById("authModal").addEventListener("hidden.bs.modal", function () {
        document.body.style.overflow = "auto";
    });
});
