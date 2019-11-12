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
                    <p>
                        <b>Examples:</b>
                        <span>
                            <a class="jump-link" @click="set('/*.js', ['/one.js', '/two.js', '/three.js'])">
                                Zero or More Chars <code class="slim">*</code>
                            </a>
                            <a class="jump-link" @click="set('/?.js', ['/a.js', '/b.js', '/file.js'])">
                                One Char <code class="slim">?</code>
                            </a>
                            <a class="jump-link" @click="set('/**/*.js', ['/file.js', '/one/file.js', '/one/two/file.js', '/one/two/three/file.js'])">
                                Recursive <code class="slim">**/*</code>
                            </a>
                            <a class="jump-link" @click="set('/{ab,cd,ef}/*.js', ['/ab/file.js', '/cd/file.js', '/ef/file.js', '/gh/file.js'])">
                                List <code class="slim">{a,b,c}</code>
                            </a>
                            <a class="jump-link" @click="set('/[abc]-xyz/*.js', ['/a-xyz/file.js', '/b-xyz/file.js', '/c-xyz/file.js', '/d-xyz/file.js'])">
                                Range <code class="slim">[abc]</code>
                            </a>
                            <a class="jump-link" @click="set('/!(src|build)/*.js', ['/public/file.js', '/dist/file.js', '/src/file.js', '/build/file.js'])">
                                Not Patterns <code class="slim">!(a|b)</code>
                            </a>
                            <a class="jump-link" @click="set('/file?(.min|.umd).js', ['/file.js', '/file.min.js', '/file.umd.js', '/file.es6.js'])">
                                Zero or One Pattern <code class="slim">?(a|b)</code>
                            </a>
                            <a class="jump-link" @click="set('/file*(.min|.umd).js', ['/file.js', '/file.min.js', '/file.umd.js', '/file.min.umd.js'])">
                                Zero or More Patterns <code class="slim">*(a|b)</code>
                            </a>
                            <a class="jump-link" @click="set('/file+(.min|.umd).js', ['/file.min.js', '/file.umd.js', '/file.min.umd.js', '/file.js'])">
                                One or More Patterns <code class="slim">+(a|b)</code>
                            </a>
                        </span>
                    </p>
                </div>
            </template>
            <template v-slot:buttons>
            </template>
        </Header>

        <div class="main container">
            <h3 class="title is-3">Glob string</h3>
            <div class="input-container">
                <label for="globInput" class="hidden">Glob string</label>
                <i class="fas fa-magic"></i>
                <input id="globInput"
                       class="input"
                       type="text"
                       placeholder="/**/*.js"
                       value="/**/*.js"
                       ref="input"
                       @keyup="test"
                />
            </div>

            <br/>

            <h3 class="title is-3">Test strings</h3>
            <div class="input-container">
                <div class="textarea input" ref="textarea" contenteditable="true" @keyup="test">
                    <div>/hello/world.js</div>
                    <div>/test/some/globs</div>
                </div>
            </div>
        </div>

        <Footer :text="i18n.templates.app.oss" />
    </div>
</template>

<script>
    import minimatch from "minimatch"
    import queryString from "query-string"
    import i18n from "../i18n"
    import Header from "do-vue/src/templates/header"
    import Footer from "do-vue/src/templates/footer"

    export default {
        name: "App",
        components: {
            Header,
            Footer,
        },
        data() {
            return {
                i18n,
            }
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
                parsed.tests = tests.map(x => x.textContent).filter(x => !!x.trim());
                window.history.pushState({}, "", `?${queryString.stringify(parsed)}`)
            },
            test() {
                const glob = this.$refs.input.value
                const children = Array.from(this.$refs.textarea.children)

                this.store(glob, children)

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
            }
        },
        mounted() {
            this.load()
            this.test()
        },
    }
</script>
