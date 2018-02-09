# Library Search - TypeScript based webserver to interface with library providers, allowing more leveraged catalog search

### TypeScript API

Uses NestJS framework, built on top of Express for TypeScript. 
 
### Database 

No current database, library providers will be used instead. Too much data for me to store unless this project takes off or something like that. Tradeoff is slower and uncontrolled responses. Will need to account for more scenarios in the webserver. May use Redis in near future.

### Frontend

Front end will be based in a different repository. This repo is backend Model/Provider/Controller only.

## Project scope

This is a hobby project to fill a slightly annoying gap in the book hunt experience. Searching for a book in your local libraries can be a huge pain. Many libraries have clunky or broken websites, bad mobile support, unreliable data, and you can only search for one book at a time! Worldcat is a centralized database of many (but not all) libraries, including their catalogs. Ideally, this project would utilize the Worldcat Developer API, but the licensing fees are a bit much. Instead we will scrape their search pages for information every time a user queries this API to find a *list* of books available in *several* local libraries. We will try to cache responses for some time and respect API limits (even though we are *not* using the API). This should help users filter a large backlog of books down to those readily available (and free!) at their library. 

# Installation

- Clone repository
- run `npm install` in root directory
- run `node index`
- server should start on localhost:3000
- run `node --inspect index` for debug mode

# Tests

- Tests are currently in progress. Minimal support for Chai and Mocha is currently available