let currentTarget = 'offer';
let currentCategory = 'Fruits';
let tradeState = {
  offer: [],
  receive: []
};

// Format large numbers with commas
const formatVal = (num) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  return num.toLocaleString('en-US');
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.tradeItems === 'undefined') {
    console.error("trade_items.js not loaded.");
    return;
  }
  
  populateFruitList();
});

function setSelectorTarget(target) {
  currentTarget = target;
  document.getElementById('tab-offer').classList.remove('active');
  document.getElementById('tab-receive').classList.remove('active');
  document.getElementById(`tab-${target}`).classList.add('active');
}

function setCategory(category) {
  currentCategory = category;
  
  // Reset all category buttons
  const catButtons = document.querySelectorAll('.category-tabs .btn');
  catButtons.forEach(btn => {
    btn.style.background = 'transparent';
    btn.style.color = 'var(--lime-green)';
  });
  
  // Set active category button
  const activeBtn = document.getElementById(`cat-${category}`);
  if(activeBtn) {
    activeBtn.style.background = 'var(--lime-green)';
    activeBtn.style.color = '#000';
  }
  
  if(window.AudioEngine) window.AudioEngine.playSFX('click');
  populateFruitList();
}

function populateFruitList() {
  const container = document.getElementById('fruit-list');
  container.innerHTML = '';
  
  const items = window.tradeItems[currentCategory] || [];
  
  items.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'fruit-item';
    
    // Check if it's a permanent fruit
    const isPerm = item.name.startsWith("Perm ");
    if (isPerm) {
      el.classList.add('perm-glow');
    }
    
    const imgHtml = item.image ? `<img src="${item.image}" alt="${item.name}">` : `<div style="display:flex; align-items:center; justify-content:center; height:50px; color:var(--lime-green); font-size:2rem; margin: 5px 0;"><i class="fas fa-scroll"></i></div>`;
    el.innerHTML = `
      ${imgHtml}
      <p>${item.name}</p>
      <p style="color: var(--lime-green); font-weight: bold;">${formatVal(item.value)}</p>
      ${isPerm ? '<div class="perm-label">PERM</div>' : ''}
    `;
    el.onclick = () => addFruit(index);
    container.appendChild(el);
  });
}

function addFruit(index) {
  const arr = tradeState[currentTarget];
  if (arr.length >= 4) {
    alert("You can only add up to 4 items per side!");
    return;
  }
  
  const items = window.tradeItems[currentCategory];
  arr.push(items[index]);
  if(window.AudioEngine) window.AudioEngine.playSFX('click');
  updateUI();
}

function removeFruit(side, slotIndex) {
  if (tradeState[side].length > slotIndex) {
    tradeState[side].splice(slotIndex, 1);
    if(window.AudioEngine) window.AudioEngine.playSFX('hover');
    updateUI();
  }
}

function updateUI() {
  // Update slots
  ['offer', 'receive'].forEach(side => {
    const slots = document.getElementById(`slots-${side}`).children;
    let total = 0;
    
    for (let i = 0; i < 4; i++) {
      const fruit = tradeState[side][i];
      const slot = slots[i];
      if (fruit) {
        const isPerm = fruit.name.startsWith("Perm ");
        slot.className = isPerm ? 'fruit-slot filled perm-glow' : 'fruit-slot filled';
        const slotImgHtml = fruit.image ? `<img src="${fruit.image}" alt="${fruit.name}">` : `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:var(--lime-green); font-size:2rem;"><i class="fas fa-scroll"></i></div>`;
        slot.innerHTML = `
          ${slotImgHtml}
          ${isPerm ? '<div class="perm-label" style="font-size: 0.6rem; padding: 2px 4px; bottom: 5px;">PERM</div>' : ''}
          <div class="remove-fruit"><i class="fas fa-times"></i></div>
        `;
        total += fruit.value;
      } else {
        slot.className = 'fruit-slot';
        slot.innerHTML = '';
      }
    }
    
    document.getElementById(`val-${side}`).innerText = formatVal(total);
  });
  
  calculateResult();
}

function calculateResult() {
  const offerTotal = tradeState['offer'].reduce((sum, f) => sum + f.value, 0);
  const receiveTotal = tradeState['receive'].reduce((sum, f) => sum + f.value, 0);
  
  const wflText = document.getElementById('wfl-text');
  const wflDiff = document.getElementById('wfl-diff');
  const diffBar = document.getElementById('diff-bar');
  
  if (offerTotal === 0 && receiveTotal === 0) {
    wflText.innerText = "ADD FRUITS";
    wflText.style.color = "var(--text-main)";
    wflDiff.innerText = "Difference: 0";
    diffBar.style.width = '50%';
    diffBar.className = 'diff-bar';
    return;
  }
  
  const diff = receiveTotal - offerTotal;
  wflDiff.innerText = `Difference: ${diff > 0 ? '+' : ''}${formatVal(diff)}`;
  
  // Calculate percentage difference for the bar (cap at +/- 100%)
  const maxVal = Math.max(offerTotal, receiveTotal, 1);
  const diffPercent = (diff / maxVal) * 100;
  
  // Bar is 50% when perfectly fair.
  // 100% when massive win, 0% when massive lose.
  let barWidth = 50 + (diffPercent / 2);
  barWidth = Math.max(0, Math.min(100, barWidth));
  diffBar.style.width = `${barWidth}%`;
  
  // Thresholds for W/F/L
  const fairThreshold = 0.1 * maxVal; // 10% tolerance for "Fair"
  
  if (diff > fairThreshold) {
    wflText.innerText = "WIN";
    wflText.style.color = "var(--lime-green)";
    diffBar.className = 'diff-bar'; // green
  } else if (diff < -fairThreshold) {
    wflText.innerText = "LOSE";
    wflText.style.color = "#ff3939";
    diffBar.className = 'diff-bar loss'; // red
  } else {
    wflText.innerText = "FAIR";
    wflText.style.color = "#ffd700"; // gold
    diffBar.className = 'diff-bar';
    diffBar.style.backgroundColor = "#ffd700";
  }
}
