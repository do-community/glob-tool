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
            </template>
            <template v-slot:header>
                <div>
                    <Examples @set="set"></Examples>
                </div>
            </template>
            <template v-slot:buttons>
                <a class="button" @click="help">
                    Help
                </a>
            </template>
        </Header>

        <div class="main container">
            <h3 class="title is-3">
                {{ i18n.templates.app.input }}
            </h3>
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

            <h3 class="title is-3">
                {{ i18n.templates.app.tests }}
            </h3>
            <div class="input-container">
                <div ref="textarea" class="textarea input" contenteditable="true" @keyup="test">
                    <div>/hello/world.js</div>
                    <div>/test/some/globs</div>
                </div>
            </div>
        </div>

        <Footer :text="i18n.templates.app.oss"></Footer>
        <HelpModal ref="HelpModal"></HelpModal>
    </div>
</template>

<script>
    import minimatch from "minimatch"
    import queryString from "query-string"
    import i18n from "../i18n"
    import Header from "do-vue/src/templates/header"
    import Footer from "do-vue/src/templates/footer"
    import Examples from "./examples"
    import HelpModal from "./help_modal"

    export default {
        name: "App",
        components: {
            Header,
            Footer,
            Examples,
            HelpModal,
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
            help() {
                console.log(this)
                this.$refs.HelpModal.toggle()
            }
        },
    }
</script>
