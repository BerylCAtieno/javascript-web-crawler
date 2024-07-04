const { JSDOM }  = require('jsdom')

async function crawlPage(baseURL, currentURL = baseURL, pages= {}) {
  
  baseURLObj = new URL(baseURL)
  currentURLObj = new URL(currentURL)

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages
  }

  const normalizedCurrentURL = normalizeURL(currentURL)

  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++
    return pages
  }
  pages[normalizedCurrentURL] = 1
  
  console.log(`=====actively crawling ${currentURL}=====`)
  let html = ''
  try {
    html = await fetchHTML(currentURL)
  } catch (err) {
    console.log(`${err.message}`)
    return pages
  }

  // recur through the page's links
  const nextURLs = getURLsFromHTML(html, baseURL)
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages)
  }

  return pages
}

function getURLsFromHTML(html, baseURL) {
    const urls = []
    const dom = new JSDOM(html)
    const anchors = dom.window.document.querySelectorAll('a')
  
    for (const anchor of anchors) {
      if (anchor.hasAttribute('href')) {
        let href = anchor.getAttribute('href')
  
        try {
          // convert any relative URLs to absolute URLs
          href = new URL(href, baseURL).href
          urls.push(href)
        } catch(err) {
          console.log(`${err.message}: ${href}`)
        }
      }
    }
  
    return urls
  }

function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`

    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    } else {
        return hostPath
    }
}

async function fetchHTML(url) {
  let response
  try {
    response = await fetch(url)
  } catch (err) {
    throw new Error(`Got Network error: ${err.message}`)
  }

  if (response.status > 399) {
    throw new Error(`Got HTTP error: ${response.status} ${response.statusText}`)
  }

  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('text/html')) {
    throw new Error(`Got non-HTML response: ${contentType}`)
  }

  return response.text()
}

module.exports = { getURLsFromHTML, 
        normalizeURL,
        crawlPage
 };
