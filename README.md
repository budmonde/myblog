# My Blog

This application was made with vanilla JS and CSS on the frontend on an Express.js server framework with server-side Handlebars + Showdown used for templating.

## Motivation

This application was made in the interest of creating my personal blog as well as a place to showcase my photography portfolio. Although a static website could've sufficed in order to process a simple blog, I needed to serve large amounts of image assets and I deemed it a lot easier to have a very lightweight express app serve the necessary data.

This small application, although quite trivial in terms of its logic, I personally found it to be very fun to work on as I was aiming for as lightweight a solution as possible to build this application. You might point out that given the current logic of the application that a server isn't even necessary (I could just compile whatever computations I'm doing on the server and scrap the server entirely), but I plan to add features to this application in the future that would require some low level authentication.

## TODO:

- Add support for filtering photos with tags and categories
- Add photo discriptions including personal notes + meta data of photos (lens, shutter, apperture, ISO)
- Add a `/posts` endpoint to show a list of past post titles
