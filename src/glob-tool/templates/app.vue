<!--
Copyright 2019 DigitalOcean

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
                <div ref="textarea" class="textarea input" contenteditable="true" @keyup="test" @paste="paste">
                    <div>/hello/world.js</div>
                    <div>/test/some/globs</div>
                </div>
            </div>

            <br />
            <Help></Help>
        </div>

        <Footer :text="i18n.templates.app.oss"></Footer>
    </div>
</template>

<script>
    import minimatch from "minimatch"
    import queryString from "query-string"
    import i18n from "../i18n"
    import Header from "do-vue/src/templates/header"
    import Footer from "do-vue/src/templates/footer"
    import Examples from "./examples"
    import Help from "./help"

    export default {
        name: "App",
        components: {
            Header,
            Footer,
            Examples,
            Help,
        },
        data() {
            return {
                i18n,
            }
        },
        mounted() {
            this.load()
            this.test()
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
            set(glob, tests) {
                this.setGlob(glob)
                this.setTests(tests)
            },
            load() {
                const parsed = queryString.parse(window.location.search)
                if (parsed.glob) this.setGlob(parsed.glob)
                if (parsed.tests) this.setTests(parsed.tests)
            },
            store(glob, tests) {
                const parsed = queryString.parse(window.location.search)
                parsed.glob = glob
                parsed.tests = tests.map(x => x.textContent).filter(x => !!x.trim())
                window.history.pushState({}, "", `?${queryString.stringify(parsed)}`)
            },
            empty() {
                if (this.$refs.textarea.children.length === 0) {
                    const div = document.createElement("div")
                    const br = document.createElement("br")
                    div.appendChild(br)
                    this.$refs.textarea.appendChild(div)
                }
            },
            test() {
                // Ensure it isn't empty
                this.empty()

                // Ensure we don't have bugged text
                for (const child of this.$refs.textarea.childNodes) {
                    if (child.nodeName === '#text') {
                        const div = document.createElement("div")
                        const text = document.createTextNode(child.textContent)
                        div.appendChild(text)
                        this.$refs.textarea.insertBefore(div, child.nextSibling)
                        child.parentElement.removeChild(child)
                    }
                }

                // Get the data
                const glob = this.$refs.input.value
                const children = Array.from(this.$refs.textarea.children)

                // Store in the URL
                this.store(glob, children)

                // Run the hit/miss check
                children.forEach(child => {
                    if (child.textContent.trim() === "") {
                        child.classList.remove("miss")
                        child.classList.remove("hit")
                    } else {
                        if (minimatch(child.textContent, glob)) {
                            child.classList.remove("miss")
                            child.classList.add("hit")
                        } else {
                            child.classList.add("miss")
                            child.classList.remove("hit")
                        }
                    }
                })
            },
            paste(e) {
                e.preventDefault()

                // Get the pasted text and split by new line
                let pastedText
                if (window.clipboardData && window.clipboardData.getData) { // IE
                    pastedText = window.clipboardData.getData('Text')
                } else if (e.clipboardData && e.clipboardData.getData) {
                    pastedText = e.clipboardData.getData('text/plain')
                }
                pastedText = pastedText.split('\n')
                if (!pastedText.length) return

                // Attempt to determine where the user currently is
                // If we can't, assume end of text area
                const select = window.getSelection()
                let currentElm = select.focusNode
                if (currentElm.nodeName.toLowerCase() !== 'div') currentElm = currentElm.parentElement
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
                if (currentElm.nodeName.toLowerCase() === 'div') {
                    // Remove the br added to an otherwise empty line
                    if (currentElm.textContent === '' &&
                        currentElm.firstChild &&
                        currentElm.firstChild.nodeName.toLowerCase() === 'br') {
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
            }
        },
    }
</script>
