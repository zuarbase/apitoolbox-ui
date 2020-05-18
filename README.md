# apitoolbox-ui

This library provides the following list UI widgets in the form of custom elements:
* Sign up form
* Login form
* User list
* User add/edit form

To be used as a plug-and-play front end for [apitoolbox](https://github.com/zuarbase/apitoolbox)

## Installation
### On a website
#### Download from /dist
Download just the files you need, or `apitoolbox-ui.js` for all elements, and save them on your webserver.
#### Include via script tag
At the bottom of your page, just before the closing `</body>` tag, include a script tag.
```html
<script type="text/javascript" src="/js/apitoolbox-ui.js"></script>
```
### In a web app
Install via yarn or npm and include just the files you need or `apitoolbox-ui` for all elements.
#### Install
`yarn install apitoolbox-ui`
#### Require
Just what you need:
`require('apitoolbox-ui/sign-up-form');`

Or everything:
`require('apitoolbox-ui');`

## Usage
#### Add the elements to your page
Include the element in your page where you want it displayed, passing in configuration values as attributes.
```html
<sign-up-form
    heading="Create new Account"
    button-text="Sign Up"
    server="https://REPLACE_ME.YOUR_DOMAIN.com">
</sign-up-form>
```

## Styling
Bootstrap classes (but not style rules) are included on most elements to aid in styling. Minimal styling is included out of the box.

## Examples
See more example usages in [examples.html](/examples.html)

- or -

Clone the repo and run `yarn examples`

## Development
* `yarn install`
* `yarn dev`

## Build for release
* `yarn build`


