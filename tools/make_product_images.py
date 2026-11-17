"""Draws the product illustrations in images/ (SVG, 400x300).

Run:  python3 tools/make_product_images.py
Each product in products.js points to one of these files through its "image" field.
They are original drawings, not manufacturer photos; replace them with your own
licensed photos on the admin page whenever you have them.
"""
import math
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'images')
W, H = 400, 300


def svg(body, defs=''):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">'
            f'<defs>{defs}'
            '<radialGradient id="sh"><stop offset="0" stop-color="#0f172a" stop-opacity=".28"/>'
            '<stop offset="1" stop-color="#0f172a" stop-opacity="0"/></radialGradient>'
            f'</defs>{body}</svg>')


def lin(id_, c1, c2, x2=0, y2=1):
    return (f'<linearGradient id="{id_}" x1="0" y1="0" x2="{x2}" y2="{y2}">'
            f'<stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient>')


def shadow(cx, cy, rx, ry=10):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#sh)"/>'


def wallpaper(x, y, w, h, c1, c2, rx=3):
    """A screen with a soft abstract wallpaper."""
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="url(#wp)"/>'
            f'<clipPath id="wpc"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}"/></clipPath>'
            f'<g clip-path="url(#wpc)" fill="#fff">'
            f'<circle cx="{x + w * .78}" cy="{y + h * .2}" r="{h * .55}" opacity=".16"/>'
            f'<circle cx="{x + w * .15}" cy="{y + h * 1.05}" r="{h * .6}" opacity=".12"/>'
            f'<path d="M{x} {y + h * .72} C{x + w * .3} {y + h * .45} {x + w * .6} {y + h * .95} {x + w} {y + h * .6} V{y + h} H{x}Z" opacity=".18"/>'
            f'</g>'
            f'<path d="M{x} {y} h{w * .55} L{x} {y + h * .9}Z" fill="#fff" opacity=".07"/>'), lin('wp', c1, c2, 1, 1)


# ---------- Laptops ----------
def laptop(body, wp1, wp2, style='thin', accent=None):
    defs = lin('lid', body[0], body[1])
    screen, wpdefs = wallpaper(83, 42, 234, 146, wp1, wp2, 2)
    thick = 14 if style == 'gaming' else 9
    g = shadow(200, 236, 190, 12)
    g += f'<rect x="70" y="30" width="260" height="170" rx="12" fill="#0b0f19"/>'
    g += f'<rect x="72" y="32" width="256" height="166" rx="10" fill="#111827"/>'
    g += screen
    if style == 'thin':
        g += '<rect x="186" y="33" width="28" height="5" rx="2.5" fill="#0b0f19"/>'
    g += f'<path d="M24 200 H376 L388 {200 + thick} Q389 {205 + thick} 382 {206 + thick} H18 Q11 {205 + thick} 12 {200 + thick}Z" fill="url(#lid)"/>'
    g += f'<path d="M24 200 H376 L378 203 H22Z" fill="#fff" opacity=".45"/>'
    g += f'<rect x="168" y="200" width="64" height="5" rx="2.5" fill="#000" opacity=".18"/>'
    if style == 'gaming':
        g += f'<rect x="40" y="{204 + thick - 6}" width="320" height="3" rx="1.5" fill="url(#rgb)"/>'
        for i in range(10):
            g += f'<rect x="{58 + i * 9}" y="207" width="5" height="4" rx="1" fill="#000" opacity=".35"/>'
            g += f'<rect x="{258 + i * 9}" y="207" width="5" height="4" rx="1" fill="#000" opacity=".35"/>'
        defs += ('<linearGradient id="rgb"><stop offset="0" stop-color="#f43f5e"/><stop offset=".33" stop-color="#a855f7"/>'
                 '<stop offset=".66" stop-color="#22d3ee"/><stop offset="1" stop-color="#22c55e"/></linearGradient>')
    if style == 'thinkpad':
        g += '<circle cx="356" cy="206" r="3" fill="#ef4444"/>'
    if accent:
        g += f'<rect x="72" y="196" width="256" height="2" fill="{accent}" opacity=".9"/>'
    return svg(g, defs + wpdefs)


def convertible(body, wp1, wp2):
    """2-in-1 shown in tent mode, plus a pen."""
    defs = lin('lid', body[0], body[1])
    screen, wpdefs = wallpaper(118, 62, 170, 118, wp1, wp2, 2)
    g = shadow(205, 242, 170, 12)
    g += '<path d="M100 236 L196 52 L214 52 L322 236Z" fill="url(#lid)"/>'
    g += '<path d="M108 50 H300 Q306 50 306 56 V188 Q306 194 300 194 H108 Q102 194 102 188 V56 Q102 50 108 50Z" fill="#0b0f19"/>'
    g += screen
    g += '<path d="M102 194 H306 L322 236 H86Z" fill="url(#lid)"/><path d="M102 194 H306 L308 198 H100Z" fill="#fff" opacity=".35"/>'
    g += '<g transform="rotate(-18 330 150)"><rect x="324" y="80" width="9" height="130" rx="4.5" fill="#cbd5e1"/><path d="M324 210 L328.5 226 L333 210Z" fill="#64748b"/></g>'
    return svg(g, defs + wpdefs)


# ---------- Desktops ----------
def all_in_one(color, wp1, wp2):
    defs = lin('chin', color[0], color[1]) + lin('stand', color[0], color[1], 1, 0)
    screen, wpdefs = wallpaper(86, 28, 228, 140, wp1, wp2, 2)
    g = shadow(200, 262, 90, 9)
    g += '<path d="M168 196 H232 L246 258 H154Z" fill="url(#stand)"/>'
    g += '<rect x="150" y="254" width="100" height="6" rx="3" fill="url(#chin)"/>'
    g += '<rect x="76" y="18" width="248" height="190" rx="10" fill="url(#chin)"/>'
    g += '<rect x="78" y="20" width="244" height="156" rx="8" fill="#f8fafc"/>'
    g += '<rect x="82" y="24" width="236" height="148" rx="4" fill="#0b0f19"/>'
    g += screen
    return svg(g, defs + wpdefs)


def mini_pc(top, side):
    defs = lin('top', top[0], top[1], 1, 1) + lin('front', side[0], side[1])
    g = shadow(200, 222, 150, 14)
    g += '<path d="M70 150 L200 112 L330 150 L200 188Z" fill="url(#top)"/>'
    g += '<path d="M70 150 L200 188 V218 L70 180Z" fill="url(#front)"/>'
    g += '<path d="M200 188 L330 150 V180 L200 218Z" fill="url(#front)" opacity=".8"/>'
    g += '<path d="M70 150 L200 112 L330 150" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>'
    for i, x in enumerate((96, 110)):
        g += f'<ellipse cx="{x}" cy="{170 + i * 4}" rx="3" ry="4" fill="#1f2937" opacity=".55"/>'
    g += '<path d="M128 178 l8 2.4 v5 l-8 -2.4Z" fill="#1f2937" opacity=".5"/>'
    g += '<circle cx="182" cy="198" r="2" fill="#22c55e"/>'
    return svg(g, defs)


def tower(panel, glow):
    defs = (lin('panel', panel[0], panel[1]) + lin('glass', '#1e293b', '#020617', 1, 1)
            + f'<radialGradient id="fan"><stop offset=".25" stop-color="#0f172a"/><stop offset=".72" stop-color="{glow[0]}"/><stop offset="1" stop-color="{glow[1]}"/></radialGradient>')
    g = shadow(200, 270, 120, 12)
    g += '<path d="M110 30 L250 30 L250 262 L110 262Z" fill="url(#glass)"/>'
    g += '<path d="M250 30 L300 46 V270 L250 262Z" fill="url(#panel)"/>'
    g += '<path d="M110 30 L160 14 L300 14 L250 30Z" fill="#334155"/><path d="M250 30 L300 14 V46Z" fill="#475569"/>'
    for cy in (78, 146, 214):
        g += f'<circle cx="180" cy="{cy}" r="30" fill="url(#fan)"/>'
        g += f'<circle cx="180" cy="{cy}" r="30" fill="none" stroke="{glow[1]}" stroke-width="2.5" opacity=".9"/>'
        g += f'<circle cx="180" cy="{cy}" r="7" fill="#1e293b"/>'
    g += f'<rect x="116" y="40" width="128" height="8" rx="2" fill="{glow[0]}" opacity=".35"/>'
    g += '<path d="M112 32 L160 32 L112 150Z" fill="#fff" opacity=".07"/>'
    for i in range(14):
        g += f'<rect x="262" y="{70 + i * 12}" width="26" height="4" rx="2" fill="#000" opacity=".25"/>'
    g += f'<circle cx="275" cy="54" r="4" fill="{glow[1]}"/>'
    return svg(g, defs)


# ---------- Monitors ----------
def monitor(wp1, wp2, stand='#94a3b8', bezel='#0b0f19', ratio=(300, 172), y=24):
    w, h = ratio
    x = (W - w) / 2
    screen, wpdefs = wallpaper(x + 5, y + 5, w - 10, h - 10, wp1, wp2, 2)
    defs = lin('st', stand, '#475569', 1, 0)
    g = shadow(200, 266, 100, 9)
    g += f'<path d="M188 {y + h - 6} H212 L218 252 H182Z" fill="url(#st)"/>'
    g += '<path d="M140 252 H260 Q266 252 264 258 L262 262 H138 L136 258 Q134 252 140 252Z" fill="url(#st)"/>'
    g += f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{bezel}"/>'
    g += screen
    return svg(g, defs + wpdefs)


def ultrawide(wp1, wp2):
    defs = lin('st', '#e2e8f0', '#475569', 1, 0) + lin('wp', wp1, wp2, 1, 1)
    g = shadow(200, 262, 130, 10)
    g += '<path d="M186 170 H214 L220 248 H180Z" fill="url(#st)"/>'
    g += '<path d="M130 248 H270 L276 258 H124Z" fill="url(#st)"/>'
    g += '<path d="M14 70 Q200 40 386 70 V186 Q200 160 14 186Z" fill="#0b0f19"/>'
    g += '<path d="M20 76 Q200 47 380 76 V180 Q200 154 20 180Z" fill="url(#wp)"/>'
    g += '<path d="M20 150 Q120 110 210 150 T380 120 V180 Q200 154 20 180Z" fill="#fff" opacity=".16"/>'
    g += '<circle cx="300" cy="90" r="34" fill="#fff" opacity=".14"/>'
    return svg(g, defs)


# ---------- Phones ----------
def phone(color, wp1, wp2, camera):
    defs = lin('body', color[0], color[1], 1, 1) + lin('wp', wp1, wp2, 1, 1) + lin('glass', '#334155', '#0f172a', 1, 1)
    g = shadow(200, 278, 110, 9)
    # front
    g += '<g transform="rotate(-8 150 150)">'
    g += '<rect x="96" y="24" width="122" height="248" rx="24" fill="#0b0f19"/>'
    g += '<rect x="102" y="30" width="110" height="236" rx="19" fill="url(#wp)"/>'
    g += '<circle cx="160" cy="210" r="60" fill="#fff" opacity=".12"/><circle cx="190" cy="70" r="40" fill="#fff" opacity=".12"/>'
    g += '<rect x="140" y="38" width="34" height="10" rx="5" fill="#0b0f19"/>' if camera != 'bar' else '<circle cx="157" cy="42" r="4.5" fill="#0b0f19"/>'
    g += '</g>'
    # back
    g += '<g transform="rotate(6 260 150)">'
    g += '<rect x="196" y="20" width="124" height="252" rx="24" fill="url(#body)"/>'
    g += '<rect x="196" y="20" width="124" height="252" rx="24" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>'

    def lens(cx, cy, r=12):
        return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#0b0f19" stroke="{color[1]}" stroke-width="2.5"/>'
                f'<circle cx="{cx}" cy="{cy}" r="{r * .55}" fill="url(#glass)"/><circle cx="{cx - r * .25}" cy="{cy - r * .25}" r="{r * .18}" fill="#fff" opacity=".6"/>')
    if camera == 'square3':
        g += '<rect x="206" y="30" width="66" height="66" rx="16" fill="#000" opacity=".18"/>'
        g += lens(225, 49) + lens(225, 78) + lens(253, 63) + '<circle cx="254" cy="40" r="3.5" fill="#fef3c7"/>'
    elif camera == 'two':
        g += '<rect x="208" y="32" width="30" height="58" rx="15" fill="#000" opacity=".15"/>'
        g += lens(223, 48, 10) + lens(223, 74, 10) + '<circle cx="250" cy="44" r="3" fill="#fef3c7"/>'
    elif camera == 'vertical':
        g += lens(226, 44, 11) + lens(226, 72, 11) + lens(226, 100, 11) + lens(254, 50, 7) + '<circle cx="254" cy="72" r="3.5" fill="#fef3c7"/>'
    elif camera == 'bar':
        g += '<rect x="194" y="52" width="128" height="34" rx="17" fill="#111827"/>'
        g += lens(222, 69, 10) + lens(250, 69, 10) + lens(282, 69, 8) + '<circle cx="303" cy="69" r="3" fill="#fef3c7"/>'
    g += '</g>'
    return svg(g, defs)


# ---------- Components ----------
def gpu(shroud, accent, fans=3):
    defs = lin('shroud', shroud[0], shroud[1]) + lin('gold', '#fde68a', '#b45309')
    g = shadow(200, 236, 180, 10)
    g += '<rect x="22" y="70" width="356" height="140" rx="14" fill="url(#shroud)"/>'
    g += '<rect x="22" y="70" width="356" height="140" rx="14" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>'
    g += f'<rect x="22" y="196" width="356" height="5" fill="{accent}" opacity=".9"/>'
    xs = [92, 200, 308] if fans == 3 else [120, 280]
    for cx in xs:
        g += f'<circle cx="{cx}" cy="134" r="50" fill="#0b0f19"/><circle cx="{cx}" cy="134" r="50" fill="none" stroke="{accent}" stroke-opacity=".6" stroke-width="2"/>'
        for k in range(9):
            a = k * 40
            g += (f'<path d="M{cx} 134 q 14 -16 38 -12 q -16 10 -30 22Z" fill="#334155" '
                  f'transform="rotate({a} {cx} 134)"/>')
        g += f'<circle cx="{cx}" cy="134" r="13" fill="#1e293b" stroke="#475569"/>'
    g += '<rect x="96" y="210" width="190" height="14" rx="2" fill="url(#gold)"/>'
    for i in range(30):
        g += f'<rect x="{100 + i * 6.2}" y="212" width="3" height="10" fill="#92400e" opacity=".45"/>'
    g += '<rect x="378" y="78" width="8" height="124" rx="2" fill="#94a3b8"/>'
    return svg(g, defs)


def cpu():
    defs = lin('ihs', '#f1f5f9', '#94a3b8', 1, 1) + lin('sub', '#166534', '#14532d', 1, 1)
    g = shadow(200, 252, 120, 12)
    g += '<g transform="translate(200 145) rotate(-8) translate(-200 -145)">'
    g += '<rect x="90" y="40" width="220" height="210" rx="10" fill="url(#sub)"/>'
    for i in range(16):
        g += f'<rect x="{102 + i * 13}" y="44" width="6" height="4" fill="#fbbf24" opacity=".8"/>'
        g += f'<rect x="{102 + i * 13}" y="242" width="6" height="4" fill="#fbbf24" opacity=".8"/>'
    g += '<path d="M120 62 H280 Q288 62 288 70 V100 H300 V190 H288 V220 Q288 228 280 228 H120 Q112 228 112 220 V190 H100 V100 H112 V70 Q112 62 120 62Z" fill="url(#ihs)"/>'
    g += '<path d="M120 62 H280 L150 228 H120 Q112 228 112 220 V70 Q112 62 120 62Z" fill="#fff" opacity=".3"/>'
    g += '<path d="M96 46 L106 46 L96 56Z" fill="#fbbf24"/>'
    g += '</g>'
    return svg(g, defs)


def ssd(heatsink=False):
    defs = lin('gold', '#fde68a', '#b45309', 1, 0) + lin('hs', '#334155', '#0f172a')
    g = shadow(200, 196, 190, 10)
    g += '<rect x="24" y="126" width="352" height="58" rx="4" fill="#111827"/>'
    g += '<rect x="24" y="130" width="22" height="50" rx="2" fill="url(#gold)"/>'
    for i in range(7):
        g += f'<rect x="26" y="{133 + i * 7}" width="18" height="3" fill="#92400e" opacity=".5"/>'
    g += '<path d="M376 146 a9 9 0 0 0 0 18Z" fill="#f8fafc"/>'
    if heatsink:
        g += '<rect x="56" y="112" width="304" height="72" rx="8" fill="url(#hs)"/>'
        for i in range(18):
            g += f'<rect x="{68 + i * 16}" y="118" width="8" height="60" rx="3" fill="#475569" opacity=".6"/>'
        g += '<rect x="56" y="112" width="304" height="72" rx="8" fill="none" stroke="#fff" stroke-opacity=".18"/>'
    else:
        g += '<rect x="60" y="136" width="56" height="38" rx="3" fill="#1f2937" stroke="#374151"/>'
        g += '<rect x="130" y="134" width="88" height="42" rx="3" fill="#1f2937" stroke="#374151"/>'
        g += '<rect x="230" y="134" width="88" height="42" rx="3" fill="#1f2937" stroke="#374151"/>'
        g += '<rect x="234" y="138" width="40" height="6" rx="2" fill="#fff" opacity=".12"/>'
    return svg(g, defs)


def ram(color, accent):
    defs = lin('hs', color[0], color[1]) + lin('gold', '#fde68a', '#b45309', 1, 0)
    g = shadow(200, 250, 170, 10)
    for dx, dy in ((0, 0), (18, 36)):
        g += f'<g transform="translate({dx} {dy})">'
        g += '<rect x="30" y="96" width="320" height="104" rx="4" fill="#065f46"/>'
        g += '<rect x="30" y="94" width="320" height="86" rx="6" fill="url(#hs)"/>'
        g += f'<path d="M30 120 L90 100 H350 V112 L100 132 H30Z" fill="{accent}" opacity=".85"/>'
        g += '<rect x="30" y="180" width="320" height="18" fill="url(#gold)"/>'
        for i in range(40):
            g += f'<rect x="{34 + i * 7.9}" y="182" width="3.5" height="15" fill="#92400e" opacity=".4"/>'
        g += '<rect x="186" y="186" width="8" height="14" fill="#f8fafc"/>'
        g += '</g>'
    return svg(g, defs)


# ---------- Audio ----------
def headphones(color, cushion='#1f2937'):
    defs = lin('cup', color[0], color[1], 1, 1)
    g = shadow(200, 270, 130, 10)
    g += '<path d="M96 170 Q90 40 200 36 Q310 40 304 170" fill="none" stroke="url(#cup)" stroke-width="20" stroke-linecap="round"/>'
    g += '<path d="M110 150 Q110 62 200 58 Q290 62 290 150" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="10" stroke-linecap="round"/>'
    for cx, sgn in ((112, -1), (288, 1)):
        g += f'<rect x="{cx - 4}" y="140" width="8" height="40" rx="4" fill="#94a3b8"/>'
        g += f'<ellipse cx="{cx}" cy="212" rx="50" ry="62" fill="url(#cup)"/>'
        g += f'<ellipse cx="{cx - sgn * 12}" cy="212" rx="34" ry="50" fill="{cushion}" opacity=".9"/>'
        g += f'<ellipse cx="{cx + sgn * 10}" cy="196" rx="12" ry="22" fill="#fff" opacity=".18"/>'
    return svg(g, defs)


def earbuds(case, bud):
    defs = lin('case', case[0], case[1]) + lin('bud', bud[0], bud[1], 1, 1)
    g = shadow(200, 262, 120, 10)
    g += '<rect x="110" y="150" width="180" height="104" rx="38" fill="url(#case)" stroke="#94a3b8" stroke-width="2"/>'
    g += '<rect x="110" y="150" width="180" height="20" fill="#000" opacity=".06"/>'
    g += '<path d="M118 150 Q118 70 200 66 Q282 70 282 150Z" fill="url(#case)" stroke="#94a3b8" stroke-width="2" transform="rotate(-12 118 150)"/>'
    g += '<circle cx="200" cy="232" r="3" fill="#22c55e"/>'
    for cx, flip in ((166, 1), (234, -1)):
        g += f'<g transform="translate({cx} 128) scale({flip} 1)">'
        g += '<ellipse cx="0" cy="0" rx="22" ry="20" fill="url(#bud)"/>'
        g += '<ellipse cx="-12" cy="-6" rx="10" ry="9" fill="#cbd5e1"/>'
        g += '<rect x="4" y="4" width="12" height="40" rx="6" fill="url(#bud)"/>'
        g += '</g>'
    return svg(g, defs)


# ---------- Accessories ----------
def mouse(color, accent):
    defs = lin('m', color[0], color[1], 1, 1)
    g = shadow(205, 262, 90, 10)
    g += '<path d="M200 30 C268 30 292 90 290 160 C288 230 250 262 200 262 C150 262 116 236 112 176 C108 120 120 92 140 70 C156 46 174 30 200 30Z" fill="url(#m)"/>'
    g += '<path d="M200 30 V112" stroke="#000" stroke-opacity=".25" stroke-width="2"/>'
    g += '<rect x="193" y="56" width="14" height="34" rx="7" fill="#1f2937"/>'
    g += f'<rect x="196" y="60" width="8" height="26" rx="4" fill="{accent}"/>'
    g += '<path d="M118 150 C112 190 120 214 136 226" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="3" stroke-linecap="round"/>'
    g += '<path d="M150 60 C170 40 214 34 240 52" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>'
    return svg(g, defs)


def keyboard(color, keys, numpad=False, mech=False, accent=None):
    defs = lin('kb', color[0], color[1])
    if mech:
        defs += ('<linearGradient id="rgb"><stop offset="0" stop-color="#f43f5e"/><stop offset=".33" stop-color="#a855f7"/>'
                 '<stop offset=".66" stop-color="#22d3ee"/><stop offset="1" stop-color="#22c55e"/></linearGradient>')
    x0, w = (20, 360) if numpad else (40, 320)
    g = shadow(200, 232 if mech else 212, w / 2 + 10, 10)
    if mech:
        g += f'<rect x="{x0 - 4}" y="96" width="{w + 8}" height="128" rx="14" fill="url(#rgb)" opacity=".55"/>'
    top, hgt = (100, 120) if mech else (112, 90)
    g += f'<rect x="{x0}" y="{top}" width="{w}" height="{hgt}" rx="12" fill="url(#kb)"/>'
    cols = 15
    main_w = (w - 24 - (70 if numpad else 0))
    kw = main_w / cols
    rows = 5
    kh = (hgt - 22) / rows
    for r in range(rows):
        y = top + 11 + r * kh
        x = x0 + 12
        n = cols
        for c in range(n):
            ww = kw - 3
            if r == 4 and c == 4:
                ww = kw * 6 - 3
            if r == 4 and 4 < c < 10:
                continue
            g += f'<rect x="{x:.1f}" y="{y:.1f}" width="{ww:.1f}" height="{kh - 3:.1f}" rx="{3 if mech else 2}" fill="{keys}"/>'
            if mech:
                g += f'<rect x="{x:.1f}" y="{y + kh - 7:.1f}" width="{ww:.1f}" height="4" rx="2" fill="#000" opacity=".25"/>'
            x += kw if not (r == 4 and c == 4) else kw * 6
        if numpad:
            for c in range(4):
                g += f'<rect x="{x0 + w - 78 + c * 17.5:.1f}" y="{y:.1f}" width="14.5" height="{kh - 3:.1f}" rx="2" fill="{keys}"/>'
    if mech and accent:
        g += f'<circle cx="{x0 + w - 26}" cy="{top - 0}" r="12" fill="#1f2937" stroke="{accent}" stroke-width="3"/>'
    return svg(g, defs)



# ---------- Colour helpers ----------
def _mix(hex_, target, t):
    hex_ = hex_.lstrip('#')
    r, g, b = (int(hex_[i:i + 2], 16) for i in (0, 2, 4))
    tr, tg, tb = target
    return '#%02x%02x%02x' % (round(r + (tr - r) * t), round(g + (tg - g) * t), round(b + (tb - b) * t))


def light(hex_, t=.25):
    return _mix(hex_, (255, 255, 255), t)


def dark(hex_, t=.3):
    return _mix(hex_, (0, 0, 0), t)


def pair(hex_):
    """Gradient pair for a body colour."""
    return (light(hex_, .18), dark(hex_, .22))


# ---------- Gaming ----------
def ps5(body='#f8fafc', core='#111827', pro=False):
    defs = lin('wing', body, dark(body, .14), 1, 0) + lin('wing2', dark(body, .14), body, 1, 0)
    g = shadow(200, 270, 110, 10)
    g += f'<path d="M180 22 H220 V262 H180Z" fill="{core}"/>'
    g += '<path d="M180 24 C150 30 138 52 132 84 L118 252 Q148 266 180 260Z" fill="url(#wing2)"/>'
    g += '<path d="M220 24 C250 30 262 52 268 84 L282 252 Q252 266 220 260Z" fill="url(#wing)"/>'
    g += '<path d="M180 26 V258 M220 26 V258" stroke="#60a5fa" stroke-width="2" opacity=".85"/>'
    if pro:
        for y in (110, 150, 190):
            g += f'<path d="M140 {y} H180 M220 {y} H260" stroke="{core}" stroke-width="4"/>'
    g += '<rect x="150" y="262" width="100" height="8" rx="4" fill="#1f2937"/>'
    g += f'<rect x="192" y="40" width="16" height="6" rx="3" fill="#374151"/>'
    return svg(g, defs)


def xbox_x(body='#1f2937'):
    defs = lin('front', light(body, .08), dark(body, .35)) + lin('side', dark(body, .25), dark(body, .5))
    defs += '<radialGradient id="vent"><stop offset="0" stop-color="#22c55e" stop-opacity=".9"/><stop offset="1" stop-color="#14532d"/></radialGradient>'
    g = shadow(205, 270, 110, 12)
    g += '<path d="M128 70 L170 42 H300 L258 70Z" fill="#111"/>'
    g += '<ellipse cx="214" cy="56" rx="48" ry="11" fill="url(#vent)"/>'
    for i in range(9):
        g += f'<circle cx="{178 + i * 9}" cy="56" r="2.2" fill="#052e16"/>'
    g += '<rect x="128" y="70" width="130" height="196" fill="url(#front)"/>'
    g += '<path d="M258 70 L300 42 V238 L258 266Z" fill="url(#side)"/>'
    g += '<rect x="140" y="84" width="60" height="4" rx="2" fill="#000" opacity=".6"/>'
    g += '<circle cx="243" cy="86" r="5" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>'
    g += '<rect x="140" y="250" width="16" height="6" rx="2" fill="#000" opacity=".5"/>'
    return svg(g, defs)


def xbox_s(body='#f1f5f9'):
    defs = lin('front', body, dark(body, .12)) + lin('top', light(body, .3), body, 1, 1)
    g = shadow(205, 248, 150, 12)
    g += '<path d="M60 150 L120 110 H340 L280 150Z" fill="url(#top)"/>'
    g += '<ellipse cx="236" cy="130" rx="52" ry="15" fill="#111827"/>'
    for i in range(10):
        g += f'<circle cx="{196 + i * 9}" cy="130" r="2" fill="#374151"/>'
    g += '<rect x="60" y="150" width="220" height="86" fill="url(#front)"/>'
    g += f'<path d="M280 150 L340 110 V196 L280 236Z" fill="{dark(body, .2)}"/>'
    g += '<circle cx="80" cy="168" r="5" fill="none" stroke="#475569" stroke-width="1.5"/>'
    g += '<rect x="96" y="222" width="18" height="6" rx="2" fill="#1f2937" opacity=".55"/>'
    return svg(g, defs)


def _stick(cx, cy, r=13, ring=None):
    out = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#0b0f19"/><circle cx="{cx}" cy="{cy}" r="{r * .62}" fill="#1f2937"/>'
    if ring:
        out = f'<circle cx="{cx}" cy="{cy}" r="{r + 4}" fill="none" stroke="{ring}" stroke-width="3"/>' + out
    return out


def _abxy(cx, cy, d=12, r=5, fill='#1f2937'):
    return ''.join(f'<circle cx="{cx + dx}" cy="{cy + dy}" r="{r}" fill="{fill}"/>' for dx, dy in ((0, -d), (d, 0), (0, d), (-d, 0)))


def _dpad(cx, cy, s=6, fill='#1f2937'):
    return (f'<rect x="{cx - s}" y="{cy - s * 3}" width="{s * 2}" height="{s * 6}" rx="2" fill="{fill}"/>'
            f'<rect x="{cx - s * 3}" y="{cy - s}" width="{s * 6}" height="{s * 2}" rx="2" fill="{fill}"/>')


def switch_oled(left='#ef4444', right='#3b82f6', wp=('#f43f5e', '#7c3aed')):
    screen, wpdefs = wallpaper(126, 98, 148, 92, wp[0], wp[1], 3)
    g = shadow(200, 232, 150, 10)
    g += f'<path d="M122 92 H96 Q78 92 78 110 V180 Q78 198 96 198 H122Z" fill="{left}"/>'
    g += f'<path d="M278 92 H304 Q322 92 322 110 V180 Q322 198 304 198 H278Z" fill="{right}"/>'
    g += '<rect x="120" y="90" width="160" height="110" rx="6" fill="#111827"/>' + screen
    g += _stick(100, 120, 9) + _dpad(100, 162, 4) + _stick(300, 168, 9) + _abxy(300, 124, 9, 4)
    return svg(g, wpdefs)


def switch2(accent_l='#38bdf8', accent_r='#f472b6'):
    screen, wpdefs = wallpaper(118, 92, 164, 104, '#ef4444', '#f59e0b', 3)
    g = shadow(200, 238, 165, 10)
    g += '<path d="M112 84 H86 Q64 84 64 106 V184 Q64 206 86 206 H112Z" fill="#1f2937"/>'
    g += '<path d="M288 84 H314 Q336 84 336 106 V184 Q336 206 314 206 H288Z" fill="#1f2937"/>'
    g += f'<path d="M112 84 V206" stroke="{accent_l}" stroke-width="5"/><path d="M288 84 V206" stroke="{accent_r}" stroke-width="5"/>'
    g += '<rect x="110" y="82" width="180" height="126" rx="6" fill="#0b0f19"/>' + screen
    g += _stick(88, 116, 11) + _dpad(88, 166, 4.5, '#374151') + _stick(312, 170, 11) + _abxy(312, 118, 10, 4.5, '#374151')
    return svg(g, wpdefs)


def handheld(body='#1f2937', screen_c=('#6366f1', '#06b6d4'), style='deck'):
    defs = lin('hb', light(body, .1), dark(body, .25))
    if style == 'deck':
        screen, wpdefs = wallpaper(124, 106, 152, 94, screen_c[0], screen_c[1], 3)
    else:
        screen, wpdefs = wallpaper(118, 100, 164, 104, screen_c[0], screen_c[1], 3)
    g = shadow(200, 246, 175, 10)
    g += '<path d="M70 92 H330 Q372 92 376 140 L380 196 Q382 236 346 236 Q318 236 300 214 H100 Q82 236 54 236 Q18 236 20 196 L24 140 Q28 92 70 92Z" fill="url(#hb)"/>'
    g += '<rect x="112" y="96" width="176" height="114" rx="6" fill="#0b0f19"/>' + screen
    if style == 'deck':
        g += _stick(66, 124, 13) + _stick(334, 124, 13)
        g += '<rect x="48" y="166" width="38" height="36" rx="6" fill="#111827"/><rect x="314" y="166" width="38" height="36" rx="6" fill="#111827"/>'
        g += _dpad(94, 136, 4, '#0b0f19') + _abxy(304, 140, 9, 4.5, '#0b0f19')
    else:
        ring = '#a855f7'
        g += _stick(70, 120, 12, ring) + _dpad(70, 180, 5, '#0b0f19') + _abxy(330, 128, 11, 5, '#0b0f19') + _stick(320, 184, 12, ring)
    return svg(g, defs + wpdefs)


def gamepad(body='#f8fafc', accent='#111827', style='sony'):
    defs = lin('gp', light(body, .12), dark(body, .15), 1, 1)
    g = shadow(200, 262, 150, 10)
    shape = ('M118 92 Q200 80 282 92 C326 98 350 140 362 196 C372 240 346 266 318 252 C298 242 286 214 268 204 '
             'H132 C114 214 102 242 82 252 C54 266 28 240 38 196 C50 140 74 98 118 92Z')
    g += f'<path d="{shape}" fill="url(#gp)"/>'
    g += f'<path d="{shape}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="2"/>'
    if style == 'sony':
        g += f'<path d="M122 96 Q200 88 278 96 L270 112 Q200 106 130 112Z" fill="{accent}" opacity=".9"/>'
        g += f'<rect x="160" y="100" width="80" height="54" rx="8" fill="{accent}"/>'
        g += _dpad(104, 140, 6, dark(body, .35) if body != '#111827' else '#374151')
        g += _abxy(296, 140, 15, 7, dark(body, .35) if body != '#111827' else '#374151')
        g += _stick(160, 186, 15) + _stick(240, 186, 15)
        g += '<path d="M180 168 h40" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/>'
    else:
        g += _stick(108, 138, 15) + _dpad(160, 188, 6, '#0b0f19') + _stick(240, 188, 15)
        for (dx, dy), c in zip(((0, -14), (14, 0), (0, 14), (-14, 0)), ('#facc15', '#ef4444', '#22c55e', '#3b82f6')):
            g += f'<circle cx="{292 + dx}" cy="{138 + dy}" r="7" fill="{c}"/>'
        g += f'<circle cx="200" cy="120" r="10" fill="{accent}" stroke="#e5e7eb" stroke-width="2"/>'
    return svg(g, defs)

SILVER = ('#e5e7eb', '#9ca3af')
SPACE = ('#4b5563', '#1f2937')
GRAPHITE = ('#374151', '#111827')
BLACK = ('#27272a', '#09090b')

IMAGES = {
    1: ('macbook-air.svg', laptop(('#cbd5e1', '#64748b'), '#38bdf8', '#1e3a8a')),
    2: ('macbook-pro-14.svg', laptop(SPACE, '#a855f7', '#1e1b4b')),
    3: ('rog-zephyrus-g14.svg', laptop(GRAPHITE, '#f43f5e', '#312e81', 'gaming')),
    4: ('zenbook-14-oled.svg', laptop(('#3b4a6b', '#1e293b'), '#06b6d4', '#4338ca')),
    5: ('thinkpad-x1-carbon.svg', laptop(BLACK, '#64748b', '#0f172a', 'thinkpad')),
    6: ('legion-pro-7i.svg', laptop(('#3f3f46', '#18181b'), '#fb923c', '#7c2d12', 'gaming')),
    7: ('xps-14.svg', laptop(('#52525b', '#27272a'), '#60a5fa', '#0f172a')),
    8: ('spectre-x360-14.svg', convertible(('#3f3f46', '#1c1917'), '#f59e0b', '#7c2d12')),
    9: ('surface-laptop.svg', laptop(('#d6d3d1', '#a8a29e'), '#2563eb', '#93c5fd')),
    10: ('imac-24.svg', all_in_one(('#93c5fd', '#3b82f6'), '#60a5fa', '#1d4ed8')),
    11: ('mac-mini.svg', mini_pc(('#f1f5f9', '#cbd5e1'), ('#cbd5e1', '#94a3b8'))),
    12: ('alienware-aurora.svg', tower(('#e5e7eb', '#9ca3af'), ('#0ea5e9', '#22d3ee'))),
    13: ('rog-strix-desktop.svg', tower(('#3f3f46', '#18181b'), ('#db2777', '#f472b6'))),
    14: ('studio-display.svg', monitor('#818cf8', '#0f172a', stand='#e2e8f0', ratio=(300, 176))),
    15: ('odyssey-g9.svg', ultrawide('#7c3aed', '#0ea5e9')),
    16: ('rog-swift-oled-27.svg', monitor('#ef4444', '#0f172a', stand='#52525b', ratio=(300, 172))),
    17: ('ultrasharp-27.svg', monitor('#22d3ee', '#1e3a8a', stand='#cbd5e1', ratio=(300, 172))),
    18: ('iphone-17-pro.svg', phone(('#fdba74', '#c2410c'), '#f97316', '#1e1b4b', 'square3')),
    19: ('iphone-17.svg', phone(('#c4b5fd', '#7c3aed'), '#a78bfa', '#1e3a8a', 'two')),
    20: ('galaxy-s25-ultra.svg', phone(('#94a3b8', '#334155'), '#38bdf8', '#312e81', 'vertical')),
    21: ('pixel-10-pro.svg', phone(('#e7e5e4', '#a8a29e'), '#4ade80', '#0f766e', 'bar')),
    22: ('rtx-5090.svg', gpu(('#52525b', '#18181b'), '#a3e635', 2)),
    23: ('rtx-5070.svg', gpu(('#71717a', '#27272a'), '#84cc16', 2)),
    24: ('ryzen-7-9800x3d.svg', cpu()),
    25: ('990-pro-ssd.svg', ssd(heatsink=True)),
    26: ('vengeance-ddr5.svg', ram(('#27272a', '#09090b'), '#facc15')),
    27: ('airpods-pro-3.svg', earbuds(('#ffffff', '#e2e8f0'), ('#ffffff', '#cbd5e1'))),
    28: ('wh-1000xm6.svg', headphones(('#57534e', '#1c1917'))),
    29: ('galaxy-buds3-pro.svg', earbuds(('#cbd5e1', '#64748b'), ('#f1f5f9', '#94a3b8'))),
    30: ('mx-master-3s.svg', mouse(('#52525b', '#18181b'), '#94a3b8')),
    31: ('mx-keys-s.svg', keyboard(('#52525b', '#27272a'), '#3f3f46', numpad=True)),
    32: ('magic-keyboard.svg', keyboard(('#f8fafc', '#cbd5e1'), '#ffffff', numpad=True)),
    33: ('blackwidow-v4-pro.svg', keyboard(('#27272a', '#09090b'), '#18181b', mech=True, accent='#22c55e')),
}

# Fallbacks for new products added later without a photo, one per category
CATEGORY_DEFAULTS = {
    'laptop.svg': laptop(SILVER, '#6366f1', '#06b6d4'),
    'desktop.svg': tower(('#3f3f46', '#18181b'), ('#6366f1', '#22d3ee')),
    'monitor.svg': monitor('#6366f1', '#06b6d4'),
    'phone.svg': phone(('#cbd5e1', '#64748b'), '#6366f1', '#06b6d4', 'two'),
    'component.svg': ssd(),
    'audio.svg': headphones(('#475569', '#0f172a')),
    'accessory.svg': mouse(('#64748b', '#1e293b'), '#6366f1'),
}


# ---------- New products (gaming) ----------
IMAGES.update({
    34: ('ps5-pro.svg', ps5(pro=True)),
    35: ('ps5-slim.svg', ps5()),
    36: ('xbox-series-x.svg', xbox_x()),
    37: ('xbox-series-s.svg', xbox_s()),
    38: ('switch-2.svg', switch2()),
    39: ('switch-oled.svg', switch_oled()),
    40: ('steam-deck-oled-512.svg', handheld('#27272a', ('#3b82f6', '#a855f7'))),
    41: ('steam-deck-oled-1tb.svg', handheld('#27272a', ('#f97316', '#db2777'))),
    42: ('rog-xbox-ally-x.svg', handheld('#18181b', ('#22c55e', '#0f766e'), 'ally')),
    43: ('dualsense.svg', gamepad()),
    44: ('xbox-controller.svg', gamepad('#1f2937', '#111827', 'xbox')),
})
CATEGORY_DEFAULTS['gaming.svg'] = gamepad('#64748b', '#1e293b', 'xbox')

# ---------- Colour options ----------
# product id -> (file prefix, [(colour name, hex)], function that draws one colour)
VARIANTS = {
    1: ('macbook-air', [('Sky Blue', '#a9c6df'), ('Silver', '#dfe1e4'), ('Starlight', '#efe3cf'), ('Midnight', '#2e3642')],
        lambda c: laptop(pair(c), '#38bdf8', '#1e3a8a')),
    2: ('macbook-pro-14', [('Space Black', '#2b2b2e'), ('Silver', '#dcdee1')],
        lambda c: laptop(pair(c), '#a855f7', '#1e1b4b')),
    4: ('zenbook-14-oled', [('Ponder Blue', '#334866'), ('Jade Black', '#2a2d31')],
        lambda c: laptop(pair(c), '#06b6d4', '#4338ca')),
    9: ('surface-laptop', [('Platinum', '#d9d9d6'), ('Sapphire', '#2f4a7a'), ('Dune', '#c8b8a2'), ('Black', '#2a2a2a')],
        lambda c: laptop(pair(c), '#2563eb', '#93c5fd')),
    10: ('imac-24', [('Blue', '#5b8fd6'), ('Green', '#6fbf8f'), ('Pink', '#ef8fa6'), ('Silver', '#d6d9dd'), ('Yellow', '#f2c94c'), ('Orange', '#f08a4b'), ('Purple', '#9b7fd1')],
        lambda c: all_in_one(pair(c), light(c, .2), dark(c, .35))),
    18: ('iphone-17-pro', [('Cosmic Orange', '#e8742e'), ('Deep Blue', '#2d3f5c'), ('Silver', '#dcdfe3')],
        lambda c: phone(pair(c), light(c, .1), '#1e1b4b', 'square3')),
    19: ('iphone-17', [('Lavender', '#b9a7e0'), ('Sage', '#a7bfa0'), ('Mist Blue', '#9fbad6'), ('White', '#f4f4f2'), ('Black', '#2b2b2e')],
        lambda c: phone(pair(c), '#a78bfa', '#1e3a8a', 'two')),
    20: ('galaxy-s25-ultra', [('Titanium Silverblue', '#8fa3b8'), ('Titanium Black', '#2e3033'), ('Titanium Gray', '#8a8b8d'), ('Titanium Whitesilver', '#e3e3e1')],
        lambda c: phone(pair(c), '#38bdf8', '#312e81', 'vertical')),
    21: ('pixel-10-pro', [('Moonstone', '#7d8a99'), ('Jade', '#b9d3c2'), ('Porcelain', '#ece6dc'), ('Obsidian', '#2a2a2c')],
        lambda c: phone(pair(c), '#4ade80', '#0f766e', 'bar')),
    28: ('wh-1000xm6', [('Black', '#2a2827'), ('Platinum Silver', '#cfcac2'), ('Midnight Blue', '#2c3a55')],
        lambda c: headphones(pair(c))),
    29: ('galaxy-buds3-pro', [('Silver', '#a7adb5'), ('White', '#f3f4f6')],
        lambda c: earbuds(pair(c), (light(c, .5), c))),
    30: ('mx-master-3s', [('Graphite', '#3a3b3f'), ('Pale Gray', '#cfd1d4')],
        lambda c: mouse(pair(c), '#94a3b8')),
    32: ('magic-keyboard', [('White', '#f8fafc'), ('Black', '#27272a')],
        lambda c: keyboard(pair(c), light(c, .4) if c == '#27272a' else '#ffffff', numpad=True)),
    39: ('switch-oled', [('Neon Red/Blue', '#ef4444|#3b82f6'), ('White', '#f8fafc|#f8fafc')],
        lambda c: switch_oled(*c.split('|'))),
    43: ('dualsense', [('White', '#f8fafc|#111827'), ('Midnight Black', '#2a2b30|#111827'), ('Cosmic Red', '#b91c1c|#111827'), ('Starlight Blue', '#6d9dd6|#f8fafc')],
        lambda c: gamepad(*c.split('|'))),
    44: ('xbox-controller', [('Carbon Black', '#1f2937|#111827'), ('Robot White', '#f1f5f9|#e5e7eb'), ('Shock Blue', '#2563eb|#1e3a8a'), ('Pulse Red', '#dc2626|#7f1d1d')],
        lambda c: gamepad(*c.split('|'), style='xbox')),
}


def slug(name):
    return ''.join(ch if ch.isalnum() else '-' for ch in name.lower()).strip('-').replace('--', '-')

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for _, (name, content) in IMAGES.items():
        open(os.path.join(OUT, name), 'w').write(content)
    for name, content in CATEGORY_DEFAULTS.items():
        open(os.path.join(OUT, name), 'w').write(content)
    manifest = {}
    for pid, (prefix, colours, draw) in VARIANTS.items():
        manifest[pid] = []
        for name, hex_ in colours:
            file = f'{prefix}-{slug(name)}.svg'
            open(os.path.join(OUT, file), 'w').write(draw(hex_))
            manifest[pid].append({'name': name, 'hex': hex_.split('|')[0], 'image': f'images/{file}'})
    import json
    open(os.path.join(os.path.dirname(__file__), 'colors.json'), 'w').write(json.dumps(manifest, indent=2))
    total = len(IMAGES) + len(CATEGORY_DEFAULTS) + sum(len(v) for v in manifest.values())
    print(f'wrote {total} images to {os.path.normpath(OUT)}')
