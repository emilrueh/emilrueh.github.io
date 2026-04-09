if (window.innerWidth > 768) {
    document.addEventListener('DOMContentLoaded', function () {
        var container = document.createElement('div')
        container.className = 'tradingview-widget-container'

        var widgetDiv = document.createElement('div')
        widgetDiv.className = 'tradingview-widget-container__widget'

        var copyright = document.createElement('div')
        copyright.className = 'tradingview-widget-copyright'
        copyright.innerHTML = '<a href="https://www.tradingview.com/markets/" rel="noopener nofollow" target="_blank"><span class="blue-text">World markets</span></a> by TradingView'

        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js'
        script.async = true
        script.textContent = JSON.stringify({
            lineWidth: 12,
            lineType: 2,
            chartType: 'candlesticks',
            showVolume: false,
            fontColor: 'rgb(106, 109, 120)',
            gridLineColor: 'rgba(242, 242, 242, 0.0)',
            volumeUpColor: 'rgba(34, 171, 148, 0.0)',
            volumeDownColor: 'rgba(247, 82, 95, 0.0)',
            backgroundColor: '#0F0F0F',
            widgetFontColor: '#DBDBDB',
            upColor: '#54b0ff',
            downColor: '#54b0ff',
            borderUpColor: '#54b0ff',
            borderDownColor: '#54b0ff',
            wickUpColor: '#54b0ff',
            wickDownColor: '#54b0ff',
            colorTheme: 'dark',
            isTransparent: true,
            locale: 'en',
            chartOnly: true,
            scalePosition: 'no',
            scaleMode: 'Logarithmic',
            fontFamily: 'Trattatello, fantasy',
            valuesTracking: '0',
            changeMode: 'price-and-percent',
            symbols: [
                ['COINBASE:BTCUSD|1Y|USD'],
                ['COINBASE:SOLUSD|1Y|USD'],
                ['COINBASE:ADAUSD|1Y|USD'],
                ['BITSTAMP:ETHUSD|1Y|USD'],
                ['OANDA:XAGUSD|1Y|USD'],
                ['OANDA:XAUUSD|1Y|USD'],
                ['NASDAQ:ACWI|1Y|USD'],
                ['NASDAQ:TSLA|1Y|USD'],
                ['NASDAQ:MSFT|1Y|USD'],
                ['NASDAQ:GOOGL|1Y|USD'],
                ['NASDAQ:NFLX|1Y|USD'],
                ['NASDAQ:AMZN|1Y|USD'],
                ['NASDAQ:AAPL|1Y|USD'],
                ['NASDAQ:NVDA|1Y|USD'],
                ['NASDAQ:AMD|1Y|USD'],
                ['NASDAQ:META|1Y|USD']
            ],
            dateRanges: ['1d|1', '1m|30', '3m|60', '12m|1D', '60m|1W', 'all|1M'],
            fontSize: '12',
            headerFontSize: 'small',
            autosize: true,
            dateFormat: 'MMM dd, yyyy',
            width: '101%',
            height: '99%',
            noTimeScale: true,
            hideDateRanges: false,
            showMA: false,
            maLength: '5',
            maLineColor: 'rgba(84, 176, 255, 1.0)',
            maLineWidth: 3,
            hideMarketStatus: false,
            hideSymbolLogo: false
        })

        container.appendChild(widgetDiv)
        container.appendChild(copyright)
        container.appendChild(script)

        var hero = document.getElementById('hero')
        hero.insertBefore(container, hero.firstChild)
    })
}
