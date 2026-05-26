import re

with open('script.js.backup', 'r', encoding='utf-8') as f:
    content = f.read()

trade_logic = """// --- Global Trading Backend ---
const GLOBAL_DB_URL = 'https://api.restful-api.dev/objects/ff8081819d82fab6019e5f5a4fb7787f';

async function fetchGlobalTrades() {
  try {
    const res = await fetch(GLOBAL_DB_URL, { cache: 'no-store' });
    if (!res.ok) return;
    const json = await res.json();
    const trades = json.data?.trades || [];
    
    const container = document.getElementById('trades-container');
    if (!container) return;
    
    container.innerHTML = '';
    trades.forEach(trade => {
      const card = document.createElement('div');
      card.className = 'trade-card';
      card.innerHTML = `
        <p><strong><i class="fas fa-user-circle"></i> ${trade.discord}</strong> (Discord)</p>
        <p><strong>LF:</strong> ${trade.lf}</p>
        <p><strong>Offer:</strong> ${trade.offer}</p>
        <div class="trade-actions"><button class="btn btn-outline" style="font-size: 0.9rem; padding: 5px 10px;" onclick="navigator.clipboard.writeText('${trade.discord}'); alert('Copied: ${trade.discord}')">Copy Tag</button></div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load global trades:", err);
  }
}

// Start polling for trades if we are on the trading page
if (document.getElementById('trades-container')) {
  fetchGlobalTrades();
  setInterval(fetchGlobalTrades, 10000); // Check every 10 seconds
}

const tradeForm = document.getElementById('trade-form');
if (tradeForm) {
  tradeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const discord = document.getElementById('discord-user').value.replace(/</g, "&lt;");
    const lf = document.getElementById('lf-fruits').value.replace(/</g, "&lt;");
    const offer = document.getElementById('offer-fruits').value.replace(/</g, "&lt;");
    
    // Animate button
    const btn = tradeForm.querySelector('button');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting Global Trade...';
    if(window.AudioEngine) window.AudioEngine.playSFX('click');
    
    try {
      // 1. Fetch current trades
      const res = await fetch(GLOBAL_DB_URL);
      const json = await res.json();
      let trades = json.data?.trades || [];
      
      // 2. Add new trade to top
      trades.unshift({ discord, lf, offer, time: Date.now() });
      
      // 3. Keep only top 20 trades
      if (trades.length > 20) trades = trades.slice(0, 20);
      
      // 4. Update global DB
      const updateRes = await fetch(GLOBAL_DB_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
        body: JSON.stringify({
          name: "AlertServiceTrades2026",
          data: { trades }
        })
      });
      
      if(updateRes.ok) {
        tradeForm.reset();
        await fetchGlobalTrades(); // Refresh view
        if (discord.toLowerCase().includes('alert') && window.AudioEngine) {
          window.AudioEngine.playSFX('success');
        }
      } else {
        alert("Failed to post global trade. Please try again.");
      }
    } catch(err) {
      console.error(err);
      alert("Network error while posting trade.");
    } finally {
      btn.innerHTML = 'Post Trade Ad';
    }
  });
}
"""

start_str = "// --- Trading Page Logic ---"
end_str = "// Fake Admin Button Easter Egg"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + trade_logic + "\n\n" + content[end_idx:]
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("script.js perfectly restored and updated!")
else:
    print("Could not find the target blocks.")
