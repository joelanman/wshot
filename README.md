# WShot

A command line app to take screenshots of web pages, written in NodeJS.

## Install

Run `npm install -g wshot`

## How to use

You can get a screenshot of a URL (must start with http:// or https://)

`wshot https://www.gov.uk`

Or multiple URLs, using a text file with each URL on a new line:

`wshot urls.txt`

Screenshots are saved into a folder called `screenshots`.

You can set browser width, it defaults to 1200 pixels.

`wshot https://www.gov.uk --width 320`

By default, you'll get a screenshot of the full height of the page. To get a set height:

`wshot https://www.gov.uk --height 800`
