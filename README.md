# washbaths.github.io

deploys to GitHub Pages, everything here is public accessible.

can be served for local development with `micro-dev`

run `npm i`, `npm run dev`

`services/` directory contains frontend javascript files

`squarePay/` includes simple checkout API invocation meant to be executed from AWS Lambda, using a Function URL to accept a POST request from the website.

Configuration for lambda Function URL should look like this

Allow origin:
https://xezian.github.io, http://localhost:3000

Expose headers
access-control-allow-origin, access-control-allow-methods, access-control-allow-headers

Allow headers
content-type

Allow methods
POST
