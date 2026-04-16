const apiKey = "efd29230e596434cb95c04fc612e6da2"; 

//  GET OPERATION (Read & Display) 
async function getStockData(symbol) {
    try {
        const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`);
        const data = await response.json();

        if (data.status === "error") {
            alert("Stock not found!");
            return;
        }

        // --- RESTORED SENTIMENT LOGIC ---
        const change = parseFloat(data.percent_change);
        let sentiment = "";

        if (change > 1.0) {
            sentiment = "🚀 BULLISH: High Confidence!";
        } else if (change < -1.0) {
            sentiment = "⚠️ BEARISH: Market Panic!";
        } else {
            sentiment = "😴 STABLE: Quiet Day.";
        }

        // --- UPDATE UI ---
        document.getElementById('ticker-name').innerText = data.symbol;
        document.getElementById('live-price').innerText = `$${parseFloat(data.close).toFixed(2)}`;
        
        const changeEl = document.getElementById('price-change');
        // Displays the % and your sentiment text
        changeEl.innerText = `${change > 0 ? '+' : ''}${change.toFixed(2)}% | ${sentiment}`;
        changeEl.style.color = change > 0 ? "#00ff88" : "#ff4444";
        
        // If it's stable, let's make it a neutral grey/white
        if (change <= 1.0 && change >= -1.0) {
            changeEl.style.color = "#ffffff";
        }

    } catch (error) {
        console.error("Fetch Error:", error);
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