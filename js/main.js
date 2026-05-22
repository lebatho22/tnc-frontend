const setupHeaderDocking = () => {
  const topbar = document.querySelector('[data-topbar]')

  if (!topbar) return

  let ticking = false
  const sync = () => {
    document.body.classList.toggle(
      'is-header-docked',
      window.scrollY > 0,
    )
    ticking = false
  }

  const requestSync = () => {
    if (!ticking) {
      window.requestAnimationFrame(sync)
      ticking = true
    }
  }

  window.addEventListener(
    'scroll',
    () => {
      requestSync()
    },
    { passive: true },
  )

  window.addEventListener(
    'resize',
    () => {
      sync()
    },
    { passive: true },
  )

  sync()
}

const setupSearchOverlay = () => {
  const overlay = document.querySelector('[data-search-overlay]')
  const triggers = document.querySelectorAll('.tnc-mobile-search, [data-search-open]')

  if (!overlay || triggers.length === 0) return

  const input = overlay.querySelector('[data-search-input]')
  const closeButtons = overlay.querySelectorAll('[data-search-close]')
  const suggestButtons = overlay.querySelectorAll('[data-search-suggest]')
  const items = overlay.querySelectorAll('[data-search-item]')
  const empty = overlay.querySelector('[data-search-empty]')

  const filterItems = (value = '') => {
    const query = value.trim().toLowerCase()
    let visibleCount = 0

    items.forEach((item) => {
      const haystack = item.dataset.searchItem.toLowerCase()
      const isVisible = query === '' || haystack.includes(query)
      item.hidden = !isVisible
      if (isVisible) visibleCount += 1
    })

    if (empty) {
      empty.classList.toggle('is-visible', visibleCount === 0)
    }
  }

  const openSearch = () => {
    document.body.classList.add('is-search-open')
    overlay.setAttribute('aria-hidden', 'false')
    window.setTimeout(() => input?.focus(), 40)
  }

  const closeSearch = () => {
    document.body.classList.remove('is-search-open')
    overlay.setAttribute('aria-hidden', 'true')
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault()
      openSearch()
    })
  })

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeSearch)
  })

  suggestButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.searchSuggest || ''
      if (input) input.value = value
      filterItems(value)
      input?.focus()
    })
  })

  input?.addEventListener('input', (event) => {
    filterItems(event.target.value)
  })

  overlay.addEventListener('submit', (event) => {
    event.preventDefault()
    filterItems(input?.value || '')
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('is-search-open')) {
      closeSearch()
    }
  })

  filterItems()
}

const setupMoreDrawer = () => {
  const drawer = document.querySelector('[data-more-drawer]')
  const triggers = document.querySelectorAll('[data-more-open]')

  if (!drawer || triggers.length === 0) return

  const closeButtons = drawer.querySelectorAll('[data-more-close]')

  const openMore = () => {
    document.body.classList.add('is-more-open')
    drawer.setAttribute('aria-hidden', 'false')
  }

  const closeMore = () => {
    document.body.classList.remove('is-more-open')
    drawer.setAttribute('aria-hidden', 'true')
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault()
      openMore()
    })
  })

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeMore)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('is-more-open')) {
      closeMore()
    }
  })
}

const setupSearchResultsPage = () => {
  const page = document.querySelector('[data-search-results-page]')

  if (!page) return

  const input = page.querySelector('[data-search-page-input]')
  const items = page.querySelectorAll('[data-search-result-card]')
  const empty = page.querySelector('[data-search-page-empty]')
  const count = page.querySelector('[data-search-page-count]')
  const label = page.querySelector('[data-search-page-label]')

  const filterResults = (value = '') => {
    const query = value.trim().toLowerCase()
    let visibleCount = 0

    items.forEach((item) => {
      const haystack = item.dataset.searchResultCard.toLowerCase()
      const isVisible = query === '' || haystack.includes(query)
      item.hidden = !isVisible
      if (isVisible) visibleCount += 1
    })

    if (empty) empty.classList.toggle('is-visible', visibleCount === 0)
    if (count) count.textContent = `${visibleCount} kết quả`
    if (label) label.textContent = query ? `cho “${value.trim()}”` : 'gợi ý phù hợp'
  }

  const params = new URLSearchParams(window.location.search)
  const query = params.get('s') || ''

  if (input) input.value = query
  filterResults(query)

  input?.addEventListener('input', (event) => {
    filterResults(event.target.value)
  })
}

const setupMegaMenus = () => {
  const nav = document.querySelector('.tnc-nav')

  if (!nav) return

  const pageBase = window.location.pathname.includes('/pages/') ? './' : './pages/'

  const menuTemplates = {
    shop: `
      <div class="tnc-mega-panel" role="menu">
        <p class="tnc-mega-kicker">Bộ sưu tập</p>
        <div class="tnc-mega-grid">
          <a class="tnc-mega-link" href="${pageBase}product-archive.html"><strong>Vòng tay</strong><span>Phỉ thúy bản liền và bản mảnh</span></a>
          <a class="tnc-mega-link" href="${pageBase}product-archive.html"><strong>Nhẫn ngọc</strong><span>Nhẫn phỉ thúy theo size tay</span></a>
          <a class="tnc-mega-link" href="${pageBase}product-archive.html"><strong>Chuỗi hạt</strong><span>Chuỗi cổ tay theo cỡ hạt</span></a>
          <a class="tnc-mega-link" href="${pageBase}product-archive.html"><strong>Mặt bài</strong><span>Mặt ngọc tuyển chọn</span></a>
        </div>
        <div class="tnc-mega-cta">
          <a href="${pageBase}product-archive.html" class="tnc-action-link">Xem cửa hàng →</a>
        </div>
      </div>
    `,
    tools: `
      <div class="tnc-mega-panel" role="menu">
        <p class="tnc-mega-kicker">Công cụ hỗ trợ</p>
        <div class="tnc-mega-grid">
          <a class="tnc-mega-link" href="${pageBase}bracelet-size.html"><strong>Đo size vòng tay</strong><span>Chọn vòng vừa cổ tay</span></a>
          <a class="tnc-mega-link" href="${pageBase}ring-size.html"><strong>Đo size nhẫn</strong><span>Quy đổi VN, US, JP, HK</span></a>
          <a class="tnc-mega-link" href="${pageBase}bead-calculator.html"><strong>Tính số hạt</strong><span>Tính chuỗi theo cỡ hạt</span></a>
          <a class="tnc-mega-link" href="${pageBase}size-tools.html"><strong>Bộ công cụ</strong><span>Tất cả công cụ đo size</span></a>
        </div>
        <div class="tnc-mega-cta">
          <a href="${pageBase}size-tools.html" class="tnc-action-link">Mở công cụ →</a>
        </div>
      </div>
    `,
  }

  const enhanceLink = (link, template) => {
    if (!link || link.closest('.tnc-nav-item')) return

    const wrapper = document.createElement('div')
    wrapper.className = 'tnc-nav-item'
    link.parentNode.insertBefore(wrapper, link)
    wrapper.appendChild(link)
    wrapper.insertAdjacentHTML('beforeend', template)
  }

  const links = [...nav.querySelectorAll('.tnc-nav-link')]

  enhanceLink(
    links.find((link) => link.getAttribute('href')?.includes('size-tools')),
    menuTemplates.tools,
  )
  enhanceLink(
    links.find((link) => link.getAttribute('href')?.includes('product-archive')),
    menuTemplates.shop,
  )
}

setupHeaderDocking()
setupSearchOverlay()
setupMoreDrawer()
setupSearchResultsPage()
setupMegaMenus()

const heroSlider = document.querySelector('[data-hero-slider]')

if (heroSlider) {
  const slides = [...heroSlider.querySelectorAll('.tnc-hero-slide')]
  const dots = [...document.querySelectorAll('[data-hero-dot]')]
  const prevButton = document.querySelector('[data-hero-prev]')
  const nextButton = document.querySelector('[data-hero-next]')
  let currentSlide = 0
  let timerId

  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === currentSlide)
    })

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === currentSlide)
    })
  }

  const startAutoplay = () => {
    timerId = window.setInterval(() => {
      showSlide(currentSlide + 1)
    }, 5200)
  }

  const restartAutoplay = () => {
    window.clearInterval(timerId)
    startAutoplay()
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.heroDot))
      restartAutoplay()
    })
  })

  prevButton?.addEventListener('click', () => {
    showSlide(currentSlide - 1)
    restartAutoplay()
  })

  nextButton?.addEventListener('click', () => {
    showSlide(currentSlide + 1)
    restartAutoplay()
  })

  startAutoplay()
}

const productTabs = document.querySelector('[data-product-tabs]')

if (productTabs) {
  const tabs = [...productTabs.querySelectorAll('[data-product-tab]')]
  const panels = [...productTabs.querySelectorAll('.tnc-product-panel')]
  const accordionItems = [
    ...productTabs.querySelectorAll('.tnc-product-accordion-item'),
  ]

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.productTab

      tabs.forEach((item) => {
        const isActive = item === tab
        item.classList.toggle('is-active', isActive)
        item.setAttribute('aria-selected', String(isActive))
      })

      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.id === targetId)
      })
    })
  })

  accordionItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return

      accordionItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false
        }
      })

      window.requestAnimationFrame(() => {
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    })
  })
}

const braceletTool = document.querySelector('[data-bracelet-tool]')

if (braceletTool) {
  const tabs = [...braceletTool.querySelectorAll('[data-bracelet-tab]')]
  const panels = [...braceletTool.querySelectorAll('[data-bracelet-panel]')]
  const resultSection = document.querySelector('[data-bracelet-result]')
  const resultRange = document.querySelector('[data-result-range]')
  const resultTight = document.querySelector('[data-result-tight]')
  const resultComfy = document.querySelector('[data-result-comfy]')
  const resultMain = document.querySelector('[data-result-main]')

  const setResult = (size) => {
    const tight = Math.max(48, Math.round(size - 1))
    const comfy = Math.max(tight + 1, Math.round(size + 1))

    resultRange.textContent = `${tight} – ${comfy}`
    resultTight.textContent = `${tight}mm`
    resultComfy.textContent = `${comfy}mm`
    resultMain.textContent = String(comfy)
  }

  const estimateSize = (panelId, form) => {
    if (panelId === 'body') {
      const weight = Number(form.elements.weight?.value || 0)
      const height = Number(form.elements.height?.value || 0)

      if (!weight || !height) return 56

      return Math.min(64, Math.max(50, Math.round(weight * 0.32 + height * 0.22)))
    }

    const measurement = Number(form.elements.measurement?.value || 0)

    if (!measurement) return 56

    if (panelId === 'palm-width') return Math.round(measurement * 0.78)
    if (panelId === 'wrist') return Math.round(measurement / 2.85)

    return Math.round(measurement / 3.35)
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.braceletTab

      tabs.forEach((item) => {
        const isActive = item === tab
        item.classList.toggle('is-active', isActive)
        item.setAttribute('aria-selected', String(isActive))
      })

      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.braceletPanel === targetId)
      })
    })
  })

  braceletTool.querySelectorAll('[data-bracelet-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()

      const panel = form.closest('[data-bracelet-panel]')
      const size = estimateSize(panel.dataset.braceletPanel, form)

      setResult(size)
      resultSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })
}

const beadTool = document.querySelector('[data-bead-tool]')

if (beadTool) {
  const form = beadTool.querySelector('[data-bead-form]')
  const resultSection = document.querySelector('[data-bead-result]')
  const wristLabel = document.querySelector('[data-bead-wrist-label]')
  const beadSizeLabel = document.querySelector('[data-bead-size-label]')
  const tight = document.querySelector('[data-bead-tight]')
  const best = document.querySelector('[data-bead-best]')
  const loose = document.querySelector('[data-bead-loose]')
  const tightLength = document.querySelector('[data-bead-tight-length]')
  const bestLength = document.querySelector('[data-bead-best-length]')
  const looseLength = document.querySelector('[data-bead-loose-length]')

  const formatCm = (value) => `${value.toFixed(1).replace('.0', '')} cm`
  const formatDelta = (value) => {
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}cm so với chu vi của bạn`
  }

  const setBeadResult = (wristCm, beadMm) => {
    const targetLengthMm = wristCm * 10
    const bestCount = Math.max(1, Math.round(targetLengthMm / beadMm))
    const counts = [Math.max(1, bestCount - 1), bestCount, bestCount + 1]
    const lengths = counts.map((count) => (count * beadMm) / 10)

    wristLabel.textContent = `${wristCm.toString().replace('.', ',')}cm`
    beadSizeLabel.textContent = `hạt ${beadMm.toString().replace('.', ',')}mm`
    tight.textContent = String(counts[0])
    best.textContent = String(counts[1])
    loose.textContent = String(counts[2])
    tightLength.textContent = formatCm(lengths[0])
    bestLength.textContent = formatCm(lengths[1])
    looseLength.textContent = formatCm(lengths[2])

    document
      .querySelectorAll('.tnc-bead-result-options small')
      .forEach((item, index) => {
        item.textContent = formatDelta(lengths[index] - wristCm)
      })
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault()

    const wristCm = Number(form.elements.wrist?.value || 15)
    const beadMm = Number(form.elements.bead?.value || 10)

    if (!wristCm || !beadMm) return

    setBeadResult(wristCm, beadMm)
    resultSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

const ringTool = document.querySelector('[data-ring-tool]')

if (ringTool) {
  const tabs = [...ringTool.querySelectorAll('[data-ring-tab]')]
  const panels = [...ringTool.querySelectorAll('[data-ring-panel]')]
  const modeButtons = [...ringTool.querySelectorAll('[data-ring-mode]')]
  const label = ringTool.querySelector('[data-ring-label]')
  const help = ringTool.querySelector('[data-ring-help]')
  const unit = ringTool.querySelector('[data-ring-unit]')
  let currentMode = 'diameter'

  const sizeRows = [
    { diameter: 14, circumference: 44, vn: 4, us: 3, jp: 4, hk: 6 },
    { diameter: 14.5, circumference: 45.5, vn: 5, us: 3.5, jp: 5, hk: 7 },
    { diameter: 15, circumference: 47.1, vn: 6, us: 4, jp: 7, hk: 8 },
    { diameter: 15.5, circumference: 48.7, vn: 7, us: 4.5, jp: 8, hk: 9 },
    { diameter: 16, circumference: 50.3, vn: 8, us: 5, jp: 9, hk: 10 },
    { diameter: 16.5, circumference: 51.9, vn: 9, us: 5.5, jp: 10, hk: 11 },
    { diameter: 17, circumference: 53.4, vn: 10, us: 6, jp: 12, hk: 12 },
    { diameter: 17.5, circumference: 55, vn: 11, us: 6.5, jp: 13, hk: 13 },
    { diameter: 18, circumference: 56.6, vn: 12, us: 7, jp: 14, hk: 14 },
    { diameter: 18.5, circumference: 58.1, vn: 13, us: 7.5, jp: 15, hk: 15 },
    { diameter: 19, circumference: 59.7, vn: 14, us: 8, jp: 16, hk: 16 },
    { diameter: 19.5, circumference: 61.3, vn: 15, us: 8.5, jp: 17, hk: 17 },
    { diameter: 20, circumference: 62.8, vn: 16, us: 9, jp: 18, hk: 18 },
    { diameter: 20.5, circumference: 64.4, vn: 17, us: 9.5, jp: 19, hk: 19 },
    { diameter: 21, circumference: 66, vn: 18, us: 10, jp: 20, hk: 20 },
    { diameter: 21.5, circumference: 67.6, vn: 19, us: 10.5, jp: 21, hk: 21 },
  ]

  const findNearest = (value, mode) =>
    sizeRows.reduce((nearest, row) =>
      Math.abs(row[mode] - value) < Math.abs(nearest[mode] - value) ? row : nearest,
    )

  const updateRingResult = (row) => {
    const rowIndex = sizeRows.indexOf(row)
    const smaller = sizeRows[Math.max(0, rowIndex - 1)]
    const larger = sizeRows[Math.min(sizeRows.length - 1, rowIndex + 1)]

    document.querySelector('[data-ring-measurement]').textContent = `${row.circumference} mm`
    document.querySelector('.tnc-ring-result-panel h2 small').textContent = `(≈ ø${row.diameter}mm)`
    document.querySelector('[data-ring-smaller]').textContent = smaller.vn
    document.querySelector('[data-ring-best]').textContent = row.vn
    document.querySelector('[data-ring-larger]').textContent = larger.vn
    document.querySelector('[data-ring-smaller-meta]').textContent = `Ø${smaller.diameter}mm`
    document.querySelector('[data-ring-best-meta]').textContent = `Ø${row.diameter}mm`
    document.querySelector('[data-ring-larger-meta]').textContent = `Ø${larger.diameter}mm`
    document.querySelector('[data-ring-vn]').textContent = row.vn
    document.querySelector('[data-ring-us]').textContent = row.us
    document.querySelector('[data-ring-jp]').textContent = row.jp
    document.querySelector('[data-ring-hk]').textContent = row.hk
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.ringTab

      tabs.forEach((item) => {
        const isActive = item === tab
        item.classList.toggle('is-active', isActive)
        item.setAttribute('aria-selected', String(isActive))
      })

      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.ringPanel === targetId)
      })
    })
  })

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentMode = button.dataset.ringMode
      modeButtons.forEach((item) => item.classList.toggle('is-active', item === button))

      label.textContent =
        currentMode === 'diameter' ? 'Đường kính trong của nhẫn' : 'Chu vi trong của nhẫn'
      help.textContent =
        currentMode === 'diameter' ? 'Thường từ 14.0 - 21.5mm' : 'Thường từ 44 - 68mm'
      unit.textContent = 'mm'
    })
  })

  ringTool.querySelectorAll('[data-ring-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()

      const panel = form.closest('[data-ring-panel]')
      const value = Number(form.elements.measurement?.value || 0)
      const mode = panel.dataset.ringPanel === 'finger' ? 'circumference' : currentMode

      if (!value) return

      updateRingResult(findNearest(value, mode))
      document
        .querySelector('[data-ring-result]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })
}
