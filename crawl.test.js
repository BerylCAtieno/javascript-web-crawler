import { normalizeURL } from "./crawl.js";

import { test, expect } from "@jest/globals";

test('normalizeURL1', () => {

    const input = 'https://blog.boot.dev/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev'
    expect(actual).toEqual(expected)
})

test('normalizeURL2', () => {

    const input = 'http://blog.boot.dev/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev'
    expect(actual).toEqual(expected)
})

test('normalizeURL3', () => {

    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})


