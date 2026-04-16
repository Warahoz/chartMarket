/**
 * 1. CONFIGURATION
 * We store the API key here. 
 */
const apiKey = "2fb9e7fa62c34689a85fe3c4321faefb"; 

/**
 * 2. GET OPERATION (Read & Display)
 * This function is now DYNAMIC. It takes a 'symbol' as an argument.
 */
async function getStockData(symbol) {
    try {
        console.log(`Fetching data for: ${symbol}`);
        
        // Step A: The Request (URL is built inside the function using the parameter)
        const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`);
        
        // Step B: Parsing the JSON
        const data = await response.json();

        // Step C: Error Handling (If the API doesn't find the stock)
        if (data.status === "error") {
            alert("Stock not found! Please check the symbol (e.g., TSLA, BTC/USD).");
            return;
        }

        // Step D: Update the Main Dashboard UI
        document.getElementById('ticker-name').innerText = data.symbol;
        document.getElementById('live-price').innerText = `$${parseFloat(data.close).toFixed(2)}`;

        // Step E: Bullish/Bearish Logic (Color Coding)
        const change = parseFloat(data.percent_change);
        const changeEl = document.getElementById('price-change');
        
        changeEl.innerText = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
        changeEl.style.color = change > 0 ? "#00ff88" : "#ff4444";

    } catch (error) {
        console.error("Connection Error:", error);
    }
}

/**
 * 3. POST & SEARCH TRIGGER
 * This connects the "Add Stock" button to both the API and the Watchlist.
 */
const addBtn = document.getElementById('add-btn');
const input = document.getElementById('symbol-input');
const list = document.getElementById('watchlist-list');

addBtn.addEventListener('click', () => {
    const value = input.value.toUpperCase().trim();
    
    if (value !== "") {
        // ACTION 1: Fetch the data to show in the big main box (GET)
        getStockData(value);

        // ACTION 2: Create a new item in the list below (POST)
        const li = document.createElement('li');
        li.className = "watchlist-item";
        li.innerHTML = `
            <span class="stock-name">${value}</span>
            <div class="item-actions">
                <button class="patch-btn">Note</button>
                <button class="delete-btn">X</button>
            </div>
        `;
        
        list.appendChild(li);
        input.value = ""; // Clear input for the next search
    }
});

/**
 * 4. PATCH & DELETE (Update & Remove)
 * Using Event Delegation to handle the buttons inside the list.
 */
list.addEventListener('click', (event) => {
    const clickedElement = event.target;
    const parentItem = clickedElement.closest('.watchlist-item');

    if (!parentItem) return;

    // DELETE: Removes the item from the screen
    if (clickedElement.classList.contains('delete-btn')) {
        parentItem.remove();
    }

    // PATCH: Updates the text of the existing item
    if (clickedElement.classList.contains('patch-btn')) {
        const span = parentItem.querySelector('.stock-name');
        span.innerText += " (Watching)";
        span.style.color = "#00f2ff";
        clickedElement.disabled = true; // Button can only be clicked once
    }
});

/**
 * 5. INITIAL LOAD
 * Show Apple (AAPL) by default when the page first opens.
 */
getStockData("AAPL");