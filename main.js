const apiKey = "efd29230e596434cb95c04fc612e6da2"; 

//  GET OPERATION (Read & Display) 
async function getStockData(symbol) {
    try {
        //  We send the request using the dynamic symbol and your API key
        const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`);
        const data = await response.json();

        //  If the API returns an error (wrong symbol/key).
        if (data.status === "error") {
            alert("Stock not found! Please check the symbol.");
            return;
        }

        // parsefloat to convert text data to numbers for comparison.
        const change = parseFloat(data.percent_change);
        const price = parseFloat(data.close).toFixed(2);
        // used tofixed to ensure price is in 2 decimal places.
        let sentiment = "";

        // Thresholds: > 1% is Bullish, < -1% is Bearish, else Stable
        // this is where we used emojis to show market sentiment for the stocks displayed when searched.
        if (change > 1.0) {
            sentiment = "🚀 BULLISH: High Confidence!";
        } else if (change < -1.0) {
            sentiment = "⚠️ BEARISH: Market Panic!";
        } else {
            sentiment = "😴 STABLE: Quiet Day.";
        }

        const priceEl = document.getElementById('live-price');
        priceEl.innerText = `$${price}`;
        priceEl.style.color = "#00f2ff"; 
        priceEl.style.fontFamily = "'Courier New', Courier, monospace";

         // Injecting the data into your HTML (DOM Updates).
        document.getElementById('ticker-name').innerText = data.symbol;
        
        const changeEl = document.getElementById('price-change');
        changeEl.innerText = `${change > 0 ? '+' : ''}${change.toFixed(2)}% | ${sentiment}`;

        if (change > 1.0) {
            changeEl.style.color = "#00ff88"; // Neon Green for booming stocks.
        } else if (change < -1.0) {
            changeEl.style.color = "#ff4444"; // Vivid Red faiing stocks.
        } else {
            changeEl.style.color = "#ffffff"; // White for Stable stocks.
        }

        console.log(`Successfully updated: ${data.symbol}`);

    } catch (error) {
        // Catches when system crashes or if the network fails.
        console.error("Oops! Connection failed:", error.message);
    }
}

// POST & SEARCH : This connects the "Add Stock" button to both the API and the Watchlist.
const addBtn = document.getElementById('add-btn');
const input = document.getElementById('symbol-input');
const list = document.getElementById('watchlist-list');

addBtn.addEventListener('click', () => {
    const value = input.value.toUpperCase().trim();
    
    if (value !== "") {
        // Fetch the data to show in the GET section when a new stock is added to the watchlist.
        getStockData(value);

        // Create a new item in the list below POST section for the watchlist.
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

// PATCH & DELETE : Using Event Delegation to handle the buttons inside the list.
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

//   Show Apple (AAPL) by default when the page first opens instead of being blank.
getStockData("AAPL");