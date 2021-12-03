# Glob Tool

A tool to test globs against sets of test strings quickly and easily for the DigitalOcean Community.

---

## Development/Building

To setup the build/develop environment, you will need to run `npm i` with Node 12+ installed. This will install the
 dependencies to allow you to build the project.

To develop for this tool run `npm run dev`.
This will start a development server that will automatically reload the codebase when changes occur.

If you wish to host this tool on a service, simply run `npm run build`. This will run all the necessary build scripts
 automatically to build the tool.\
You can then take the `dist` folder and put it on your web server/bucket.

GitHub Actions is setup to do this automatically for this repository to deploy to gh-pages.

### CORS proxy

To integrate with NPm and provide users with the ability to ues file names from an NPM package, the tool utilises the
cors.bridged.cc proxy as NPM does not have CORS headers on their registry.

The CORS proxy is only used for the NPM functionality, but requires an API key that will be used in the client to
authenticate the requests, set as the `CORS_API_KEY` environment variable.

You can find out more about getting an API key for the CORS proxy at <https://github.com/gridaco/base/issues/23>.

## Source Structure

### [`src/glob-tool`](./src/glob-tool)

#### [`src/glob-tool/i18n`](./src/glob-tool/i18n)

In this directory lives all the internationalisation data and strings for the tool.
Currently, this only contains the English versions of the strings but could be expanded in the future.

#### [`src/glob-tool/scss`](./src/glob-tool/scss)

The scss directory contains the main SCSS styling file for the tool, which imports our do-bulma library and then adds
 tool-specific customisations.

#### [`src/glob-tool/templates`](./src/glob-tool/templates)

This directory contains the Vue templates that are used to render the tool on the client-side.
`app.vue` is the main Vue file that other templates are referenced into.

## Contributing

If you are contributing, please read the [contributing file](CONTRIBUTING.md) before submitting your pull requests.
