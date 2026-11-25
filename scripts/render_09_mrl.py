import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1920, 1080
img = Image.new("RGB", (W, H), "#f8fafc")
draw = ImageDraw.Draw(img)

# 1. Blueprint Grid Background
for x in range(0, W, 40):
    color = "#e2e8f0" if x % 160 == 0 else "#f1f5f9"
    draw.line([(x, 0), (x, H)], fill=color, width=2 if x % 160 == 0 else 1)
for y in range(0, H, 40):
    color = "#e2e8f0" if y % 160 == 0 else "#f1f5f9"
    draw.line([(0, y), (W, y)], fill=color, width=2 if y % 160 == 0 else 1)

# Load system fonts on macOS (fallback to default)
def load_font(size, bold=False):
    candidates = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFNSDisplay.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf"
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size, index=1 if bold and path.endswith('.ttc') else 0)
            except Exception:
                try:
                    return ImageFont.truetype(path, size)
                except Exception:
                    pass
    return ImageFont.load_default()

f_super = load_font(22, bold=True)
f_title = load_font(46, bold=True)
f_sub = load_font(24, bold=False)
f_card_t = load_font(26, bold=True)
f_card_b = load_font(20, bold=False)
f_badge = load_font(20, bold=True)
f_seal = load_font(24, bold=True)

navy = "#0f172a"
emerald = "#059669"
emerald_bg = "#ecfdf5"
emerald_bd = "#6ee7b7"
blue = "#0284c7"
blue_bg = "#f0f9ff"
blue_bd = "#7dd3fc"
amber = "#d97706"
amber_bg = "#fffbeb"
amber_bd = "#fcd34d"
purple = "#4f46e5"
purple_bg = "#eef2ff"
purple_bd = "#a5b4fc"
slate = "#475569"

# 2. Header Banner
draw.rounded_rectangle([60, 48, W - 60, 210], radius=16, fill="#ffffff", outline="#cbd5e1", width=2)
draw.rectangle([60, 48, 76, 210], fill=emerald)
draw.text((105, 70), "NESFIC-I-06  |  CHAI-RAKSHAK REGULATORY & EXPORT COMPLIANCE FRAMEWORK", font=f_super, fill=emerald)
draw.text((105, 102), "CRYPTOGRAPHIC TRA TOCKLAI & EXPORT MRL COMPLIANCE", font=f_title, fill=navy)
draw.text((105, 160), "Tamper-Proof Traceability for Assam Orthodox & CTC Export Tea Consignments  ·  TeaTech Labs", font=f_sub, fill=slate)

# 3. Four Interconnected Pillars (Cards)
pillars = [
    {
        "num": "01",
        "title": "128-Bit AES Telemetry\nEncryption",
        "color": blue,
        "bg": blue_bg,
        "bd": blue_bd,
        "bullets": [
            "• AppSKey & NwkSKey LoRaWAN",
            "• AES-CCM Authenticated BLE",
            "• Zero Plaintext Field Packets",
            "• Hardware-Backed Key Storage"
        ]
    },
    {
        "num": "02",
        "title": "SHA-256 Immutable\nSpray Ledger",
        "color": purple,
        "bg": purple_bg,
        "bd": purple_bd,
        "bullets": [
            "• Tamper-Proof Batch Hashing",
            "• Links Operator + Swath + Dose",
            "• Timestamped Tanker Refills",
            "• Auction & Buyer Audit Trail"
        ]
    },
    {
        "num": "03",
        "title": "Automated PHI\nPlucking Lockout",
        "color": amber,
        "bg": amber_bg,
        "bd": amber_bd,
        "bullets": [
            "• TRA Tocklai PHI Rules Engine",
            "• 7–14 Day Section Lockout",
            "• Estate ERP Schedule Sync",
            "• Prevents Premature Plucking"
        ]
    },
    {
        "num": "04",
        "title": "FSSAI & EU MRL\nExport Certification",
        "color": emerald,
        "bg": emerald_bg,
        "bd": emerald_bd,
        "bullets": [
            "• FSSAI Order 2024 Compliant",
            "• EU Reg (EC) No 396/2005",
            "• CIB&RC Label Verification",
            "• 1-Click PDF Audit Certificate"
        ]
    }
]

card_w = 415
card_h = 460
gap = 38
start_x = 70
top_y = 265

for idx, p in enumerate(pillars):
    cx = start_x + idx * (card_w + gap)
    cy = top_y
    # Card shadow & body
    draw.rounded_rectangle([cx+4, cy+6, cx+card_w+4, cy+card_h+6], radius=18, fill="#e2e8f0")
    draw.rounded_rectangle([cx, cy, cx+card_w, cy+card_h], radius=18, fill="#ffffff", outline=p["bd"], width=3)
    # Top accent bar
    draw.rounded_rectangle([cx, cy, cx+card_w, cy+90], radius=18, fill=p["bg"])
    draw.rectangle([cx, cy+70, cx+card_w, cy+90], fill=p["bg"])
    draw.line([(cx, cy+90), (cx+card_w, cy+90)], fill=p["bd"], width=2)
    # Badge number
    draw.rounded_rectangle([cx+22, cy+22, cx+74, cy+68], radius=10, fill=p["color"])
    draw.text((cx+34, cy+31), p["num"], font=f_card_t, fill="#ffffff")
    # Title
    draw.multiline_text((cx+92, cy+18), p["title"], font=f_card_t, fill=navy, spacing=4)
    # Bullets
    by = cy + 125
    for b in p["bullets"]:
        draw.text((cx+24, by), b, font=f_card_b, fill="#1e293b")
        by += 52
    # Bottom status tag
    draw.rounded_rectangle([cx+24, cy+card_h-64, cx+card_w-24, cy+card_h-22], radius=10, fill=p["bg"], outline=p["bd"], width=1)
    draw.text((cx+42, cy+card_h-54), "VERIFIED COMPLIANCE LAYER", font=f_badge, fill=p["color"])

    # Connecting arrow to next card
    if idx < 3:
        ax1 = cx + card_w + 4
        ax2 = cx + card_w + gap - 4
        ay = cy + card_h // 2
        draw.line([(ax1, ay), (ax2, ay)], fill=emerald, width=4)
        draw.polygon([(ax2, ay), (ax2-12, ay-8), (ax2-12, ay+8)], fill=emerald)

# 4. Bottom Verification Pipeline & Gold Seal Banner
bot_y = 775
draw.rounded_rectangle([60, bot_y, W - 60, 1020], radius=18, fill="#ffffff", outline="#cbd5e1", width=2)
draw.rounded_rectangle([85, bot_y+25, 420, bot_y+220], radius=14, fill="#fefce8", outline="#eab308", width=3)
draw.text((112, bot_y+48), "TEA BOARD & TRA", font=f_seal, fill="#854d0e")
draw.text((112, bot_y+82), "CERTIFIED EXPORT", font=f_seal, fill="#a16207")
draw.text((112, bot_y+116), "MRL SAFE SEAL", font=f_seal, fill="#059669")
draw.text((112, bot_y+162), "SHA-256 Verified · Jorhat", font=f_badge, fill="#475569")

# Pipeline metrics on the right
metrics = [
    ("0 MRL Breaches", "100% EU/FSSAI Adherence", emerald),
    ("400–450 L/ha", "TRA Tocklai Standard", blue),
    ("7–14 Days", "Automated PHI Lockout", amber),
    ("172g Retrofit", "Zero Operator Burden", purple)
]
mx = 460
for label, sub, col in metrics:
    draw.rounded_rectangle([mx, bot_y+35, mx+320, bot_y+210], radius=14, fill="#f8fafc", outline="#e2e8f0", width=2)
    draw.rectangle([mx, bot_y+35, mx+320, bot_y+45], fill=col)
    draw.text((mx+24, bot_y+75), label, font=load_font(32, bold=True), fill=navy)
    draw.text((mx+24, bot_y+130), sub, font=f_badge, fill=slate)
    mx += 348

out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "assets", "09_mrl_audit_compliance.jpg")
img.save(out_path, "JPEG", quality=95)
print("Saved:", out_path)
