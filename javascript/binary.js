if (window.innerWidth <= 768) throw new Error('Mobile: binary effect disabled')

// --- Config ---
const gradientChars = 13 // aka size
const fontSize = 12
const lineHeight = 14
const falloffExponent = 1.1
const sectionFadeChars = 30
const maxOpacity = 0.6
const maxWeight = 1000
const minWeight = 100
const weightBuckets = 10

// Per-zone config
const svcMouseThreshold = 0.5
const svcScrollThreshold = 0.5
const svcInvertRandomize = true
const svcUseWeight = true
const svcUseOpacity = true

const stripMouseThreshold = 0.3
const stripScrollThreshold = 0.3
const stripInvertRandomize = false
const stripUseWeight = false
const stripUseOpacity = true

const stripSolidLeft = 0
const stripSolidRight = 0
const stripSolidTop = 0
const stripSolidBottom = 0

const stripFalloffLeft = 40
const stripFalloffRight = 30
const stripFalloffTop = 50
const stripFalloffBottom = 80

const rippleSpeed = 100
const rippleWidth = 100
const rippleDuration = 3000

// --- Canvas setup ---
const canvas = document.createElement('canvas')
canvas.id = 'binary-canvas'
const ctx = canvas.getContext('2d')
document.body.prepend(canvas)

let dpr = window.devicePixelRatio || 1
let viewW, viewH, charW, cols, rows, gradientPx, sectionFadePx
let sSolidL, sSolidR, sSolidT, sSolidB, sFallL, sFallR, sFallT, sFallB

// --- Grid storage ---
let rowChars = []

// --- State ---
let mouseX = -9999, mouseY = -9999
let lastScrollY = -1
let dirty = true
let dirtySource = 'init'
let ripples = []

// --- Element references ---
let aboutEl, servicesEl, contactEl

function fontString(weight) {
    return `${weight} ${fontSize}px "Chivo Mono"`
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
    sSolidL = stripSolidLeft * charW
    sSolidR = stripSolidRight * charW
    sSolidT = stripSolidTop * charW
    sSolidB = stripSolidBottom * charW
    sFallL = stripFalloffLeft * charW
    sFallR = stripFalloffRight * charW
    sFallT = stripFalloffTop * charW
    sFallB = stripFalloffBottom * charW

    rowChars = []
    for (let r = 0; r < rows; r++) {
        const chars = []
        for (let c = 0; c < cols; c++) {
            chars.push(Math.random() < 0.5 ? '0' : '1')
        }
        rowChars.push(chars)
    }

    aboutEl = document.getElementById('about')
    servicesEl = document.getElementById('services')
    contactEl = document.getElementById('contact')

    dirty = true
}

// --- Render frame ---
function render() {
    ctx.clearRect(0, 0, viewW, viewH)

    if (!aboutEl || !servicesEl || !contactEl) return

    const aboutRect = aboutEl.getBoundingClientRect()
    const servicesRect = servicesEl.getBoundingClientRect()
    const contactTop = contactEl.getBoundingClientRect().top
    const vh15 = viewH * 0.15
    const stripTotalPx = sFallL + sSolidL + sSolidR + sFallR

    const buckets = new Map()
    const draws = []
    const servicesBottom = Math.max(servicesRect.bottom, contactTop + vh15)

    for (let r = 0; r < rows; r++) {
        const y = r * lineHeight + fontSize
        const rowTop = r * lineHeight
        const rowBottom = rowTop + lineHeight
        const charY = rowTop + lineHeight / 2

        const inStrip = charY >= aboutRect.top && charY <= aboutRect.bottom
        const inServices = rowBottom > servicesRect.top && rowTop < servicesBottom

        if (!inStrip && !inServices) continue

        const cursorNearRow = mouseX > -9000 &&
            Math.max(rowTop - mouseY, 0, mouseY - rowBottom) < gradientPx

        if (!inStrip && !cursorNearRow) continue

        for (let c = 0; c < cols; c++) {
            const charCenterX = c * charW + charW / 2

            let visibility = 0
            let zone = 0 // 0 = none, 1 = strip, 2 = services

            if (inStrip && charCenterX < stripTotalPx) {
                // Horizontal visibility
                const solidR = sFallL + sSolidL + sSolidR
                if (charCenterX < sFallL) {
                    visibility = sFallL > 0 ? charCenterX / sFallL : 1
                } else if (charCenterX <= solidR) {
                    visibility = 1
                } else {
                    visibility = sFallR > 0 ? 1 - (charCenterX - solidR) / sFallR : 0
                }

                // Vertical fades relative to about section bounds
                const distFromTop = charY - aboutRect.top
                const distFromBottom = aboutRect.bottom - charY
                const solidTopEdge = sFallT + sSolidT
                const solidBottomEdge = sFallB + sSolidB
                if (distFromTop < sFallT) {
                    visibility *= sFallT > 0 ? Math.max(0, distFromTop / sFallT) : 0
                } else if (distFromTop < solidTopEdge) {
                    visibility *= 1
                }
                if (distFromBottom < sFallB) {
                    visibility *= sFallB > 0 ? Math.max(0, distFromBottom / sFallB) : 0
                } else if (distFromBottom < solidBottomEdge) {
                    visibility *= 1
                }

                // Cursor hole
                if (visibility > 0 && mouseX > -9000) {
                    const cursorDist = Math.hypot(charCenterX - mouseX, charY - mouseY)
                    if (cursorDist < gradientPx) {
                        visibility *= cursorDist / gradientPx
                    }
                }

                if (visibility > 0.01) zone = 1
            }

            // Fall through to services if strip didn't contribute
            if (zone === 0 && inServices && cursorNearRow) {
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

                if (visibility > 0.01) zone = 2
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

            if (zone === 0) continue

            const isStrip = zone === 1
            const invertRand = isStrip ? stripInvertRandomize : svcInvertRandomize
            const mouseThresh = isStrip ? stripMouseThreshold : svcMouseThreshold
            const scrollThresh = isStrip ? stripScrollThreshold : svcScrollThreshold
            const isMouse = dirtySource === 'mouse'
            const thresh = isMouse ? mouseThresh : scrollThresh
            const centerActive = isMouse !== invertRand
            const randomize = centerActive ? visibility > thresh : visibility < thresh
            if (randomize) rowChars[r][c] = Math.random() < 0.5 ? '0' : '1'
            const ch = rowChars[r][c]

            const useWeight = isStrip ? stripUseWeight : svcUseWeight
            const useOpacity = isStrip ? stripUseOpacity : svcUseOpacity
            const curved = Math.pow(visibility, falloffExponent)
            const alpha = useOpacity ? curved * maxOpacity : maxOpacity

            if (useWeight) {
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
    for (const [, bucket] of buckets) {
        ctx.font = fontString(bucket.weight)
        for (const d of bucket.draws) {
            ctx.globalAlpha = d.alpha
            ctx.fillText(d.ch, d.x, d.y)
        }
    }
    if (draws.length > 0) {
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
})
