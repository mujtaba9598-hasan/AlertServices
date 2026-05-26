css = """

/* Permanent Fruit Styles */
.perm-glow {
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5) !important;
  border: 1px solid rgba(255, 215, 0, 0.8) !important;
  background: radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(20,20,20,1) 100%) !important;
  position: relative;
}

.perm-label {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #ffd700, #ffa500);
  color: #000;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.5);
  pointer-events: none;
  z-index: 10;
}
"""

with open("styles.css", "a", encoding="utf-8") as f:
    f.write(css)

print("CSS successfully appended!")
