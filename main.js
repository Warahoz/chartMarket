/**
 * 1. CONFIGURATION
 */
const apiKey = "efd29230e596434cb95c04fc612e6da2"; 
const symbol = "AAPL";
const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`;

/**
 * 2. GET OPERATION (Read & Display)
 * Fetches real-time data and updates the UI.
 */
async function getMarketSentiment() {
    try {
        console.log(`Fetching data for ${symbol}...`);
        
        const response = await fetch(url);
        
        // Error handling for network/server issues
        if (!response.ok) { 
            throw new Error(`HTTP error! Status: ${response.status}`); 
        }

        const data = await response.json();

        // Error handling for API-specific issues (wrong symbol, etc.)
        if (data.status === "error") {
            throw new Error(data.message);
        }

        // Processing the Data
        const change = parseFloat(data.percent_change);
        let sentiment = "";

        if (change > 1.0) {
            sentiment = "🚀 BULLISH: High Confidence!";
        } else if (change < -1.0) {
            sentiment = "⚠️ BEARISH: Market Panic!";
        } else {
            sentiment = "😴 STABLE: Quiet Day.";
        }

        // --- DISPLAYING RESULTS TO USER (DOM Manipulation) ---
        // Instead of just console.log, we update the actual website:
        document.getElementById('ticker-name').innerText = data.symbol;
        document.getElementById('live-price').innerText = `$${parseFloat(data.close).toFixed(2)}`;
        
        const changeEl = document.getElementById('price-change');
        changeEl.innerText = `${change > 0 ? '+' : ''}${change.toFixed(2)}% (${sentiment})`;
        changeEl.style.color = change > 0 ? "#00ff88" : "#ff4444";

        console.log(`Updated UI for ${data.symbol} at ${new Date().toLocaleTimeString()}`);

    } catch (error) {
        console.error("Oops! Something went wrong:", error.message);
    }
}

/**
 * 3. POST OPERATION (Create)
 * Adds a new stock symbol to the visible list.
 */
const addBtn = document.getElementById('add-btn');
const input = document.getElementById('symbol-input');
const list = document.getElementById('watchlist-list');

addBtn.addEventListener('click', () => {
    const value = input.value.toUpperCase().trim();
    if (value === "") return;

    // Create the HTML element (POSTing to the screen)
    const li = document.createElement('li');
    li.className = "watchlist-item";
    li.innerHTML = `
        <span class="stock-name">${value}</span>
        <div class="actions">
            <button class="patch-btn">Note</button>
            <button class="delete-btn">X</button>
        </div>
    `;

    list.appendChild(li); 
    input.value = ""; // Resetting the input field
});

/**
 * 4. PATCH & DELETE OPERATIONS (Update & Remove)
 * Uses Event Delegation to handle dynamic list items.
 */
list.addEventListener('click', (event) => {
    const parent = event.target.closest('.watchlist-item');
    if (!parent) return;

    // DELETE: Remove the item from the display
    if (event.target.classList.contains('delete-btn')) {
        parent.remove();
    }

    // PATCH: Partially update the item (add a status note)
    if (event.target.classList.contains('patch-btn')) {
        const nameSpan = parent.querySelector('.stock-name');
        nameSpan.innerText += " (Watching)";
        nameSpan.style.color = "#00f2ff";
        event.target.disabled = true; // Prevents updating twice
    }
});

/**
 * 5. INITIALIZATION
 */
getMarketSentiment(); // Run once on load
setInterval(getMarketSentiment, 60000); // Auto-update every minute



