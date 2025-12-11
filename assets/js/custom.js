/* ============================================================
   PRELOADER
============================================================ */
window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.opacity = "0";
        setTimeout(() => (preloader.style.display = "none"), 600);
    }
});

/* ============================================================
   KONTAKTŲ FORMA + VIDURKIS
============================================================ */
document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("contactFormContainer");
    const resultBox = document.getElementById("formResult");

    if (!container) return;

    container.innerHTML = `
        <form id="contactForm" class="contact-form">

            <div class="field-group">
                <label>Vardas:</label>
                <input type="text" id="firstName">
                <div class="error-msg" id="err-firstName"></div>
            </div>

            <div class="field-group">
                <label>Pavardė:</label>
                <input type="text" id="lastName">
                <div class="error-msg" id="err-lastName"></div>
            </div>

            <div class="field-group">
                <label>El. paštas:</label>
                <input type="email" id="email">
                <div class="error-msg" id="err-email"></div>
            </div>

            <div class="field-group">
                <label>Telefono numeris:</label>
                <input type="tel" id="phone">
                <div class="error-msg" id="err-phone"></div>
            </div>

            <div class="field-group-full">
                <label>Adresas:</label>
                <input type="text" id="address">
                <div class="error-msg" id="err-address"></div>
            </div>

            <div class="slider-row">
                <label>Dizaino vertinimas:</label>
                <input type="range" id="rate1" min="1" max="10" value="5"
                       oninput="rate1Output.value = this.value">
                <output id="rate1Output">5</output>
            </div>

            <div class="slider-row">
                <label>Patogumo vertinimas:</label>
                <input type="range" id="rate2" min="1" max="10" value="5"
                       oninput="rate2Output.value = this.value">
                <output id="rate2Output">5</output>
            </div>

            <div class="slider-row">
                <label>Aiškumo vertinimas:</label>
                <input type="range" id="rate3" min="1" max="10" value="5"
                       oninput="rate3Output.value = this.value">
                <output id="rate3Output">5</output>
            </div>

            <button type="submit" id="submitBtn" class="btn-custom" disabled>Siųsti</button>
        </form>
    `;

    const fields = {
        firstName: document.getElementById("firstName"),
        lastName: document.getElementById("lastName"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        address: document.getElementById("address")
    };

    const errors = {
        firstName: document.getElementById("err-firstName"),
        lastName: document.getElementById("err-lastName"),
        email: document.getElementById("err-email"),
        phone: document.getElementById("err-phone"),
        address: document.getElementById("err-address")
    };

    function validateName(v) {
        return /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]+$/.test(v.trim());
    }
    function validateEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    }
    function validateAddress(v) {
        return v.trim().length > 2;
    }
    function validatePhone(v) {
        return /^\+3706\d{3}\d{3}$/.test(v);
    }

    function formatPhone(e) {
        let v = e.target.value.replace(/\D/g, "");
        if (v.startsWith("370")) v = v.substring(3);
        if (!v.startsWith("6")) v = "6" + v;
        v = v.substring(0, 8);
        e.target.value = "+370" + v;
        checkErrors();
    }
    fields.phone.addEventListener("input", formatPhone);

    function validateField(id) {
        const v = fields[id].value.trim();
        let ok = false;

        if (id === "firstName" || id === "lastName") ok = validateName(v);
        if (id === "email") ok = validateEmail(v);
        if (id === "phone") ok = validatePhone(v);
        if (id === "address") ok = validateAddress(v);

        if (!ok) {
            fields[id].classList.add("input-error");
            errors[id].textContent = getErr(id);
        } else {
            fields[id].classList.remove("input-error");
            errors[id].textContent = "";
        }
        return ok;
    }

    function getErr(id) {
        if (id === "firstName") return "Vardas turi būti tik iš raidžių.";
        if (id === "lastName") return "Pavardė turi būti tik iš raidžių.";
        if (id === "email") return "Neteisingas el. pašto formatas.";
        if (id === "phone") return "Formatas: +3706xxxxxx";
        if (id === "address") return "Adresas per trumpas.";
    }

    function checkErrors() {
        let all = true;
        Object.keys(fields).forEach(f => { if (!validateField(f)) all = false; });
        document.getElementById("submitBtn").disabled = !all;
    }
    Object.values(fields).forEach(f => f.addEventListener("input", checkErrors));

    document.getElementById("contactForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const r1 = Number(rate1.value);
        const r2 = Number(rate2.value);
        const r3 = Number(rate3.value);
        const avg = ((r1 + r2 + r3) / 3).toFixed(1);

        resultBox.innerHTML = `
            <div style="background:#eee9dd;padding:15px;border-radius:8px;margin-top:20px;">
                <p><strong>Vardas:</strong> ${fields.firstName.value}</p>
                <p><strong>Pavardė:</strong> ${fields.lastName.value}</p>
                <p><strong>El. paštas:</strong> <a href="mailto:${fields.email.value}">${fields.email.value}</a></p>
                <p><strong>Tel.:</strong> ${fields.phone.value}</p>
                <p><strong>Adresas:</strong> ${fields.address.value}</p>
                <hr>
                <p><strong>Vertinimai:</strong> ${r1}, ${r2}, ${r3}</p>
                <p><strong>Vidurkis:</strong> ${avg}</p>
            </div>
        `;

        showPopup();
    });

    function showPopup() {
        const p = document.getElementById("successPopup");
        p.classList.add("show");
        setTimeout(() => p.classList.remove("show"), 2500);
    }
});

/* ============================================================
   MEMORY GAME + LAIKMATIS + LOCALSTORAGE
============================================================ */

const symbols = ["🍎", "🚗", "🎧", "🐶", "🎮", "🌙", "🔥", "⭐"];

let moves = 0;
let matches = 0;
let flipped = [];
let locked = false;

let timer = 0;
let timerID = null;

function prepareCards(pairs) {
    let set = [...symbols.slice(0, pairs), ...symbols.slice(0, pairs)];
    return set.sort(() => Math.random() - 0.5);
}

function startTimer() {
    timer = 0;
    document.getElementById("time").textContent = timer;
    timerID = setInterval(() => {
        timer++;
        document.getElementById("time").textContent = timer;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerID);
    timerID = null;
}

function renderBoard(pairs) {
    const board = document.getElementById("gameBoard");
    board.innerHTML = "";

    const cards = prepareCards(pairs);

    board.style.gridTemplateColumns = pairs <= 4 ? "repeat(4, 1fr)" : "repeat(6, 1fr)";

    cards.forEach(s => {
        const c = document.createElement("div");
        c.classList.add("card");
        c.dataset.symbol = s;
        c.textContent = "";
        c.addEventListener("click", flipCard);
        board.appendChild(c);
    });
}

function startGame() {
    const diff = Number(document.getElementById("difficulty").value);

    moves = 0;
    matches = 0;
    flipped = [];
    locked = false;

    document.getElementById("moves").textContent = moves;
    document.getElementById("matches").textContent = matches;
    document.getElementById("winMessage").style.display = "none";

    stopTimer();
    startTimer();

    renderBoard(diff);
}

document.getElementById("startGame").addEventListener("click", startGame);
document.getElementById("resetGame").addEventListener("click", startGame);

function flipCard() {
    if (locked) return;
    if (this.classList.contains("flipped")) return;

    this.classList.add("flipped");
    this.textContent = this.dataset.symbol;

    flipped.push(this);

    if (flipped.length === 2) checkMatch();
}

function checkMatch() {
    locked = true;
    moves++;
    document.getElementById("moves").textContent = moves;

    const [a, b] = flipped;

    if (a.dataset.symbol === b.dataset.symbol) {
        a.classList.add("matched");
        b.classList.add("matched");

        matches++;
        document.getElementById("matches").textContent = matches;

        const diff = Number(difficulty.value);

        if (matches === diff) {
            stopTimer();
            document.getElementById("winMessage").textContent = "🎉 Jūs laimėjote!";
            document.getElementById("winMessage").style.display = "block";

            saveBest(diff, moves, timer);
            loadBest();
        }

        flipped = [];
        locked = false;

    } else {
        setTimeout(() => {
            a.classList.remove("flipped");
            b.classList.remove("flipped");
            a.textContent = "";
            b.textContent = "";
            flipped = [];
            locked = false;
        }, 700);
    }
}

/* ============================================================
   LOCALSTORAGE — GERIAUSI REZULTATAI
============================================================ */

function saveBest(diff, newMoves, newTime) {

    let key = `best_${diff}`;
    let best = JSON.parse(localStorage.getItem(key));

    if (!best || newMoves < best.moves) {
        best = { moves: newMoves, time: newTime };
        localStorage.setItem(key, JSON.stringify(best));
    }
}

function loadBest() {

    const diffKeys = {
        3: ["best-easy-moves", "best-easy-time"],
        4: ["best-medium-moves", "best-medium-time"],
        6: ["best-hard-moves", "best-hard-time"],
    };

    Object.entries(diffKeys).forEach(([diff, ids]) => {
        let data = JSON.parse(localStorage.getItem(`best_${diff}`));

        if (data) {
            document.getElementById(ids[0]).textContent = data.moves;
            document.getElementById(ids[1]).textContent = data.time;
        }
    });
}

loadBest();
