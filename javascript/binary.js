if (window.innerWidth <= 768) throw new Error('Mobile: binary effect disabled')

// --- Config ---
const fontSize = 12
const lineHeight = 14
const maxWeight = 1000
const minWeight = 100
const weightBuckets = 10

// About zone
const aboutColor = '#ffffff'
const aboutGradientChars = 42
const aboutMaxOpacity = 0.6
const aboutFalloffExponent = 2
const aboutMouseThreshold = 0.3
const aboutScrollThreshold = 0.6
const aboutInvertRandomize = false
const aboutUseWeight = false
const aboutUseOpacity = true
const aboutSolidLeft = 0
const aboutSolidRight = 0
const aboutFalloffLeft = 40
const aboutFalloffRight = 30
const aboutFalloffTop = 50
const aboutFalloffBottom = 80

// Services zone
const svcColor = '#ffffff'
const svcGradientChars = 13
const svcMaxOpacity = 0.5
const svcFalloffExponent = 1.1
const svcFadeTopChars = 30
const svcFadeBottomChars = 30
const svcMouseThreshold = 0.5
const svcScrollThreshold = 0.5
const svcInvertRandomize = true
const svcUseWeight = true
const svcUseOpacity = true
const svcCardPadding = 12
const svcCardFalloff = 0.9
const svcIconRadius = 16
const svcIconFalloff = 1

// CTA zone
const ctaColor = '#003a5c'
const ctaGradientChars = 50
const ctaMaxOpacity = 0.6
const ctaFalloffExponent = 2
const ctaFadeTopChars = 6
const ctaFadeBottomChars = 9
const ctaMouseThreshold = 0.6
const ctaScrollThreshold = 0.5
const ctaInvertRandomize = true
const ctaUseWeight = false
const ctaUseOpacity = true
const ctaShapeRX = 50
const ctaShapeRY = 20
const ctaShapeFalloff = 0.9

// Footer zone
const footerColor = '#ffffff'
const footerGradientChars = 40
const footerMaxOpacity = 1
const footerFalloffExponent = 1.1
const footerFadeTopChars = 30
const footerFadeBottomChars = 30
const footerMouseThreshold = 0.2
const footerScrollThreshold = 0.2
const footerInvertRandomize = true
const footerUseWeight = false
const footerUseOpacity = true
const footerShapeRadius = 50
const footerShapeFalloff = 0.6

// Ripple
const rippleSpeed = 100
const rippleWidth = 100
const rippleDuration = 3000
const rippleSoftOuter = false

// --- Canvas setup ---
const canvas = document.createElement('canvas')
canvas.id = 'binary-canvas'
const ctx = canvas.getContext('2d')
document.body.prepend(canvas)

const ctaCanvas = document.createElement('canvas')
ctaCanvas.id = 'cta-binary-canvas'
ctaCanvas.style.cssText = 'position:absolute;top:0;left:0;z-index:0;pointer-events:none'
const ctaCtx = ctaCanvas.getContext('2d')

const aboutCanvas = document.createElement('canvas')
aboutCanvas.id = 'about-binary-canvas'
aboutCanvas.style.cssText = 'position:absolute;top:0;left:0;z-index:-1;pointer-events:none'
const aboutCtx = aboutCanvas.getContext('2d')

let dpr = window.devicePixelRatio || 1
let viewW, viewH, charW, cols, rows
let aboutGradientPx, svcGradientPx, ctaGradientPx, footerGradientPx
let svcFadeTopPx, svcFadeBottomPx
let ctaFadeTopPx, ctaFadeBottomPx, footerFadeTopPx, footerFadeBottomPx
let aSolidL, aSolidR, aFallL, aFallR, aFallT, aFallB
let ctaShapeRXPx, ctaShapeRYPx, footerShapeRadiusPx, svcCardPaddingPx, svcIconRadiusPx

// --- Grid storage ---
let rowChars = []
let aboutRowChars = []
let aboutRows = 0
let aboutH = 0
let aboutColBound = 0

// --- State ---
let mouseX = -9999, mouseY = -9999
let lastScrollY = -1
let dirty = true
let dirtySource = 'init'
let ripples = []

// --- Element references ---
let aboutEl, servicesEl, contactEl, footerEl, ctaContentEl
let svcCardInfoEls = []
let svcCardImageEls = []

function fontString(weight) {
    return `${weight} ${fontSize}px "Chivo Mono"`
}

// --- Draw helper ---
function drawZone(targetCtx, color, buckets, flatDraws) {
    targetCtx.fillStyle = color
    for (const [, bucket] of buckets) {
        targetCtx.font = fontString(bucket.weight)
        for (const d of bucket.draws) {
            targetCtx.globalAlpha = d.alpha
            targetCtx.fillText(d.ch, d.x, d.y)
        }
    }
    if (flatDraws.length > 0) {
        targetCtx.font = fontString(maxWeight)
        for (const d of flatDraws) {
            targetCtx.globalAlpha = d.alpha
            targetCtx.fillText(d.ch, d.x, d.y)
        }
    }
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
    aboutGradientPx = aboutGradientChars * charW
    svcGradientPx = svcGradientChars * charW
    ctaGradientPx = ctaGradientChars * charW
    footerGradientPx = footerGradientChars * charW
    svcFadeTopPx = svcFadeTopChars * charW
    svcFadeBottomPx = svcFadeBottomChars * charW
    ctaFadeTopPx = ctaFadeTopChars * charW
    ctaFadeBottomPx = ctaFadeBottomChars * charW
    footerFadeTopPx = footerFadeTopChars * charW
    footerFadeBottomPx = footerFadeBottomChars * charW
    aSolidL = aboutSolidLeft * charW
    aSolidR = aboutSolidRight * charW
    aFallL = aboutFalloffLeft * charW
    aFallR = aboutFalloffRight * charW
    aFallT = aboutFalloffTop * charW
    aFallB = aboutFalloffBottom * charW
    aboutColBound = Math.ceil((aFallL + aSolidL + aSolidR + aFallR) / charW)
    ctaShapeRXPx = ctaShapeRX * charW
    ctaShapeRYPx = ctaShapeRY * charW
    footerShapeRadiusPx = footerShapeRadius * charW
    svcCardPaddingPx = svcCardPadding * charW
    svcIconRadiusPx = svcIconRadius * charW
    svcCardInfoEls = document.querySelectorAll('.service-card__info')
    svcCardImageEls = document.querySelectorAll('.service-card__image')

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
    footerEl = document.querySelector('.footer')
    ctaContentEl = contactEl ? contactEl.querySelector('.container') : null

    if (contactEl && !ctaCanvas.parentElement) {
        contactEl.appendChild(ctaCanvas)
    }
    ctaCanvas.width = viewW * dpr
    ctaCanvas.height = viewH * dpr
    ctaCanvas.style.width = viewW + 'px'
    ctaCanvas.style.height = viewH + 'px'
    ctaCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

    if (aboutEl) {
        aboutH = aboutEl.offsetHeight
        aboutRows = Math.ceil(aboutH / lineHeight)
        aboutCanvas.width = viewW * dpr
        aboutCanvas.height = aboutH * dpr
        aboutCanvas.style.width = viewW + 'px'
        aboutCanvas.style.height = aboutH + 'px'
        aboutCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
        if (!aboutCanvas.parentElement) aboutEl.appendChild(aboutCanvas)
        aboutRowChars = []
        for (let r = 0; r < aboutRows; r++) {
            const chars = []
            for (let c = 0; c < cols; c++) {
                chars.push(Math.random() < 0.5 ? '0' : '1')
            }
            aboutRowChars.push(chars)
        }
    }

    dirty = true
}

// --- Render frame ---
function render() {
    ctx.clearRect(0, 0, viewW, viewH)
    ctaCtx.clearRect(0, 0, viewW, viewH)

    if (!aboutEl || !servicesEl || !contactEl) return

    const aboutRect = aboutEl.getBoundingClientRect()
    const servicesRect = servicesEl.getBoundingClientRect()
    const contactRect = contactEl.getBoundingClientRect()
    const contactTop = contactRect.top
    const footerRect = footerEl ? footerEl.getBoundingClientRect() : null
    const ctaContentRect = ctaContentEl ? ctaContentEl.getBoundingClientRect() : null
    const vh15 = viewH * 0.15
    const aboutTotalPx = aFallL + aSolidL + aSolidR + aFallR

    // Reposition CTA canvas to align with viewport
    ctaCanvas.style.top = (-contactTop) + 'px'

    // CTA oval center
    const ctaCX = ctaContentRect ? ctaContentRect.left + ctaContentRect.width / 2 : viewW / 2
    const ctaCY = ctaContentRect ? ctaContentRect.top + ctaContentRect.height / 2 : contactTop + contactRect.height / 2

    // Footer half-circle center (bottom center)
    const footerCX = viewW / 2
    const footerCY = footerRect ? footerRect.bottom : viewH

    // --- About zone (section-local canvas, scrolls with DOM) ---
    aboutCtx.clearRect(0, 0, aboutTotalPx, aboutH)
    const visibleTop = Math.max(0, -aboutRect.top)
    const visibleBottom = Math.min(aboutH, viewH - aboutRect.top)
    if (visibleBottom > visibleTop) {
        const startRow = Math.max(0, Math.floor(visibleTop / lineHeight))
        const endRow = Math.min(aboutRows, Math.ceil(visibleBottom / lineHeight))
        const localMouseY = mouseY - aboutRect.top

        const aboutBuckets = new Map()
        const aboutDraws = []

        for (let r = startRow; r < endRow; r++) {
            const y = r * lineHeight + fontSize
            const charY = r * lineHeight + lineHeight / 2
            const cursorNearRow = mouseX > -9000 &&
                Math.abs(charY - localMouseY) < aboutGradientPx

            for (let c = 0; c < aboutColBound; c++) {
                const charCenterX = c * charW + charW / 2

                let visibility = 0
                const solidR = aFallL + aSolidL + aSolidR
                if (charCenterX < aFallL) {
                    visibility = aFallL > 0 ? charCenterX / aFallL : 1
                } else if (charCenterX <= solidR) {
                    visibility = 1
                } else {
                    visibility = aFallR > 0 ? 1 - (charCenterX - solidR) / aFallR : 0
                }

                // Vertical fades (section-local coords)
                if (charY < aFallT) {
                    visibility *= aFallT > 0 ? Math.max(0, charY / aFallT) : 0
                }
                const distFromBottom = aboutH - charY
                if (distFromBottom < aFallB) {
                    visibility *= aFallB > 0 ? Math.max(0, distFromBottom / aFallB) : 0
                }

                // Cursor hole
                if (visibility > 0 && cursorNearRow) {
                    const cursorDist = Math.hypot(charCenterX - mouseX, charY - localMouseY)
                    if (cursorDist < aboutGradientPx) {
                        visibility *= cursorDist / aboutGradientPx
                    }
                }

                // Ripple suppression (convert to section-local)
                for (const rip of ripples) {
                    const dist = Math.hypot(charCenterX - rip.x, charY - (rip.y - aboutRect.top))
                    if (dist < rip.radius) {
                        const behind = rip.radius - dist
                        if (behind < rippleWidth) {
                            visibility *= (behind / rippleWidth) + (1 - behind / rippleWidth) * (1 - rip.strength)
                        }
                    } else if (rippleSoftOuter) {
                        const ahead = dist - rip.radius
                        if (ahead < rippleWidth) {
                            visibility *= (ahead / rippleWidth) + (1 - ahead / rippleWidth) * (1 - rip.strength)
                        }
                    }
                }

                if (visibility <= 0.01) continue

                const isMouse = dirtySource === 'mouse'
                const thresh = isMouse ? aboutMouseThreshold : aboutScrollThreshold
                const centerActive = isMouse !== aboutInvertRandomize
                const randomize = centerActive ? visibility > thresh : visibility < thresh
                if (randomize) aboutRowChars[r][c] = Math.random() < 0.5 ? '0' : '1'
                const ch = aboutRowChars[r][c]

                const curved = Math.pow(visibility, aboutFalloffExponent)
                const alpha = aboutUseOpacity ? curved * aboutMaxOpacity : aboutMaxOpacity

                if (aboutUseWeight) {
                    const wStep = Math.min(Math.floor(curved * weightBuckets), weightBuckets - 1)
                    if (!aboutBuckets.has(wStep)) {
                        const weight = Math.round(minWeight + (maxWeight - minWeight) * (wStep / (weightBuckets - 1)))
                        aboutBuckets.set(wStep, { weight, draws: [] })
                    }
                    aboutBuckets.get(wStep).draws.push({ ch, x: c * charW, y, alpha })
                } else {
                    aboutDraws.push({ ch, x: c * charW, y, alpha })
                }
            }
        }

        drawZone(aboutCtx, aboutColor, aboutBuckets, aboutDraws)
        aboutCtx.globalAlpha = 1
    }

    // --- Services, CTA, Footer zones (viewport-fixed canvas) ---
    const svcBuckets = new Map()
    const svcDraws = []
    const ctaBuckets = new Map()
    const ctaDraws = []
    const footerBuckets = new Map()
    const footerDraws = []
    const servicesBottom = Math.max(servicesRect.bottom, contactTop + vh15)

    // Cache service card rects for this frame
    const svcCardRects = []
    for (const el of svcCardInfoEls) {
        const r = el.getBoundingClientRect()
        svcCardRects.push({
            cx: (r.left + r.right) / 2,
            cy: (r.top + r.bottom) / 2,
            hw: (r.right - r.left) / 2 + svcCardPaddingPx,
            hh: (r.bottom - r.top) / 2 + svcCardPaddingPx
        })
    }
    const svcIconCircles = []
    for (const el of svcCardImageEls) {
        const r = el.getBoundingClientRect()
        svcIconCircles.push({
            cx: (r.left + r.right) / 2,
            cy: (r.top + r.bottom) / 2
        })
    }

    for (let r = 0; r < rows; r++) {
        const y = r * lineHeight + fontSize
        const rowTop = r * lineHeight
        const rowBottom = rowTop + lineHeight
        const charY = rowTop + lineHeight / 2

        const inServices = rowBottom > servicesRect.top && rowTop < servicesBottom
        const inCta = rowBottom > contactTop && rowTop < contactRect.bottom
        const inFooter = footerRect && rowBottom > footerRect.top && rowTop < footerRect.bottom

        if (!inServices && !inCta && !inFooter) continue

        const maxRadius = Math.max(svcGradientPx, ctaGradientPx, footerGradientPx)
        const cursorNearRow = mouseX > -9000 &&
            Math.max(rowTop - mouseY, 0, mouseY - rowBottom) < maxRadius

        if (!cursorNearRow) continue

        for (let c = 0; c < cols; c++) {
            const charCenterX = c * charW + charW / 2

            let visibility = 0
            let zone = 0 // 0 = none, 2 = services, 3 = cta, 4 = footer

            if (inServices) {
                const cursorDist = Math.hypot(charCenterX - mouseX, charY - mouseY)
                if (cursorDist < svcGradientPx) {
                    visibility = 1 - cursorDist / svcGradientPx
                }

                const distFromTop = charY - servicesRect.top
                if (distFromTop <= 0) {
                    visibility = 0
                } else if (distFromTop < svcFadeTopPx) {
                    visibility *= distFromTop / svcFadeTopPx
                }

                const diagY = contactTop + vh15 * (1 - charCenterX / viewW)
                const distAbove = diagY - charY
                if (distAbove <= 0) {
                    visibility = 0
                } else if (distAbove < svcFadeBottomPx) {
                    visibility *= distAbove / svcFadeBottomPx
                }

                // Service card text exclusion zones (ovals)
                if (visibility > 0.01) {
                    for (const cr of svcCardRects) {
                        const dx = (charCenterX - cr.cx) / cr.hw
                        const dy = (charY - cr.cy) / cr.hh
                        const nd = Math.hypot(dx, dy)
                        if (nd < 1) {
                            const inner = 1 - svcCardFalloff
                            if (nd < inner) { visibility = 0; break }
                            else visibility *= (nd - inner) / svcCardFalloff
                        }
                    }
                }

                // Service card icon exclusion zones (circles)
                if (visibility > 0.01) {
                    for (const ic of svcIconCircles) {
                        const nd = Math.hypot(charCenterX - ic.cx, charY - ic.cy) / svcIconRadiusPx
                        if (nd < 1) {
                            const inner = 1 - svcIconFalloff
                            if (nd < inner) { visibility = 0; break }
                            else visibility *= (nd - inner) / svcIconFalloff
                        }
                    }
                }

                if (visibility > 0.01) zone = 2
            }

            if (zone === 0 && inCta) {
                const cursorDist = Math.hypot(charCenterX - mouseX, charY - mouseY)
                if (cursorDist < ctaGradientPx) {
                    visibility = 1 - cursorDist / ctaGradientPx

                    const diagY = contactTop + vh15 * (1 - charCenterX / viewW)
                    const distBelow = charY - diagY
                    if (distBelow <= 0) visibility = 0
                    else if (distBelow < ctaFadeTopPx) visibility *= distBelow / ctaFadeTopPx

                    const distFromBottom = contactRect.bottom - charY
                    if (distFromBottom <= 0) visibility = 0
                    else if (distFromBottom < ctaFadeBottomPx) visibility *= distFromBottom / ctaFadeBottomPx

                    const dx = (charCenterX - ctaCX) / ctaShapeRXPx
                    const dy = (charY - ctaCY) / ctaShapeRYPx
                    const nd = Math.hypot(dx, dy)
                    if (nd < 1) {
                        const inner = 1 - ctaShapeFalloff
                        if (nd < inner) visibility = 0
                        else visibility *= (nd - inner) / ctaShapeFalloff
                    }

                    if (visibility > 0.01) zone = 3
                }
            }

            if (zone === 0 && inFooter) {
                const cursorDist = Math.hypot(charCenterX - mouseX, charY - mouseY)
                if (cursorDist < footerGradientPx) {
                    visibility = 1 - cursorDist / footerGradientPx

                    const distFromTop = charY - footerRect.top
                    if (distFromTop <= 0) {
                        visibility = 0
                    } else if (distFromTop < footerFadeTopPx) {
                        visibility *= distFromTop / footerFadeTopPx
                    }

                    const distFromBottom = footerRect.bottom - charY
                    if (distFromBottom <= 0) {
                        visibility = 0
                    } else if (distFromBottom < footerFadeBottomPx) {
                        visibility *= distFromBottom / footerFadeBottomPx
                    }

                    const dist = Math.hypot(charCenterX - footerCX, charY - footerCY)
                    const nd = dist / footerShapeRadiusPx
                    if (nd < 1) {
                        const inner = 1 - footerShapeFalloff
                        if (nd < inner) visibility = 0
                        else visibility *= (nd - inner) / footerShapeFalloff
                    }

                    if (visibility > 0.01) zone = 4
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
                } else if (rippleSoftOuter) {
                    const ahead = dist - rip.radius
                    if (ahead < rippleWidth) {
                        visibility *= (ahead / rippleWidth) + (1 - ahead / rippleWidth) * (1 - rip.strength)
                    }
                }
            }

            if (zone === 0) continue

            const isCta = zone === 3
            const isFooter = zone === 4
            const invertRand = isFooter ? footerInvertRandomize : isCta ? ctaInvertRandomize : svcInvertRandomize
            const mouseThresh = isFooter ? footerMouseThreshold : isCta ? ctaMouseThreshold : svcMouseThreshold
            const scrollThresh = isFooter ? footerScrollThreshold : isCta ? ctaScrollThreshold : svcScrollThreshold
            const isMouse = dirtySource === 'mouse'
            const thresh = isMouse ? mouseThresh : scrollThresh
            const centerActive = isMouse !== invertRand
            const randomize = centerActive ? visibility > thresh : visibility < thresh
            if (randomize) rowChars[r][c] = Math.random() < 0.5 ? '0' : '1'
            const ch = rowChars[r][c]

            const useWeight = isFooter ? footerUseWeight : isCta ? ctaUseWeight : svcUseWeight
            const useOpacity = isFooter ? footerUseOpacity : isCta ? ctaUseOpacity : svcUseOpacity
            const exponent = isFooter ? footerFalloffExponent : isCta ? ctaFalloffExponent : svcFalloffExponent
            const curved = Math.pow(visibility, exponent)
            const zoneOpacity = isFooter ? footerMaxOpacity : isCta ? ctaMaxOpacity : svcMaxOpacity
            const alpha = useOpacity ? curved * zoneOpacity : zoneOpacity

            const targetBuckets = isCta ? ctaBuckets : isFooter ? footerBuckets : svcBuckets
            const targetDraws = isCta ? ctaDraws : isFooter ? footerDraws : svcDraws

            if (useWeight) {
                const wStep = Math.min(Math.floor(curved * weightBuckets), weightBuckets - 1)
                if (!targetBuckets.has(wStep)) {
                    const weight = Math.round(minWeight + (maxWeight - minWeight) * (wStep / (weightBuckets - 1)))
                    targetBuckets.set(wStep, { weight, draws: [] })
                }
                targetBuckets.get(wStep).draws.push({ ch, x: c * charW, y, alpha })
            } else {
                targetDraws.push({ ch, x: c * charW, y, alpha })
            }
        }
    }

    drawZone(ctx, svcColor, svcBuckets, svcDraws)
    drawZone(ctaCtx, ctaColor, ctaBuckets, ctaDraws)
    drawZone(ctx, footerColor, footerBuckets, footerDraws)
    ctx.globalAlpha = 1
    ctaCtx.globalAlpha = 1
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
