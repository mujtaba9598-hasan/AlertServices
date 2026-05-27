// --- AUDIO ENGINE ---
window.AudioEngine = (function() {
  let ctx = null;
  let bgmOscillators = [];
  let sfxEnabled = localStorage.getItem('sfxEnabled') !== 'false';
  let bgmEnabled = localStorage.getItem('bgmEnabled') === 'true';
  let currentTheme = 'default';
  
  const init = () => {
    if (!ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        ctx = new AudioContext();
      }
    }
  };

  const getThemeFreqs = (theme) => {
    const base = {
      'default': [220, 330, 440], // A minor ish
      'blue-theme': [196, 293.66, 392], // G
      'red-theme': [130.81, 155.56, 196], // C minor deep
      'gold-theme': [261.63, 329.63, 392], // C major bright
      'purple-theme': [207.65, 277.18, 329.63], // Ab augmented ish
      'emerald-theme': [329.63, 392, 493.88], // E minor pentatonic ish
      'crimson-theme': [65.41, 77.78, 92.50], // Deep dissonant
      'white-theme': [523.25, 659.25, 783.99], // High C major
      'voidwalker-theme': [55.0, 65.41, 82.41], // Extremely low, eerie
      'balanced-theme': [130.81, 261.63, 523.25] // Octaves (balanced)
    };
    return base[theme] || base['default'];
  };

  const getSFXPitch = (theme) => {
    const pitchMap = {
      'default': 1.0,
      'blue-theme': 0.8,
      'red-theme': 0.5, // Low pitched, aggressive
      'gold-theme': 1.5, // High, bright
      'purple-theme': 1.2, // Magical
      'emerald-theme': 1.8, // Very high, natural
      'crimson-theme': 0.3, // Deep, dark
      'white-theme': 2.0,  // Ethereal
      'voidwalker-theme': 0.2, // Lowest
      'balanced-theme': 1.0 // Balanced
    };
    return pitchMap[theme] || 1.0;
  };

  const playSFX = (type) => {
    if (!sfxEnabled || !ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const now = ctx.currentTime;
    const pitch = getSFXPitch(currentTheme);
    
    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 * pitch, now);
      osc.frequency.exponentialRampToValueAtTime(800 * pitch, now + 0.1);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'click') {
      if (currentTheme === 'voidwalker-theme') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(10, now + 0.6);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (currentTheme === 'balanced-theme') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 * pitch, now);
        osc.frequency.linearRampToValueAtTime(400 * pitch, now + 0.3);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (currentTheme === 'default') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(150 * pitch, now + 0.1);
      } else {
        osc.type = (currentTheme === 'red-theme' || currentTheme === 'crimson-theme') ? 'sawtooth' : 'square';
        osc.frequency.setValueAtTime(300 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(100 * pitch, now + 0.15);
      }
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      if (currentTheme !== 'voidwalker-theme' && currentTheme !== 'balanced-theme') {
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } else if (type === 'dice') {
      osc.type = (currentTheme === 'gold-theme' || currentTheme === 'white-theme') ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(400 * pitch, now);
      osc.frequency.linearRampToValueAtTime(800 * pitch, now + 0.2);
      osc.frequency.linearRampToValueAtTime(300 * pitch, now + 0.4);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type.startsWith('ee_')) {
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      if (type === 'ee_matrix') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(200 * pitch, now);
        for(let i=0; i<10; i++) {
          osc.frequency.setValueAtTime((200 + Math.random()*400)*pitch, now + i*0.1);
        }
        osc.start(now); osc.stop(now + 1.5);
      } else if (type === 'ee_bounty') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150 * pitch, now);
        osc.frequency.linearRampToValueAtTime(50 * pitch, now + 1.0);
        osc.start(now); osc.stop(now + 1.5);
      } else if (type === 'ee_dodge') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(1200 * pitch, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(600 * pitch, now + 0.4);
        osc.start(now); osc.stop(now + 0.5);
      } else if (type === 'ee_sea') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100 * pitch, now);
        const lfo = ctx.createOscillator();
        lfo.type = 'sine'; lfo.frequency.value = 5;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 50;
        lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
        lfo.start(now); lfo.stop(now + 1.5);
        osc.start(now); osc.stop(now + 1.5);
      } else if (type === 'ee_title') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 * pitch, now);
        osc.frequency.setValueAtTime(1200 * pitch, now + 0.2);
        osc.frequency.setValueAtTime(1600 * pitch, now + 0.4);
        osc.start(now); osc.stop(now + 1.0);
      } else if (type === 'ee_leak') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(200 * pitch, now + 0.1);
        osc.frequency.setValueAtTime(400 * pitch, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(200 * pitch, now + 0.3);
        osc.start(now); osc.stop(now + 0.5);
      } else if (type === 'ee_beyond') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400 * pitch, now);
        osc.frequency.linearRampToValueAtTime(1200 * pitch, now + 1.0);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.linearRampToValueAtTime(0.001, now + 1.5);
        osc.start(now); osc.stop(now + 1.5);
      } else if (type === 'ee_overload') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800 * pitch, now);
        osc.frequency.exponentialRampToValueAtTime(50 * pitch, now + 1.5);
        const lfo = ctx.createOscillator();
        lfo.type = 'square'; lfo.frequency.value = 20;
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 400;
        lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
        lfo.start(now); lfo.stop(now + 1.5);
        osc.start(now); osc.stop(now + 1.5);
      }
    }
  };

  const stopBGM = () => {
    bgmOscillators.forEach(o => {
      try {
        o.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        setTimeout(() => { o.osc.stop(); o.osc.disconnect(); o.gain.disconnect(); }, 1000);
      } catch(e) {}
    });
    bgmOscillators = [];
  };

  const startBGM = (theme) => {
    if (!bgmEnabled || !ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    stopBGM();
    
    currentTheme = theme;
    const freqs = getThemeFreqs(theme);
    const now = ctx.currentTime;
    
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = (theme === 'red-theme' || theme === 'crimson-theme') ? 'sawtooth' : 
                 (theme === 'white-theme' || theme === 'gold-theme' || theme === 'emerald-theme') ? 'sine' : 'triangle';
      
      osc.frequency.value = freq;
      
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1 + (i * 0.05);
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.02;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      
      bgmOscillators.push({osc, gain, lfo});
    });
  };

  const updateTheme = (theme) => {
    if (theme !== currentTheme) {
      if (bgmEnabled) {
        startBGM(theme);
      } else {
        currentTheme = theme;
      }
    }
  };

  const toggleSFX = (val) => {
    sfxEnabled = val;
    localStorage.setItem('sfxEnabled', val);
    if (val) init();
  };

  const toggleBGM = (val) => {
    bgmEnabled = val;
    localStorage.setItem('bgmEnabled', val);
    if (val) {
      init();
      startBGM(currentTheme);
    } else {
      stopBGM();
    }
  };

  return { init, playSFX, startBGM, stopBGM, updateTheme, toggleSFX, toggleBGM, get sfxEnabled() { return sfxEnabled; }, get bgmEnabled() { return bgmEnabled; } };
})();

// Hook up global clicks to init audio (browsers require user interaction)
document.addEventListener('click', () => {
  window.AudioEngine.init();
}, { once: true });

document.addEventListener('DOMContentLoaded', () => {
  // Inject neon favicon
  const injectFavicon = () => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#39ff14" stroke-width="12" filter="drop-shadow(0 0 8px #39ff14)"/></svg>`;
    link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
  };
  injectFavicon();

  // Add Lava Lamp Background
  const createLavaLamp = () => {
    if (document.querySelector('.lava-lamp-bg')) return; // Prevent duplicate
    const container = document.createElement('div');
    container.className = 'lava-lamp-bg';
    
    for (let i = 0; i < 3; i++) {
      const blob = document.createElement('div');
      blob.className = `lava-blob blob-${i + 1}`;
      container.appendChild(blob);
    }
    
    document.body.prepend(container);
  };
  createLavaLamp();

  // Mobile Menu Toggle with Side Drawer Overlay
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    let overlay = document.querySelector('.mobile-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mobile-overlay';
      document.body.appendChild(overlay);
    }
    
    const toggleMenu = () => {
      navLinks.classList.toggle('active');
      overlay.classList.toggle('active');
      if(window.AudioEngine) window.AudioEngine.playSFX('click');
    };
    
    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) toggleMenu();
      });
    });
  }

  // Active link highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-links a');
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPath) {
      item.classList.add('active');
    }
  });

  // Fade-in on scroll animation
  const faders = document.querySelectorAll('.fade-in');
  
  const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once it's visible
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Neon Green Mouse Trail
  let balancedDotToggle = false;
  const createTrailDot = (x, y) => {
    const dot = document.createElement('div');
    dot.className = 'mouse-trail-dot';
    
    if (document.body.classList.contains('balanced-theme')) {
      balancedDotToggle = !balancedDotToggle;
      dot.style.background = balancedDotToggle ? '#ffffff' : '#000000';
      dot.style.boxShadow = balancedDotToggle ? '0 0 10px #ffffff, 0 0 20px #ffffff' : '0 0 10px #000000, 0 0 20px #000000';
      // Adjust size slightly for better visibility
      dot.style.width = '8px';
      dot.style.height = '8px';
    }
    
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    document.body.appendChild(dot);
    
    setTimeout(() => {
      dot.remove();
    }, 2000);
  };

  let lastX = 0;
  let lastY = 0;
  let cursorTargetX = 0;
  let cursorTargetY = 0;
  let isThrottled = false;

  document.addEventListener('mousemove', (e) => {
    // Disable on touch devices or small screens to prevent overlap/performance issues
    if (window.innerWidth <= 900 || window.matchMedia("(pointer: coarse)").matches) return;

    cursorTargetX = e.clientX;
    cursorTargetY = e.clientY;

    if (isThrottled) return;
    isThrottled = true;
    setTimeout(() => isThrottled = false, 20); // Throttle for performance

    const x = e.pageX;
    const y = e.pageY;
    
    const dist = Math.hypot(x - lastX, y - lastY);
    if (dist > 15) { // Only drop a dot if mouse moved enough
      createTrailDot(x, y);
      lastX = x;
      lastY = y;
    }
  });



  // Page Transition Fade Effect
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 50);

  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Ignore if it's an external link, a hash link, or just "#"
      if (!href || href === '#' || href.startsWith('http') || href.startsWith('#') || href === currentPath) return;

      // Handle target="_blank"
      if (this.getAttribute('target') === '_blank') return;

      e.preventDefault();
      document.body.classList.remove('loaded');
      document.body.classList.add('fade-out');
      
      setTimeout(() => {
        window.location.href = href;
      }, 400); // Matches CSS transition duration
    });
  });
});

// Themes array
const allThemes = ['default', 'blue-theme', 'red-theme', 'gold-theme', 'purple-theme', 'emerald-theme', 'crimson-theme', 'white-theme', 'voidwalker-theme', 'balanced-theme'];

// Easter Egg Logic (Theme Toggle)
window.rollDice = function() {
  const dice = document.querySelector('.easter-egg-dice i');
  if (!dice) return;
  
  if (window.trackDiceFound) window.trackDiceFound('topR');
  
  // Spin the dice
  dice.style.transform = 'rotate(720deg) scale(1.5)';
  window.AudioEngine.playSFX('dice');
  
  setTimeout(() => {
    dice.style.transform = '';
    
    // Add transition class for smooth color change
    document.body.classList.add('theme-transition');
    
    let unlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    let availableThemes = ['default'];
    if (unlocked.includes('default')) {} // Just to structure it, blue is always available? Wait, blue was always available in original code: ['default', 'blue-theme'].
    // Let's add them conditionally or explicitly in order.
    availableThemes.push('blue-theme');
    if (unlocked.includes('dice_hunter')) availableThemes.push('red-theme');
    if (unlocked.includes('generous_spirit')) availableThemes.push('gold-theme');
    if (unlocked.includes('theme_master')) availableThemes.push('purple-theme');
    if (unlocked.includes('touch_lamp')) availableThemes.push('emerald-theme');
    if (unlocked.includes('system_failed')) availableThemes.push('crimson-theme');
    if (unlocked.includes('beyond_alerted')) availableThemes.push('white-theme');
    if (unlocked.includes('voidwalker')) availableThemes.push('voidwalker-theme');
    if (JSON.parse(localStorage.getItem('alert_stats') || '{}').balancedUnlocked) availableThemes.push('balanced-theme');
    
    // Find current theme
    let currentThemeName = 'default';
    for (let i = 1; i < allThemes.length; i++) {
      if (document.body.classList.contains(allThemes[i])) {
        currentThemeName = allThemes[i];
        break;
      }
    }
    
    // Remove current theme
    if (currentThemeName !== 'default') {
      document.body.classList.remove(currentThemeName);
    }
    
    // Apply next theme
    let currentIndex = availableThemes.indexOf(currentThemeName);
    if (currentIndex === -1) currentIndex = 0;
    const nextTheme = availableThemes[(currentIndex + 1) % availableThemes.length];
    
    if (nextTheme !== 'default') {
      document.body.classList.add(nextTheme);
    }
    
    localStorage.setItem('theme', nextTheme);
    if (window.incrementThemeChanges) window.incrementThemeChanges();
    window.AudioEngine.updateTheme(nextTheme);
    
    // Remove transition class after 1s to not interfere with hover states
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 1000);
    
  }, 500);
};

// Check for saved theme on load
document.addEventListener('DOMContentLoaded', () => {
  let savedTheme = localStorage.getItem('theme');
  
  // Migrate old values
  if (savedTheme === 'blue') savedTheme = 'blue-theme';
  if (savedTheme === 'green') savedTheme = 'default';
  
  if (savedTheme && savedTheme !== 'default' && allThemes.includes(savedTheme)) {
    document.body.classList.add(savedTheme);
  }
  
  // Set initial audio theme
  window.AudioEngine.updateTheme(savedTheme || 'default');
});

// --- NEW LOGIC: Stats, Achievements, Modals, Performance ---
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject New Elements
  const perfDiceHtml = `<div class="dice-btn perf-dice" title="Settings"><i class="fas fa-dice-d20"></i></div>`;
  const achDiceHtml = `<div class="dice-btn footer-dice-left" title="Achievements"><i class="fas fa-dice-d20"></i></div>`;
  const statsDiceHtml = `<div class="dice-btn footer-dice-right" title="Stats"><i class="fas fa-dice-d20"></i></div>`;
  const donationBtnHtml = `<a href="#" class="donation-btn" id="donateBtn"><i class="fas fa-heart"></i> Donate</a>`;
  
  // Inject modal HTML
  const modalHtml = `
    <div class="modal-overlay" id="mainModal">
      <div class="modal-content" style="max-height: 80vh; overflow-y: auto;">
        <i class="fas fa-times modal-close"></i>
        <h2 class="modal-title" id="modalTitle">Title</h2>
        <div id="modalBody"></div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', perfDiceHtml + modalHtml);
  
  // Fake Admin Button Easter Egg
  const adminBtn = document.createElement('div');
  adminBtn.style.cssText = "position:fixed; bottom:0; right:0; width:10px; height:10px; opacity:0; z-index:99999; cursor:pointer;";
  document.body.appendChild(adminBtn);
  
  adminBtn.addEventListener('click', () => {
    stats.eggsFound.admin = true; saveStats();
    prompt('ADMIN LOGIN REQUIRED: Enter Password');
    alert('ACCESS DENIED.');
    
    document.body.classList.add('admin-flash');
    const overlay = document.createElement('div');
    overlay.className = 'admin-lockout-overlay';
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      document.body.classList.remove('admin-flash');
      overlay.remove();
    }, 3000);
  });
  
  const footer = document.querySelector('footer');
  if (footer) {
    footer.insertAdjacentHTML('beforeend', achDiceHtml + statsDiceHtml);
    const lastP = footer.querySelector('p:last-child');
    if (lastP) {
      lastP.insertAdjacentHTML('afterend', '<br>' + donationBtnHtml);
    } else {
      footer.insertAdjacentHTML('beforeend', '<br>' + donationBtnHtml);
    }
  }

  // 2. Performance Mode Logic
  const perfDice = document.querySelector('.perf-dice');
  let isPerfMode = localStorage.getItem('perfMode') === 'true';
  
  const applyPerfMode = () => {
    if (isPerfMode) {
      document.body.classList.add('performance-mode');
      perfDice.classList.add('active');
    } else {
      document.body.classList.remove('performance-mode');
      perfDice.classList.remove('active');
    }
  };
  applyPerfMode(); // Apply on load

  // Logo Glow & Effects Settings Logic
  let isLogoEffects = localStorage.getItem('logoEffects') !== 'false';
  const applyLogoEffects = () => {
    if (isLogoEffects) {
      document.body.classList.remove('no-logo-effects');
    } else {
      document.body.classList.add('no-logo-effects');
    }
  };
  applyLogoEffects(); // Apply on load

  perfDice.addEventListener('click', () => {
    if (window.trackDiceFound) window.trackDiceFound('topL');
    window.AudioEngine.playSFX('dice');
    const icon = perfDice.querySelector('i');
    icon.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => icon.style.transform = '', 500);

    const html = `
      <div style="text-align:left;">
        <div class="settings-row">
          <span>Performance Mode</span>
          <label class="toggle-switch">
            <input type="checkbox" id="togglePerf" ${isPerfMode ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <span>Logo Glow & Effects</span>
          <label class="toggle-switch">
            <input type="checkbox" id="toggleLogoEffects" ${isLogoEffects ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <span>Sound Effects (SFX)</span>
          <label class="toggle-switch">
            <input type="checkbox" id="toggleSFX" ${window.AudioEngine.sfxEnabled ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <span>Background Music (BGM)</span>
          <label class="toggle-switch">
            <input type="checkbox" id="toggleBGM" ${window.AudioEngine.bgmEnabled ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
      </div>
    `;
    
    openModal('Settings', html);
    
    document.getElementById('togglePerf').addEventListener('change', (e) => {
      isPerfMode = e.target.checked;
      localStorage.setItem('perfMode', isPerfMode);
      applyPerfMode();
      window.AudioEngine.playSFX('click');
    });

    document.getElementById('toggleLogoEffects').addEventListener('change', (e) => {
      isLogoEffects = e.target.checked;
      localStorage.setItem('logoEffects', isLogoEffects);
      applyLogoEffects();
      window.AudioEngine.playSFX('click');
    });
    
    document.getElementById('toggleSFX').addEventListener('change', (e) => {
      window.AudioEngine.toggleSFX(e.target.checked);
      window.AudioEngine.playSFX('click');
    });
    
    document.getElementById('toggleBGM').addEventListener('change', (e) => {
      window.AudioEngine.toggleBGM(e.target.checked);
      window.AudioEngine.playSFX('click');
    });
  });

  // Bind SFX to UI elements
  const bindSFX = () => {
    document.querySelectorAll('a, .btn, .card, .mini-book-container').forEach(el => {
      if (!el.dataset.sfxBound) {
        el.dataset.sfxBound = "true";
        el.addEventListener('mouseenter', () => window.AudioEngine.playSFX('hover'));
        el.addEventListener('click', () => window.AudioEngine.playSFX('click'));
      }
    });
  };
  bindSFX();
  // Call bindSFX if DOM changes later, or just once is fine for static pages.

  // 3. Stats Engine Initialization
  const defaultStats = {
    totalVisits: 0,
    totalClicks: parseInt(localStorage.getItem('totalClicks') || '0'),
    timeSpentSeconds: parseInt(localStorage.getItem('timeSpentSeconds') || '0'),
    themeChanges: parseInt(localStorage.getItem('themeChanges') || '0'),
    cursorDistance: 0,
    longestSession: 0,
    shortestSession: Infinity,
    themeTime: { 'default': 0, 'blue-theme': 0, 'red-theme': 0, 'gold-theme': 0, 'purple-theme': 0, 'emerald-theme': 0, 'crimson-theme': 0, 'white-theme': 0 },
    diceFound: { topR: false, topL: false, botR: false, botL: false },
    discordClicked: false,
    donated: false,
    visitedPages: {},
    greenLampTouched: false,
    matrixActivations: 0,
    beyondAlerted: false,
    eggsFound: { matrix: false, overload: false, admin: false, sea: false, dodge: false, leak: false, title: false, bounty: false },
    balancedUnlocked: false
  };

  let savedStats = JSON.parse(localStorage.getItem('alert_stats')) || {};
  let stats = { ...defaultStats, ...savedStats };
  stats.themeTime = { ...defaultStats.themeTime, ...(savedStats.themeTime || {}) };
  stats.diceFound = { ...defaultStats.diceFound, ...(savedStats.diceFound || {}) };
  stats.visitedPages = { ...defaultStats.visitedPages, ...(savedStats.visitedPages || {}) };
  stats.eggsFound = { ...defaultStats.eggsFound, ...(savedStats.eggsFound || {}) };
  
  const currentFileName = window.location.pathname.split('/').pop() || 'index.html';
  if (!stats.visitedPages[currentFileName]) {
    stats.visitedPages[currentFileName] = true;
  }
  
  const sessionStart = Date.now();
  stats.totalVisits++;
  
  const saveStats = () => {
    localStorage.setItem('alert_stats', JSON.stringify(stats));
    checkAchievements();
  };

  // Track page leave for session length
  window.addEventListener('beforeunload', () => {
    const sessionLength = Math.floor((Date.now() - sessionStart) / 1000);
    if (sessionLength > stats.longestSession) stats.longestSession = sessionLength;
    if (stats.shortestSession === null || sessionLength < stats.shortestSession) stats.shortestSession = sessionLength;
    saveStats();
  });

  // Track clicks
  document.addEventListener('click', (e) => {
    if (e.target.closest('.dice-btn') || e.target.closest('.easter-egg-dice')) return;
    stats.totalClicks++;
    saveStats();
  });

  // Track mouse distance
  let sLastX = 0, sLastY = 0;
  document.addEventListener('mousemove', (e) => {
    if (sLastX && sLastY) {
      stats.cursorDistance += Math.hypot(e.clientX - sLastX, e.clientY - sLastY);
    }
    sLastX = e.clientX;
    sLastY = e.clientY;
  });

  // Track time & theme time
  setInterval(() => {
    stats.timeSpentSeconds++;
    let currentTheme = 'default';
    for (let i = 1; i < allThemes.length; i++) {
      if (document.body.classList.contains(allThemes[i])) {
        currentTheme = allThemes[i];
        break;
      }
    }
    stats.themeTime[currentTheme] = (stats.themeTime[currentTheme] || 0) + 1;
    saveStats();
  }, 1000);

  // External trackers
  window.incrementThemeChanges = () => {
    stats.themeChanges++;
    saveStats();
  };

  window.trackDiceFound = (diceId) => {
    stats.diceFound[diceId] = true;
    saveStats();
  };

  document.querySelectorAll('a[href*="discord.gg"]').forEach(a => {
    a.addEventListener('click', () => {
      stats.discordClicked = true;
      saveStats();
    });
  });

  const donateBtn = document.getElementById('donateBtn');
  if (donateBtn) {
    donateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      stats.donated = true;
      saveStats();
      alert("Thanks for tapping donate! You've unlocked the Gold Theme.");
    });
  }

  const greenLamp = document.querySelector('.secret-green-lamp');
  if (greenLamp) {
    greenLamp.addEventListener('click', () => {
      if (!stats.greenLampTouched) {
        stats.greenLampTouched = true;
        saveStats();
        alert("You touched the Green Lamp! Emerald Green theme unlocked.");
      }
    });
  }

  // Matrix Easter Egg & Useless Easter Eggs Buffer
  let secretBuffer = "";
  
  const checkEasterEggBuffer = () => {
    if (secretBuffer.length > 20) {
      secretBuffer = secretBuffer.slice(-20);
    }
    
    // Unlock All Themes Check (Must be before "alerted" to avoid collision)
    if (secretBuffer.endsWith("beyondalerted")) {
      window.AudioEngine.playSFX('ee_beyond');
      let unlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
      const themeAchievements = ['dice_hunter', 'generous_spirit', 'theme_master', 'touch_lamp', 'system_failed', 'beyond_alerted', 'voidwalker'];
      let changed = false;
      themeAchievements.forEach(ach => {
        if (!unlocked.includes(ach)) {
          unlocked.push(ach);
          changed = true;
        }
      });
      if (!stats.balancedUnlocked) {
        stats.balancedUnlocked = true;
        saveStats();
        changed = true;
      }
      if (changed) {
        localStorage.setItem('unlockedAchievements', JSON.stringify(unlocked));
        alert("GOD MODE ACTIVATED: All themes (including Voidwalker & Balanced) unlocked!");
      }
      secretBuffer = "";
      return; // Exit early to prevent matching "alerted"
    }

    // Matrix Check
    if (secretBuffer.endsWith("alerted")) {
      stats.eggsFound.matrix = true; saveStats();
      window.AudioEngine.playSFX('ee_matrix');
      triggerMatrixTheme();
      secretBuffer = "";
    }
    
    // Balanced Check
    if (secretBuffer.endsWith("balanced")) {
      let unlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
      if (unlocked.includes('beyond_alerted') && unlocked.includes('voidwalker')) {
        if (!stats.balancedUnlocked) {
          stats.balancedUnlocked = true; saveStats();
          alert("Balance Achieved: Yin-Yang Theme Unlocked!");
        }
        document.body.className = document.body.className.replace(/\b[a-z]+-theme\b/g, '');
        document.body.classList.add('balanced-theme');
        localStorage.setItem('theme', 'balanced-theme');
        window.AudioEngine.updateTheme('balanced-theme');
      }
      secretBuffer = "";
    }
    
    // Bounty Check
    if (secretBuffer.endsWith("bounty")) {
      stats.eggsFound.bounty = true; saveStats();
      window.AudioEngine.playSFX('ee_bounty');
      triggerBounty();
      secretBuffer = "";
    }

    // Dodge Check
    if (secretBuffer.endsWith("dodge")) {
      stats.eggsFound.dodge = true; saveStats();
      window.AudioEngine.playSFX('ee_dodge');
      triggerDodge();
      secretBuffer = "";
    }
    
    // Sea Check
    if (secretBuffer.endsWith("sea")) {
      stats.eggsFound.sea = true; saveStats();
      window.AudioEngine.playSFX('ee_sea');
      triggerSeaRumble();
      secretBuffer = "";
    }
    
    // Title Check
    if (secretBuffer.endsWith("title")) {
      stats.eggsFound.title = true; saveStats();
      window.AudioEngine.playSFX('ee_title');
      triggerFloatingTitle();
      secretBuffer = "";
    }
    
    // Leak Check
    if (secretBuffer.endsWith("leak")) {
      stats.eggsFound.leak = true; saveStats();
      window.AudioEngine.playSFX('ee_leak');
      triggerDiscordLeak();
      secretBuffer = "";
    }
  };

  document.addEventListener("keydown", (e) => {
    if (e.key && e.key.length === 1) {
      secretBuffer += e.key.toLowerCase();
      checkEasterEggBuffer();
    }
  });

  // Support for mobile virtual keyboards in input fields (like Trading hub)
  document.addEventListener("input", (e) => {
    if (e.data && e.data.length === 1) {
      secretBuffer += e.data.toLowerCase();
      checkEasterEggBuffer();
    }
  });

  const triggerBounty = () => {
    if (document.querySelector('.bounty-terminal')) return;
    const terminal = document.createElement('div');
    terminal.className = 'bounty-terminal';
    document.body.appendChild(terminal);
    
    let step = 0;
    const messages = [
      "INITIALIZING BOUNTY HUNTER PROTOCOL...",
      "SCANNING SERVER FOR TARGET...",
      "TARGET LOCATED: 30M BOUNTY.",
      "TARGET LOST. CONNECTION SEVERED."
    ];
    
    terminal.innerText = "";
    const interval = setInterval(() => {
      if (step < messages.length) {
        terminal.innerText += (step > 0 ? "\n" : "") + messages[step];
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => terminal.remove(), 1000);
      }
    }, 800);
  };

  const triggerDodge = () => {
    if (window.dodgeActive) return;
    window.dodgeActive = true;
    
    const dodgeHandler = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (cx - e.clientX) * 0.15;
      const dy = (cy - e.clientY) * 0.15;
      document.body.style.transition = 'transform 0.1s ease-out';
      document.body.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    
    document.addEventListener('mousemove', dodgeHandler);
    
    setTimeout(() => {
      window.dodgeActive = false;
      document.removeEventListener('mousemove', dodgeHandler);
      document.body.style.transform = '';
      setTimeout(() => document.body.style.transition = '', 100);
    }, 10000);
  };

  const triggerSeaRumble = () => {
    document.body.classList.add('sea-rumble');
    setTimeout(() => document.body.classList.remove('sea-rumble'), 3000);
  };

  const triggerFloatingTitle = () => {
    if (document.querySelector('.floating-title')) return;
    const statusIndicator = document.querySelector('.status-indicator');
    if (!statusIndicator) return;
    
    const title = document.createElement('span');
    title.className = 'floating-title';
    const titles = ['[NOOB]', '[BOUNTY HUNTER]', '[PIRATE KING]', '[ADMIN]', '[SCRIPTER]'];
    title.innerText = titles[Math.floor(Math.random() * titles.length)];
    statusIndicator.appendChild(title);
    
    setTimeout(() => {
      title.remove();
    }, 10000);
  };

  const triggerDiscordLeak = () => {
    if (document.querySelector('.discord-leak')) return;
    const leak = document.createElement('div');
    leak.className = 'discord-leak';
    leak.innerHTML = `
      <div style="background:#5865F2; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;">A</div>
      <div class="discord-leak-content">
        <h4 style="color:#fff; font-size:0.9rem; margin-bottom:5px;">Admin</h4>
        <p style="font-size:0.85rem; margin:0;">Make sure you don't leak the new V4 methods bro</p>
      </div>
    `;
    document.body.appendChild(leak);
    
    setTimeout(() => leak.classList.add('show'), 100);
    
    const removeLeak = () => {
      leak.classList.remove('show');
      setTimeout(() => leak.remove(), 500);
    };
    
    leak.addEventListener('mouseenter', removeLeak);
    leak.addEventListener('click', removeLeak);
    setTimeout(() => {
      if (document.body.contains(leak)) removeLeak();
    }, 5000);
  };

  const triggerMatrixTheme = () => {
    if (document.getElementById('matrix-canvas')) return;
    
    stats.matrixActivations++;
    
    let unlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    const hasAllThemes = unlocked.includes('dice_hunter') && 
                         unlocked.includes('generous_spirit') && 
                         unlocked.includes('theme_master') && 
                         unlocked.includes('touch_lamp');
                         
    if (hasAllThemes) {
      stats.beyondAlerted = true;
    }
    
    saveStats();
    
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*'.split('');
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array.from({length: columns}).map(() => Math.random() * -100);

    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const themeColor = getComputedStyle(document.body).getPropertyValue('--lime-green').trim() || '#39ff14';
      ctx.fillStyle = themeColor;
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        if (drops[i] * fontSize > 0) {
          const text = letters[Math.floor(Math.random() * letters.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        }

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 33);

    setTimeout(() => {
      clearInterval(interval);
      canvas.style.transition = 'opacity 2s ease';
      canvas.style.opacity = '0';
      setTimeout(() => canvas.remove(), 2000);
    }, 30000);
  };

  // System Overload Easter Egg (Logo spam)
  const logo = document.querySelector('.logo');
  if (logo) {
    let clickCount = 0;
    let clickTimer;
    
    logo.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent instant navigation
      clickCount++;
      
      clearTimeout(clickTimer);
      
      if (clickCount >= 10) {
        clickCount = 0;
        stats.eggsFound.overload = true; saveStats();
        window.AudioEngine.playSFX('ee_overload');
        document.body.classList.add('system-overload');
        
        setTimeout(() => {
          document.body.classList.remove('system-overload');
          document.body.classList.add('system-blackout');
          
          setTimeout(() => {
            document.body.classList.remove('system-blackout');
          }, 2000);
          
        }, 1500);
      } else {
        // Normal navigation if they don't spam click
        clickTimer = setTimeout(() => {
          if (clickCount > 0 && clickCount < 10) {
            window.location.href = logo.getAttribute('href');
          }
          clickCount = 0;
        }, 300);
      }
    });
  }

  // 4. Achievements System
  const achievements = [
    { id: 'first_click', title: 'First Steps', desc: 'Click anywhere on the site for the first time.', icon: 'fa-mouse-pointer', check: () => stats.totalClicks >= 1 },
    { id: 'clicker', title: 'Clicker', desc: 'Click 100 times.', icon: 'fa-mouse', check: () => stats.totalClicks >= 100 },
    { id: 'rapid_clicker', title: 'Rapid Clicker', desc: 'Click 1,000 times.', icon: 'fa-bolt', check: () => stats.totalClicks >= 1000 },
    { id: 'dedicated', title: 'Dedicated', desc: 'Spend 5 minutes on the site.', icon: 'fa-clock', check: () => stats.timeSpentSeconds >= 300 },
    { id: 'still_here', title: 'Still Here?', desc: 'Stay for 1 total hour.', icon: 'fa-hourglass-end', check: () => stats.timeSpentSeconds >= 3600 },
    { id: 'theme_enthusiast', title: 'Theme Enthusiast', desc: 'Change the theme 3 times.', icon: 'fa-palette', check: () => stats.themeChanges >= 3 },
    { id: 'theme_master', title: 'Theme Master', desc: 'Roll theme 250 times. (Unlocks Purple Theme)', icon: 'fa-crown', check: () => stats.themeChanges >= 250 },
    { id: 'dice_hunter', title: 'Dice Hunter', desc: 'Find all 4 hidden dice. (Unlocks Red Theme)', icon: 'fa-search', check: () => Object.values(stats.diceFound).every(v => v) },
    { id: 'first_contact', title: 'First Contact', desc: 'Join the Discord server.', icon: 'fa-handshake', check: () => stats.discordClicked },
    { id: 'generous_spirit', title: 'Generous Spirit', desc: 'Tap the donation button. (Unlocks Gold Theme)', icon: 'fa-donate', check: () => stats.donated },
    { id: 'touch_grass', title: 'Touch Grass', desc: 'That\'s not what I meant. (Explore every page)', icon: 'fa-leaf', check: () => Object.keys(stats.visitedPages).length >= 11 },
    { id: 'touch_lamp', title: 'Touch Green Lamp', desc: 'Found the secret green lamp. (Unlocks Emerald Green)', icon: 'fa-lightbulb', check: () => stats.greenLampTouched },
    { id: 'system_failed', title: 'System failed', desc: 'Activated the Matrix 5 times. (Unlocks Crimson Blood)', icon: 'fa-bug', check: () => stats.matrixActivations >= 5 },
    { id: 'beyond_alerted', title: 'Lightbringer', desc: 'Activated Matrix with other primary themes unlocked. (Unlocks White)', icon: 'fa-ghost', check: () => stats.beyondAlerted },
    { id: 'infinite_curiosity', title: 'Infinite Curiosity', desc: 'Reach 25,000 total clicks.', icon: 'fa-infinity', check: () => stats.totalClicks >= 25000 },
    { id: 'cursor_wanderer', title: 'Cursor Wanderer', desc: 'Travel 1km with your cursor.', icon: 'fa-route', check: () => stats.cursorDistance >= 3779527 },
    { id: 'dice_devotee', title: 'Dice Devotee', desc: 'Roll the dice 2,500 times.', icon: 'fa-dice-d20', check: () => stats.themeChanges >= 2500 },
    { id: 'voidwalker', title: 'Voidwalker', desc: 'Complete the 3 hardcore grinds. (Unlocks Voidwalker Theme)', icon: 'fa-moon', check: () => stats.totalClicks >= 25000 && stats.themeChanges >= 2500 && stats.cursorDistance >= 3779527 }
  ];

  const checkAchievements = () => {
    let unlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    let newlyUnlocked = false;
    
    achievements.forEach(ach => {
      if (!unlocked.includes(ach.id) && ach.check()) {
        unlocked.push(ach.id);
        newlyUnlocked = true;
      }
    });

    if (newlyUnlocked) {
      localStorage.setItem('unlockedAchievements', JSON.stringify(unlocked));
    }
  };
  checkAchievements(); // initial check

  // 5. Modal Logic
  const modalOverlay = document.getElementById('mainModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.querySelector('.modal-close');

  const openModal = (title, htmlContent) => {
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    modalOverlay.classList.add('active');
  };

  window.openModal = openModal;
  window.closeModal = () => {
    modalOverlay.classList.remove('active');
  };

  modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('active');
  });

  // Format time utility
  const formatTime = (seconds) => {
    if (seconds === Infinity) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s}s`;
  };

  // Footer Dice Listeners
  document.querySelector('.footer-dice-left').addEventListener('click', function() {
    if (window.trackDiceFound) window.trackDiceFound('botL');
    window.AudioEngine.playSFX('dice');
    const icon = this.querySelector('i');
    icon.style.transform = 'rotate(720deg) scale(1.5)';
    setTimeout(() => icon.style.transform = '', 500);

    // Achievements Modal
    let unlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    let html = '';
    
    achievements.forEach(ach => {
      const isUnlocked = unlocked.includes(ach.id);
      html += `
        <div class="achievement-badge ${isUnlocked ? 'unlocked' : ''}">
          <i class="fas ${ach.icon}"></i>
          <div>
            <div class="ach-title">${ach.title}</div>
            <div class="ach-desc">${isUnlocked ? ach.desc : '???'}</div>
          </div>
        </div>
      `;
    });
    
    openModal('Achievements', html);
  });

  document.querySelector('.footer-dice-right').addEventListener('click', function() {
    if (window.trackDiceFound) window.trackDiceFound('botR');
    window.AudioEngine.playSFX('dice');
    const icon = this.querySelector('i');
    icon.style.transform = 'rotate(720deg) scale(1.5)';
    setTimeout(() => icon.style.transform = '', 500);

    // Stats Modal
    const avgSession = stats.totalVisits > 0 ? Math.floor(stats.timeSpentSeconds / stats.totalVisits) : 0;
    const distanceMeters = (stats.cursorDistance / 3779.527).toFixed(2); // approximate px to meters

    let unlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
    let eggsFoundCount = Object.values(stats.eggsFound).filter(Boolean).length;
    let unlockedThemesCount = 1 + unlocked.filter(id => ['dice_hunter', 'generous_spirit', 'theme_master', 'touch_lamp', 'system_failed', 'beyond_alerted', 'voidwalker'].includes(id)).length + (stats.balancedUnlocked ? 1 : 0) + 1; // +1 for white, +1 for default, +1 for voidwalker

    let html = `
      <div style="text-align:left;">
        <div class="stat-row"><span>Total Visits:</span><span class="stat-val">${stats.totalVisits}</span></div>
        <div class="stat-row"><span>Total Clicks:</span><span class="stat-val">${stats.totalClicks}</span></div>
        <div class="stat-row"><span>Total Time:</span><span class="stat-val">${formatTime(stats.timeSpentSeconds)}</span></div>
        <div class="stat-row"><span>Average Session:</span><span class="stat-val">${formatTime(avgSession)}</span></div>
        <div class="stat-row"><span>Longest Session:</span><span class="stat-val">${formatTime(stats.longestSession)}</span></div>
        <div class="stat-row"><span>Shortest Session:</span><span class="stat-val">${formatTime(stats.shortestSession)}</span></div>
        <div class="stat-row"><span>Cursor Travel:</span><span class="stat-val">${distanceMeters} meters</span></div>
        
        <h3 style="margin: 20px 0 10px; color: var(--lime-green);">Milestones</h3>
        <div class="stat-row"><span>Easter Eggs Found:</span><span class="stat-val">${eggsFoundCount} / 8</span></div>
        <div class="stat-row"><span>Themes Unlocked:</span><span class="stat-val">${unlockedThemesCount} / 10</span></div>
        <div class="stat-row"><span>Achievements:</span><span class="stat-val">${unlocked.length} / ${achievements.length}</span></div>
        <div class="stat-row"><span>Hidden Systems Activated:</span><span class="stat-val">${stats.matrixActivations}</span></div>

        <h3 style="margin: 20px 0 10px; color: var(--lime-green);">Theme Time Breakdown</h3>
        <div class="stat-row"><span>Green Theme:</span><span class="stat-val">${formatTime(stats.themeTime['default'] || 0)}</span></div>
        <div class="stat-row"><span>Blue Theme:</span><span class="stat-val">${formatTime(stats.themeTime['blue-theme'] || 0)}</span></div>
        <div class="stat-row"><span>White Theme:</span><span class="stat-val">${formatTime(stats.themeTime['white-theme'] || 0)}</span></div>
    `;

    if (unlocked.includes('dice_hunter')) {
      html += `<div class="stat-row"><span>Red Theme:</span><span class="stat-val">${formatTime(stats.themeTime['red-theme'] || 0)}</span></div>`;
    }
    if (unlocked.includes('generous_spirit')) {
      html += `<div class="stat-row"><span>Gold Theme:</span><span class="stat-val">${formatTime(stats.themeTime['gold-theme'] || 0)}</span></div>`;
    }
    if (unlocked.includes('theme_master')) {
      html += `<div class="stat-row"><span>Purple Theme:</span><span class="stat-val">${formatTime(stats.themeTime['purple-theme'] || 0)}</span></div>`;
    }
    if (unlocked.includes('touch_lamp')) {
      html += `<div class="stat-row"><span>Emerald Theme:</span><span class="stat-val">${formatTime(stats.themeTime['emerald-theme'] || 0)}</span></div>`;
    }
    if (unlocked.includes('system_failed')) {
      html += `<div class="stat-row"><span>Crimson Theme:</span><span class="stat-val">${formatTime(stats.themeTime['crimson-theme'] || 0)}</span></div>`;
    }
    if (unlocked.includes('voidwalker')) {
      html += `<div class="stat-row"><span>Voidwalker Theme:</span><span class="stat-val">${formatTime(stats.themeTime['voidwalker-theme'] || 0)}</span></div>`;
    }
    if (stats.balancedUnlocked) {
      html += `<div class="stat-row"><span>Balanced Theme:</span><span class="stat-val">${formatTime(stats.themeTime['balanced-theme'] || 0)}</span></div>`;
    }

    html += `</div>`;
    
    openModal('Detailed Statistics', html);
  });

  // --- Sign In & Verification Challenge Logic ---
  const injectNavbarSignIn = () => {
    const navLinksList = document.querySelector('.nav-links');
    if (!navLinksList) return;
    
    // Remove existing sign-in elements if any
    const existingItems = navLinksList.querySelectorAll('.signin-item');
    existingItems.forEach(item => item.remove());
    
    const savedUser = localStorage.getItem('alert_username');
    const sessionData = localStorage.getItem('alert_user_session');
    
    if (savedUser && sessionData) {
      const user = JSON.parse(sessionData);
      const providerIcon = user.provider === 'google' ? 'fab fa-google' :
                           user.provider === 'discord' ? 'fab fa-discord' : 'fas fa-gamepad';
      
      const providerColor = user.provider === 'google' ? '#ea4335' :
                            user.provider === 'discord' ? '#5865F2' : '#ff3e3e';
      
      navLinksList.insertAdjacentHTML('beforeend', `
        <li class="signin-item" style="display: flex; align-items: center;">
          <a href="#" id="nav-user-btn" style="color: var(--lime-green); font-weight: bold; display: flex; align-items: center; gap: 8px;">
            <img src="${user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'}" style="width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid var(--lime-green); object-fit: cover;">
            <i class="${providerIcon}" style="color: ${providerColor}; font-size: 0.85rem;"></i> ${user.username}
          </a>
        </li>
        <li class="signin-item"><a href="#" id="nav-logout-btn" title="Log Out" style="opacity: 0.7; padding-left: 5px;"><i class="fas fa-sign-out-alt"></i></a></li>
      `);
      
      const userBtn = document.getElementById('nav-user-btn');
      if (userBtn) {
        userBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.AudioEngine.playSFX('click');
          
          const loginDate = user.loginTime ? new Date(user.loginTime).toLocaleString() : 'Just now';
          openModal('User Profile', `
            <div style="text-align: center; font-family: 'Orbitron', sans-serif; padding: 10px;">
              <img src="${user.avatar}" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid var(--lime-green); margin-bottom: 15px; box-shadow: 0 0 15px rgba(var(--lime-rgb),0.4);">
              <h3 style="color: var(--lime-green); margin-bottom: 10px;">${user.username}</h3>
              <p style="margin: 8px 0; color: var(--text-muted);"><i class="${providerIcon}" style="color: ${providerColor}; margin-right: 5px;"></i> Signed in via ${user.provider.toUpperCase()}</p>
              ${user.email ? `<p style="margin: 8px 0; font-size: 0.9rem; color: var(--text-muted);">${user.email}</p>` : ''}
              <div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 15px; padding-top: 15px; text-align: left;">
                <p style="margin: 6px 0; font-size: 0.9rem;"><strong>Session Started:</strong> ${loginDate}</p>
                <p style="margin: 6px 0; font-size: 0.9rem;"><strong>Account Status:</strong> Verified Human</p>
              </div>
              <button onclick="window.closeModal()" class="cta-btn" style="width: 100%; border: none; margin-top: 20px;">Close Profile</button>
            </div>
          `);
        });
      }
      
      const logoutBtn = document.getElementById('nav-logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.AudioEngine.playSFX('click');
          localStorage.removeItem('alert_username');
          localStorage.removeItem('alert_user_session');
          location.reload();
        });
      }
    } else {
      navLinksList.insertAdjacentHTML('beforeend', `
        <li class="signin-item"><a href="#" id="nav-signin-btn"><i class="fas fa-sign-in-alt"></i> Sign In</a></li>
      `);
      
      const signinBtn = document.getElementById('nav-signin-btn');
      if (signinBtn) {
        signinBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.AudioEngine.playSFX('click');
          openModal('Sign In Options', `
            <div style="text-align: center; font-family: 'Orbitron', sans-serif;">
              <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px;">Sign in securely to Alert Services to verify you are human and unlock trading.</p>
              
              <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 15px;">
                <button onclick="triggerSocialLogin('google')" class="cta-btn" style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; background: #ea4335; color: #fff; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 0.95rem; font-family: 'Orbitron', sans-serif;">
                  <i class="fab fa-google"></i> Sign In with Google
                </button>
                <button onclick="triggerSocialLogin('discord')" class="cta-btn" style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; background: #5865F2; color: #fff; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 0.95rem; font-family: 'Orbitron', sans-serif;">
                  <i class="fab fa-discord"></i> Sign In with Discord
                </button>
                <button onclick="triggerSocialLogin('roblox')" class="cta-btn" style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; background: #232527; border: 1px solid #ff3e3e; color: #fff; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 0.95rem; font-family: 'Orbitron', sans-serif;">
                  <i class="fas fa-gamepad" style="color: #ff3e3e;"></i> Sign In with Roblox
                </button>
              </div>
              
              <div style="margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                <a href="#" onclick="showDeveloperBypass(event)" style="color: var(--lime-green); text-decoration: none; font-size: 0.85rem; font-weight: bold; display: inline-flex; align-items: center; gap: 6px;">
                  <i class="fas fa-tools"></i> Running locally? Quick Developer Bypass
                </a>
              </div>
            </div>
          `);
        });
      }
    }
  };

  injectNavbarSignIn();

  // --- Real Social Account Logins ---
  const GOOGLE_CLIENT_ID = '1027179042976-a67t7m3j1gq7cl1t8k0v5ep6e74n647e.apps.googleusercontent.com';
  const DISCORD_CLIENT_ID = '1244342728250265692';

  // Listeners and redirects for social login
  window.triggerSocialLogin = (provider) => {
    window.AudioEngine.playSFX('click');
    const redirectUri = window.location.origin + window.location.pathname;
    localStorage.setItem('alert_oauth_provider', provider);

    if (provider === 'google') {
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email')}&state=google`;
      window.location.href = googleAuthUrl;
    } else if (provider === 'discord') {
      const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=identify&state=discord`;
      window.location.href = discordAuthUrl;
    } else if (provider === 'roblox') {
      showRobloxVerificationModal();
    }
  };

  // Google OAuth parsing
  const fetchGoogleProfile = (token) => {
    fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch Google profile');
        return res.json();
      })
      .then(data => {
        const user = {
          provider: 'google',
          username: data.name || data.given_name || 'Google User',
          email: data.email,
          avatar: data.picture || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(data.name || 'google')}`,
          loginTime: Date.now()
        };
        localStorage.setItem('alert_username', user.username);
        localStorage.setItem('alert_user_session', JSON.stringify(user));
        location.reload();
      })
      .catch(err => {
        console.error(err);
        alert('Google Sign-In failed: ' + err.message);
      });
  };

  // Discord OAuth parsing with CORS proxy chain
  const fetchDiscordProfile = (token) => {
    const proxies = [
      (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
      (url) => url
    ];

    const tryFetch = (proxyIdx) => {
      if (proxyIdx >= proxies.length) {
        alert('Discord Profile verification failed due to CORS issues. Please try Developer Bypass option.');
        return;
      }

      const targetUrl = 'https://discord.com/api/users/@me';
      const proxyUrl = proxies[proxyIdx](targetUrl);

      fetch(proxyUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('CORS Proxy failed with status ' + res.status);
        return res.json();
      })
      .then(data => {
        const username = data.username;
        const avatarUrl = data.avatar 
          ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
          : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;

        const user = {
          provider: 'discord',
          username: username,
          avatar: avatarUrl,
          loginTime: Date.now()
        };
        localStorage.setItem('alert_username', user.username);
        localStorage.setItem('alert_user_session', JSON.stringify(user));
        location.reload();
      })
      .catch(err => {
        console.warn(`Discord Proxy ${proxyIdx} failed:`, err);
        tryFetch(proxyIdx + 1);
      });
    };

    tryFetch(0);
  };

  // Captures OAuth tokens from URL hash on load
  const handleOAuthCallback = () => {
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');

    if (accessToken) {
      // Clean hash parameters from URL
      window.history.replaceState(null, null, window.location.pathname + window.location.search);
      
      const provider = localStorage.getItem('alert_oauth_provider');
      if (provider === 'google' || hash.includes('state=google')) {
        fetchGoogleProfile(accessToken);
      } else if (provider === 'discord' || hash.includes('state=discord')) {
        fetchDiscordProfile(accessToken);
      }
    }
  };

  handleOAuthCallback();

  // --- Real Roblox Account Verification Flow ---
  let currentRobloxUser = null;
  let currentVerificationCode = '';

  const showRobloxVerificationModal = () => {
    openModal('Roblox Account Verification', `
      <div style="font-family: 'Orbitron', sans-serif; text-align: center; padding: 10px;">
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 15px;">Verify your Roblox username in real-time to prevent bots and fake trading.</p>
        
        <div id="roblox-step-1" style="display: block;">
          <input type="text" id="roblox-username-input" class="input-box" placeholder="Roblox Username" style="width: 85%; padding: 10px; margin-bottom: 15px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; color: #fff; font-family: 'Orbitron', sans-serif;">
          <button onclick="handleRobloxUsernameSubmit()" class="cta-btn" style="width: 90%; padding: 12px; margin-top: 5px;">Find Account</button>
        </div>
        
        <div id="roblox-step-2" style="display: none; text-align: left; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-top: 10px;">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
            <img id="roblox-avatar-preview" src="" style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid var(--lime-green); object-fit: cover;">
            <div>
              <h4 id="roblox-display-name" style="margin: 0; color: #fff;">Display Name</h4>
              <p id="roblox-username-preview" style="margin: 2px 0 0 0; font-size: 0.8rem; color: var(--text-muted);">@username</p>
            </div>
          </div>
          
          <p style="font-size: 0.85rem; margin-bottom: 10px; color: #fff; line-height: 1.4;">To verify ownership, copy the verification code below and paste it into your Roblox **About** description:</p>
          
          <div style="display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px; margin-bottom: 15px; border: 1px dashed var(--lime-green);">
            <code id="roblox-verification-code" style="font-weight: bold; color: var(--lime-green); font-size: 1.1rem; flex: 1; text-align: center; letter-spacing: 2px;">ALERT-1234</code>
            <button onclick="copyRobloxCode()" class="cta-btn" style="padding: 6px 12px; font-size: 0.75rem; border: none; margin: 0;">Copy</button>
          </div>
          
          <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 15px;">(You can delete this code from your profile description as soon as verification is complete!)</p>
          
          <div style="display: flex; gap: 10px;">
            <button onclick="verifyRobloxAccount()" class="cta-btn" style="flex: 1; padding: 12px; border: none; margin: 0;">Verify & Sign In</button>
            <button onclick="showStep(1)" class="cta-btn" style="padding: 12px; background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); margin: 0;">Back</button>
          </div>
        </div>
        
        <div id="roblox-loading" style="display: none; padding: 20px;">
          <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--lime-green); margin-bottom: 10px;"></i>
          <p id="roblox-loading-text" style="font-size: 0.9rem; color: var(--text-muted);">Fetching Roblox profile...</p>
        </div>
      </div>
    `);
  };

  window.showStep = (step) => {
    document.getElementById('roblox-step-1').style.display = step === 1 ? 'block' : 'none';
    document.getElementById('roblox-step-2').style.display = step === 2 ? 'block' : 'none';
    document.getElementById('roblox-loading').style.display = 'none';
  };

  window.copyRobloxCode = () => {
    const code = document.getElementById('roblox-verification-code').innerText;
    navigator.clipboard.writeText(code);
    alert('Verification code copied to clipboard!');
  };

  window.handleRobloxUsernameSubmit = () => {
    const username = document.getElementById('roblox-username-input').value.trim();
    if (!username) {
      alert('Please enter your Roblox username!');
      return;
    }

    document.getElementById('roblox-step-1').style.display = 'none';
    document.getElementById('roblox-loading').style.display = 'block';
    document.getElementById('roblox-loading-text').innerText = 'Finding Roblox account...';

    const proxies = [
      (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`
    ];

    const trySearch = (proxyIdx) => {
      if (proxyIdx >= proxies.length) {
        document.getElementById('roblox-loading').style.display = 'none';
        document.getElementById('roblox-step-1').style.display = 'block';
        const verifyBypass = confirm('Roblox verification service is temporarily rate-limited. Would you like to use simulated Developer Sign-In instead?');
        if (verifyBypass) {
          const user = {
            provider: 'roblox',
            username: username,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
            userId: '123456',
            loginTime: Date.now()
          };
          localStorage.setItem('alert_username', user.username);
          localStorage.setItem('alert_user_session', JSON.stringify(user));
          location.reload();
        }
        return;
      }

      const searchUrl = `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=10`;
      const proxyUrl = proxies[proxyIdx](searchUrl);

      fetch(proxyUrl)
        .then(res => {
          if (!res.ok) throw new Error('Response status ' + res.status);
          return res.json();
        })
        .then(data => {
          if (!data.data || data.data.length === 0) {
            throw new Error('Roblox user not found. Make sure the name is correct.');
          }

          // Exact matching case-insensitive
          const exactUser = data.data.find(u => u.name.toLowerCase() === username.toLowerCase()) || data.data[0];

          currentRobloxUser = exactUser;
          currentVerificationCode = 'ALERT-' + Math.floor(1000 + Math.random() * 9000);

          // Populate step 2
          document.getElementById('roblox-avatar-preview').src = `https://www.roblox.com/headshot-thumbnail/image?userId=${exactUser.id}&width=150&height=150&format=png`;
          document.getElementById('roblox-display-name').innerText = exactUser.displayName;
          document.getElementById('roblox-username-preview').innerText = '@' + exactUser.name;
          document.getElementById('roblox-verification-code').innerText = currentVerificationCode;

          document.getElementById('roblox-loading').style.display = 'none';
          document.getElementById('roblox-step-2').style.display = 'block';
        })
        .catch(err => {
          console.warn(`Roblox Search Proxy ${proxyIdx} failed:`, err);
          trySearch(proxyIdx + 1);
        });
    };

    trySearch(0);
  };

  window.verifyRobloxAccount = () => {
    if (!currentRobloxUser) return;

    document.getElementById('roblox-step-2').style.display = 'none';
    document.getElementById('roblox-loading').style.display = 'block';
    document.getElementById('roblox-loading-text').innerText = 'Checking Roblox profile description...';

    const proxies = [
      (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`
    ];

    const tryVerify = (proxyIdx) => {
      if (proxyIdx >= proxies.length) {
        document.getElementById('roblox-loading').style.display = 'none';
        document.getElementById('roblox-step-2').style.display = 'block';
        const verifyBypass = confirm('Verification proxy failed. Would you like to force verify and bypass the profile check?');
        if (verifyBypass) {
          const user = {
            provider: 'roblox',
            username: currentRobloxUser.name,
            avatar: `https://www.roblox.com/headshot-thumbnail/image?userId=${currentRobloxUser.id}&width=150&height=150&format=png`,
            userId: currentRobloxUser.id,
            loginTime: Date.now()
          };
          localStorage.setItem('alert_username', user.username);
          localStorage.setItem('alert_user_session', JSON.stringify(user));
          location.reload();
        }
        return;
      }

      const profileUrl = `https://users.roblox.com/v1/users/${currentRobloxUser.id}`;
      const proxyUrl = proxies[proxyIdx](profileUrl);

      fetch(proxyUrl)
        .then(res => {
          if (!res.ok) throw new Error('Response status ' + res.status);
          return res.json();
        })
        .then(data => {
          const desc = data.description || '';
          if (desc.includes(currentVerificationCode)) {
            // Success Verification
            const user = {
              provider: 'roblox',
              username: currentRobloxUser.name,
              avatar: `https://www.roblox.com/headshot-thumbnail/image?userId=${currentRobloxUser.id}&width=150&height=150&format=png`,
              userId: currentRobloxUser.id,
              loginTime: Date.now()
            };
            localStorage.setItem('alert_username', user.username);
            localStorage.setItem('alert_user_session', JSON.stringify(user));
            location.reload();
          } else {
            alert(`Verification code not found in profile! Please ensure you added "${currentVerificationCode}" to your description and try again.`);
            document.getElementById('roblox-loading').style.display = 'none';
            document.getElementById('roblox-step-2').style.display = 'block';
          }
        })
        .catch(err => {
          console.warn(`Roblox Verify Proxy ${proxyIdx} failed:`, err);
          tryVerify(proxyIdx + 1);
        });
    };

    tryVerify(0);
  };

  // --- Developer Bypass Mode ---
  window.showDeveloperBypass = (e) => {
    if (e) e.preventDefault();
    openModal('Developer Sign In Bypass', `
      <div style="font-family: 'Orbitron', sans-serif; text-align: center; padding: 10px;">
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">Use this bypass to simulate a successful sign-in when testing locally without OAuth redirects.</p>
        
        <input type="text" id="bypass-username" class="input-box" placeholder="Custom Username" style="width: 85%; padding: 10px; margin-bottom: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; color: #fff; font-family: 'Orbitron', sans-serif;">
        
        <select id="bypass-provider" style="width: 90%; padding: 10px; margin-bottom: 20px; background: #121212; border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; color: #fff; font-family: 'Orbitron', sans-serif; height: 42px;">
          <option value="google">Google</option>
          <option value="discord">Discord</option>
          <option value="roblox">Roblox</option>
        </select>
        
        <button onclick="handleBypassSubmit()" class="cta-btn" style="width: 90%; padding: 12px; border: none;">Sign In (Simulated)</button>
      </div>
    `);
  };

  window.handleBypassSubmit = () => {
    const username = document.getElementById('bypass-username').value.trim();
    const provider = document.getElementById('bypass-provider').value;
    if (!username) {
      alert('Please enter a username!');
      return;
    }

    let avatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(username)}`;
    if (provider === 'discord') {
      avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;
    } else if (provider === 'roblox') {
      avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`;
    }

    const user = {
      provider: provider,
      username: username,
      avatar: avatar,
      loginTime: Date.now()
    };
    localStorage.setItem('alert_username', user.username);
    localStorage.setItem('alert_user_session', JSON.stringify(user));
    window.closeModal();
    location.reload();
  };
});
