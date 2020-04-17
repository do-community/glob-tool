<!--
Copyright 2020 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<template>
    <div class="all do-bulma">
        <Header :title="i18n.templates.app.title">
            <template v-slot:description>
                {{ i18n.templates.app.description }}
            </template>
            <template v-slot:header>
                <div>
                    <Examples @set="set"></Examples>
                </div>
            </template>
            <template v-slot:buttons>
            </template>
        </Header>

        <div class="main container">
            <h2 class="title is-3">
                {{ i18n.templates.app.input }}
            </h2>
            <div class="input-container">
                <label for="globInput" class="hidden">{{ i18n.templates.app.input }}</label>
                <i class="fas fa-magic"></i>
                <input id="globInput"
                       ref="input"
                       class="input"
                       type="text"
                       placeholder="/**/*.js"
                       value="/**/*.js"
                       @keyup="test"
                />
            </div>

            <br />

            <h2 class="title is-3">
                {{ i18n.templates.app.tests }}
                <br /><small>{{ i18n.templates.app.testsSubtitle }}</small>
            </h2>
            <div class="input-container">
                <div ref="textarea"
                     :class="`textarea input${matchesOnly ? ' matches-only' : ''}`"
                     contenteditable="true"
                     @keydown="down"
                     @keyup="up"
                     @paste="paste"
                >
                    <div>// This will match as it ends with '.js'</div>
                    <div>/hello/world.js</div>
                    <div>// This won't match!</div>
                    <div>/test/some/globs</div>
                </div>
            </div>
            <p class="matches-only">
                <template v-if="matchesOnly">
                    {{ misses.toLocaleString() }} test{{ misses === 1 ? '' : 's' }} that didn't match
                    {{ misses === 1 ? 'is' : 'are' }} hidden.
                </template>
                <template v-else>
                    &nbsp;
                </template>
            </p>

            <div class="actions-container">
                <PrettyCheck v-model="commentsEnabled" class="p-default p-curve p-fill p-icon">
                    <i slot="extra" class="icon fas fa-check"></i>
                    {{ i18n.templates.app.comments }}
                </PrettyCheck>
                <PrettyCheck v-model="matchesOnly" class="p-default p-curve p-fill p-icon">
                    <i slot="extra" class="icon fas fa-check"></i>
                    {{ i18n.templates.app.matches }}
                </PrettyCheck>

                <div>
                    <a class="button is-primary is-small" @click="showTree">Import tree command</a>
                    <a class="button is-primary is-small" @click="showPackage">Import NPM package</a>
                </div>
            </div>

            <Help></Help>
            <Tree ref="tree" @save="addImport"></Tree>
            <Package ref="package" @save="addImport"></Package>
        </div>

        <Footer :text="i18n.templates.app.oss"></Footer>
    </div>
</template>

<script>
    import minimatch from "minimatch"
    import queryString from "query-string"
    import PrettyCheck from "pretty-checkbox-vue/check"
    import i18n from "../i18n"
    import Header from "do-vue/src/templates/header"
    import Footer from "do-vue/src/templates/footer"
    import Examples from "./examples"
    import Help from "./help"
    import Tree from "./tree"
    import Package from "./package"

    export default {
        name: "App",
        components: {
            PrettyCheck,
            Header,
            Footer,
            Examples,
            Help,
            Tree,
            Package,
        },
        data() {
            return {
                i18n,
                shiftActive: false,
                commentsEnabled: null,
                matchesOnly: null,
                hits: 0,
                misses: 0,
            }
        },
        watch: {
            commentsEnabled() {
                this.test()
            }
        },
        mounted() {
            this.load() // Load any URL data and run an initial test
        },
        methods: {
            setGlob(glob) {
                this.$refs.input.value = glob
                this.test()
            },
            setTests(tests) {
                while (this.$refs.textarea.firstChild) {
                    this.$refs.textarea.removeChild(this.$refs.textarea.firstChild)
                }
                tests.forEach(test => {
                    const div = document.createElement("div")
                    div.textContent = test
                    this.$refs.textarea.appendChild(div)
                })
                this.test()
            },
            setComments(comments) {
                // Explicit false, otherwise true
                this.$data.commentsEnabled = !(comments.toString().toLowerCase() === "false")
                this.test()
            },
            setMatches(matches) {
                // Explicit true, otherwise false
                this.$data.matchesOnly = (matches.toString().toLowerCase() === "true")
                this.test()
            },
            set(glob, tests) {
                this.$data.commentsEnabled = true
                this.$data.matchesOnly = false
                this.setGlob(glob)
                this.setTests(tests)
            },
            load() {
                const parsed = queryString.parse(window.location.search)
                if (parsed.glob) this.setGlob(parsed.glob)
                if (parsed.tests) this.setTests(parsed.tests)
                this.setComments(parsed.comments || "true") // Default comments to enabled
                this.setMatches(parsed.matches || "false") // Default matches only to disabled
            },
            store(glob, tests) {
                const parsed = queryString.parse(window.location.search)
                parsed.glob = glob
                parsed.tests = tests.map(x => x.textContent).filter(x => !!x.trim())
                if (this.$data.commentsEnabled !== null) parsed.comments = this.$data.commentsEnabled
                if (this.$data.matchesOnly !== null) parsed.matches = this.$data.matchesOnly
                window.history.pushState({}, "", `?${queryString.stringify(parsed)}`)
            },
            empty() {
                // Ensure no lost brs
                for (const child of this.$refs.textarea.children) {
                    if (child.nodeName.toLowerCase() === "br") {
                        this.$refs.textarea.removeChild(child)
                    }
                }

                // If we're empty, create a blank child
                if (this.$refs.textarea.children.length === 0) {
                    const div = document.createElement("div")
                    const br = document.createElement("br")
                    div.appendChild(br)
                    this.$refs.textarea.appendChild(div)
                }
            },
            standard() {
                // If we have any text directly in the parent, move it to a child div
                for (const child of this.$refs.textarea.childNodes) {
                    if (child.nodeName === "#text") {
                        const div = document.createElement("div")
                        const text = document.createTextNode(child.textContent)
                        div.appendChild(text)
                        this.$refs.textarea.insertBefore(div, child.nextSibling)
                        child.parentElement.removeChild(child)
                    }
                }
            },
            focus() {
                // If we're focused in the textarea, focus on first div instead
                const select = window.getSelection()
                if (select.isCollapsed && select.focusNode == this.$refs.textarea)
                    select.collapse(this.$refs.textarea.children[0])
            },
            test() {
                // Ensure we don't have bugged text
                this.standard()

                // Ensure we have a valid empty state if empty
                this.empty()

                // Make sure we're now actually focused in the first div and not the parent
                this.focus()

                // Get the data
                const glob = this.$refs.input.value
                const children = Array.from(this.$refs.textarea.children)

                // Store in the URL
                this.store(glob, children)

                // Run the hit/miss check
                this.$data.hits = 0;
                this.$data.misses = 0;
                children.forEach(child => {
                    // Remove all classes to start
                    child.classList.remove("miss")
                    child.classList.remove("hit")
                    child.classList.remove("comment")

                    // If blank, do nothing more
                    if (child.textContent.trim() === "") {
                        return
                    }

                    // If a comment, add the comment class
                    if (this.$data.commentsEnabled && child.textContent.trim().startsWith("//")) {
                        child.classList.add("comment")
                        return
                    }

                    // If a match, add hit, else add miss
                    if (minimatch(child.textContent, glob)) {
                        this.$data.hits += 1;
                        child.classList.add("hit")
                    } else {
                        this.$data.misses += 1;
                        child.classList.add("miss")
                    }
                })
            },
            down(e) {
                // Track if shift is pressed for pasting
                if (e.code === "ShiftLeft" || e.code === "ShiftRight" || e.keyCode === 16)
                    this.$data.shiftActive = true
            },
            up(e) {
                // Track if shift is pressed for pasting
                if (e.code === "ShiftLeft" || e.code === "ShiftRight" || e.keyCode === 16)
                    this.$data.shiftActive = false

                // Run tests, something in the test strings might have changed!
                this.test()
            },
            paste(e) {
                // If shift is pressed, do a native paste (don't split lines)
                if (this.$data.shiftActive) return

                // Don't do a native paste
                e.preventDefault()

                // Get the pasted text and split by new line
                let pastedText
                if (window.clipboardData && window.clipboardData.getData) { // IE
                    pastedText = window.clipboardData.getData("Text")
                } else if (e.clipboardData && e.clipboardData.getData) {
                    pastedText = e.clipboardData.getData("text/plain")
                }
                pastedText = pastedText.split("\n")
                if (!pastedText.length) return

                // Attempt to determine where the user currently is
                // If we can't, assume end of text area
                const select = window.getSelection()
                let currentElm = select.focusNode
                if (currentElm.nodeName.toLowerCase() !== "div") currentElm = currentElm.parentElement
                if (currentElm.parentElement !== this.$refs.textarea) currentElm = this.$refs.textarea.lastElementChild

                // If the user has selected a range, delete it as we'll be replacing it
                const range = select.getRangeAt(0)
                if (range.startOffset !== range.endOffset) range.deleteContents()

                // If we've decided what the user has selected works, ensure we paste at the right point
                let textAfter
                if (currentElm == select.focusNode || currentElm.firstChild == select.focusNode) {
                    select.collapseToStart()
                    const index = select.getRangeAt(0).startOffset
                    textAfter = select.focusNode.textContent.slice(index)

                    // Update the current node's text to only be the text before the cursor
                    select.focusNode.textContent = select.focusNode.textContent.slice(0, index)
                }

                // Append first to current line (if it's actually a line)
                if (currentElm.nodeName.toLowerCase() === "div") {
                    // Remove the br added to an otherwise empty line
                    if (currentElm.textContent === "" &&
                        currentElm.firstChild &&
                        currentElm.firstChild.nodeName.toLowerCase() === "br") {
                        currentElm.removeChild(currentElm.firstChild)
                    }
                    // Add the text
                    currentElm.innerText += pastedText.shift()
                }

                // Insert the rest on new lines after the current
                for (const line of pastedText) {
                    const div = document.createElement("div")
                    const text = document.createTextNode(line)
                    div.appendChild(text)
                    this.$refs.textarea.insertBefore(div, currentElm.nextSibling)
                    currentElm = div
                }

                // Store where the cursor will need to be
                const newSelectIndex = currentElm.firstChild.textContent.length

                // If we have text from after the user's initial selection, restore it
                if (textAfter) currentElm.firstChild.textContent += textAfter

                // Move cursor to the end of the pasted content
                window.getSelection().collapse(currentElm.firstChild, newSelectIndex)

                // Scroll the new pasted content into view if it isn't viewable
                const currentElmTop = currentElm.offsetTop - currentElm.parentElement.offsetTop
                const currentElmBottom = currentElm.getBoundingClientRect().height + currentElmTop
                const viewableTop = this.$refs.textarea.scrollTop
                const viewableBottom = this.$refs.textarea.getBoundingClientRect().height + viewableTop
                if (currentElmTop < viewableTop || currentElmBottom  > viewableBottom)
                    this.$refs.textarea.scrollTop = currentElmTop

                // We're done, so run a check
                this.test()
            },
            showTree() {
                this.$refs.tree.open()
            },
            showPackage() {
                this.$refs.package.open()
            },
            addImport(tests, type) {
                // If comments enabled, leave a comment
                if (this.$data.commentsEnabled) tests.unshift(`// Imported from ${type}`)

                // Add each of the new test strings
                for (const line of tests) {
                    const div = document.createElement("div")
                    const text = document.createTextNode(line)
                    div.appendChild(text)
                    this.$refs.textarea.appendChild(div)
                }

                // Run a check
                this.test()
            },
        },
    }
</script>
