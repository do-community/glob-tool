export default {
    title: "Glob Tool",
    description: "Test globs against sets of test strings quickly and easily",
    input: "Glob string",
    tests: "Test strings",
    testsSubtitle: "Enter strings here to test against the glob",
    comments: "Comments enabled? (Start a line with '//' to write a comment when enabled)",
    matches: "Show matches only?",
    hidden: ["test", "that didn't match", "is", "are", "hidden"],
    importTree: "Import tree command",
    importNPM: "Import NPM package",
    oss: "This tool is {link|open-source on GitHub|https://github.com/do-community/glob-tool} under the {link|Apache-2.0|https://github.com/do-community/glob-tool/blob/master/LICENSE} license! We welcome feedback and contributions.",
} as {[key: string]: string}
