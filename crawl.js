const { JSDOM }  = require('jsdom')

async function crawlPage(currentURL) {
  
  try {
    const response = await fetch(currentURL)
    if (response.status > 399) {
      console.log(`error in fetch with status code: ${response.status} on page: ${currentURL}`)
      return 
    }

    const contentType = response.headers.get("content-type")
    if (!contentType.includes("text/html")) {
      console.log(`non html content type: ${contentType} on page: ${currentURL}`)
      return
    }

    console.log(`=====actively crawling ${currentURL}=====`)
    console.log( await response.text())


  } catch (error) {
    console.log(`Error: ${error.message} in ${currentURL}`)
  }
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

module.exports = { getURLsFromHTML, 
        normalizeURL,
        crawlPage
 };
