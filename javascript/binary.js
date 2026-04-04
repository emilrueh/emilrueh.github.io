if (window.innerWidth <= 768) throw new Error('Mobile: binary effect disabled')

// --- Config ---
const gradientChars = 13 // aka size
const fontSize = 13
const lineHeight = 17
const falloffExponent = 1.2
const maxOpacity = 0.6

const maxWeight = 1000
const minWeight = 100
const weightBuckets = 10
const useWeightGradient = true
const useOpacityGradient = true

const hexPadding = 40
const hexFalloffChars = 25
const sectionFadeChars = 50
const hexTiltDeg = 5
const hexGrowDelay = 500
const hexGrowDuration = 2000

const rippleSpeed = 100
const rippleWidth = 100
const rippleDuration = 3000

const S3 = Math.sqrt(3)
const hexCos = Math.cos(hexTiltDeg * Math.PI / 180)
const hexSin = Math.sin(hexTiltDeg * Math.PI / 180)

// --- Canvas setup ---
const canvas = document.createElement('canvas')
canvas.id = 'binary-canvas'
const ctx = canvas.getContext('2d')
document.body.prepend(canvas)

let dpr = window.devicePixelRatio || 1
let viewW, viewH, charW, cols, rows, gradientPx, sectionFadePx

// --- Grid storage ---
let rowChars = []

// --- State ---
let mouseX = -9999, mouseY = -9999
let lastScrollY = -1
let dirty = true
let dirtySource = 'init'
let dirtyInvert = true
let hexGrowStart = -1
let hexGrowProgress = 0
let ripples = []

// --- Element references ---
let logoEl, servicesEl, contactEl, iconEls

function fontString(weight) {
    return `${weight} ${fontSize}px "Chivo Mono"`
}

// --- Hexagonal distance (pointy-top, normalized: 0 at center, 1 at boundary) ---
function hexNormDist(px, py, cx, cy, R) {
    const rawDx = px - cx
    const rawDy = py - cy
    const dx = Math.abs(rawDx * hexCos + rawDy * hexSin)
    const dy = Math.abs(-rawDx * hexSin + rawDy * hexCos)
    return Math.max(dx * 2 / S3, dx / S3 + dy) / R
}

// --- Initialize fixed grid ---
function initGrid() {
    dpr = window.devicePixelRatio || 1
    viewW = window.innerWidth
    viewH = window.innerHeight

    canvas.width = viewW * dpr
    canvas.height = viewH * dpr
    canvas.style.width = viewW + 'px'
    canvas.style.height = viewH + 'px'

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.font = fontString(maxWeight)

    charW = ctx.measureText('0').width
    cols = Math.floor(viewW / charW)
    rows = Math.floor(viewH / lineHeight)
    gradientPx = gradientChars * charW
    sectionFadePx = sectionFadeChars * charW

    rowChars = []
    for (let r = 0; r < rows; r++) {
        const chars = []
        for (let c = 0; c < cols; c++) {
            chars.push(Math.random() < 0.5 ? '0' : '1')
        }
        rowChars.push(chars)
    }

    logoEl = document.querySelector('#about .about-wrapper__image img')
    servicesEl = document.getElementById('services')
    contactEl = document.getElementById('contact')
    iconEls = document.querySelectorAll('.service-card__image')

    dirty = true
}

// --- Render frame ---
function render() {
    ctx.clearRect(0, 0, viewW, viewH)

    if (!logoEl || !servicesEl || !contactEl) return

    const logoRect = logoEl.getBoundingClientRect()
    const servicesRect = servicesEl.getBoundingClientRect()
    const contactTop = contactEl.getBoundingClientRect().top
    const vh15 = viewH * 0.15

    // Hex params (pointy-top, centered on logo, grows in after delay)
    const hexCX = logoRect.left + logoRect.width / 2
    const hexCY = logoRect.top + logoRect.height / 2
    const hexRFull = Math.min(logoRect.width, logoRect.height) / 2 + hexPadding
    const hexR = hexRFull * hexGrowProgress
    const hexFalloffNorm = hexR > 0 ? hexFalloffChars * charW / hexR : 0

    const buckets = new Map()
    const draws = []
    const servicesBottom = Math.max(servicesRect.bottom, contactTop + vh15)

    for (let r = 0; r < rows; r++) {
        const y = r * lineHeight + fontSize
        const rowTop = r * lineHeight
        const rowBottom = rowTop + lineHeight
        const charY = rowTop + lineHeight / 2

        const inHexRange = charY >= hexCY - hexR && charY <= hexCY + hexR
        const inServices = rowBottom > servicesRect.top && rowTop < servicesBottom

        if (!inHexRange && !inServices) continue

        const cursorNearRow = mouseX > -9000 &&
            Math.max(rowTop - mouseY, 0, mouseY - rowBottom) < gradientPx

        if (!inHexRange && !cursorNearRow) continue

        for (let c = 0; c < cols; c++) {
            const charCenterX = c * charW + charW / 2

            let visibility = 0

            if (inHexRange) {
                const hd = hexNormDist(charCenterX, charY, hexCX, hexCY, hexR)
                if (hd <= 1 - hexFalloffNorm) {
                    visibility = 1
                } else if (hd <= 1) {
                    visibility = (1 - hd) / hexFalloffNorm
                }

                // Cursor hole
                if (visibility > 0 && mouseX > -9000) {
                    const cursorDist = Math.hypot(charCenterX - mouseX, charY - mouseY)
                    if (cursorDist < gradientPx) {
                        visibility *= cursorDist / gradientPx
                    }
                }
            }

            // Fall through to services if hex didn't contribute
            if (visibility <= 0.01 && inServices && cursorNearRow) {
                const cursorDist = Math.hypot(charCenterX - mouseX, charY - mouseY)
                if (cursorDist < gradientPx) {
                    visibility = 1 - cursorDist / gradientPx
                }

                // Services top fade
                const distFromTop = charY - servicesRect.top
                if (distFromTop <= 0) {
                    visibility = 0
                } else if (distFromTop < sectionFadePx) {
                    visibility *= distFromTop / sectionFadePx
                }

                // CTA diagonal bottom fade
                const diagY = contactTop + vh15 * (1 - charCenterX / viewW)
                const distAbove = diagY - charY
                if (distAbove <= 0) {
                    visibility = 0
                } else if (distAbove < sectionFadePx) {
                    visibility *= distAbove / sectionFadePx
                }
            }

            // Ripple suppression
            for (const rip of ripples) {
                const dist = Math.hypot(charCenterX - rip.x, charY - rip.y)
                if (dist < rip.radius) {
                    const behind = rip.radius - dist
                    if (behind < rippleWidth) {
                        visibility *= (behind / rippleWidth) + (1 - behind / rippleWidth) * (1 - rip.strength)
                    }
                }
            }

            if (visibility <= 0.01) continue

            const centerActive = (dirtySource === 'mouse') !== dirtyInvert
            const randomize = centerActive ? visibility > 0.3 : visibility < 0.3
            if (randomize) rowChars[r][c] = Math.random() < 0.5 ? '0' : '1'
            const ch = rowChars[r][c]

            const curved = Math.pow(visibility, falloffExponent)
            const alpha = useOpacityGradient ? curved * maxOpacity : maxOpacity

            if (useWeightGradient) {
                const wStep = Math.min(Math.floor(curved * weightBuckets), weightBuckets - 1)
                if (!buckets.has(wStep)) {
                    const weight = Math.round(minWeight + (maxWeight - minWeight) * (wStep / (weightBuckets - 1)))
                    buckets.set(wStep, { weight, draws: [] })
                }
                buckets.get(wStep).draws.push({ ch, x: c * charW, y, alpha })
            } else {
                draws.push({ ch, x: c * charW, y, alpha })
            }
        }
    }

    ctx.fillStyle = 'rgb(255, 255, 255)'
    if (useWeightGradient) {
        for (const [, bucket] of buckets) {
            ctx.font = fontString(bucket.weight)
            for (const d of bucket.draws) {
                ctx.globalAlpha = d.alpha
                ctx.fillText(d.ch, d.x, d.y)
            }
        }
    } else {
        ctx.font = fontString(maxWeight)
        for (const d of draws) {
            ctx.globalAlpha = d.alpha
            ctx.fillText(d.ch, d.x, d.y)
        }
    }
    ctx.globalAlpha = 1
}

// --- Animation loop ---
function loop(now) {
    // Hex grow animation
    if (hexGrowStart >= 0 && hexGrowProgress < 1) {
        const t = Math.min((now - hexGrowStart) / hexGrowDuration, 1)
        hexGrowProgress = t * t * (3 - 2 * t) // smoothstep easing
        dirty = true
    }

    // Ripple animation
    if (ripples.length > 0) {
        for (const rip of ripples) {
            const age = (now - rip.start) / rippleDuration
            rip.radius = age * rippleSpeed * (rippleDuration / 1000)
            rip.strength = 1 - age
        }
        ripples = ripples.filter(r => (now - r.start) < rippleDuration)
        dirty = true
    }

    const scrollY = window.scrollY
    if (scrollY !== lastScrollY) {
        lastScrollY = scrollY
        dirtySource = 'scroll'
        dirty = true
    }

    if (dirty) {
        render()
        dirty = false
    }

    requestAnimationFrame(loop)
}

// --- Event listeners ---
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    dirtySource = 'mouse'
    dirty = true
})

document.addEventListener('click', (e) => {
    ripples.push({ x: e.clientX, y: e.clientY, start: performance.now(), radius: 0, strength: 1 })
    dirty = true
})

document.addEventListener('mouseleave', () => {
    mouseX = -9999
    mouseY = -9999
    dirty = true
})

let resizeTimer
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => initGrid(), 150)
})

// --- Init ---
document.fonts.load(fontString(maxWeight)).then(() => {
    initGrid()
    requestAnimationFrame(loop)
    setTimeout(() => {
        hexGrowStart = performance.now()
        dirty = true
    }, hexGrowDelay)
})
