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
    <Modal ref="modal" title="Import tree command" class="tree-import">
            <div class="columns">
                <div class="column">
                    <h3 class="title is-4">
                        Output of tree command:
                        <br/>
                        <small>
                            Paste the output of the unix <code class="slim">tree</code> command here to import it as
                            test strings.
                        </small>
                    </h3>
                    <pre><textarea ref="input" v-model.trim="input" :placeholder="defaultTree"></textarea></pre>

                    <h3 class="title is-4">
                        String to trim from start of files:
                        <br/>
                        <small>
                            Use this to trim a set string from the start of each line, such as the base folder.
                        </small>
                    </h3>
                    <input ref="trim" class="input" type="text" placeholder="./" v-model.trim="trim" />
                </div>

                <div class="column">
                    <h3 class="title is-4">Parsed files from tree:</h3>
                    <p v-if="error">
                        Sorry, an error occurred when trying to parse your input.
                    </p>
                    <p v-else-if="!parsed.length">
                        No files could be found in your provided input.
                    </p>
                    <template v-else>
                        <ul>
                            <li v-for="file in parsed">
                                {{ file }}
                            </li>
                        </ul>
                        <a class="button is-primary" @click="save">Import as test strings</a>
                    </template>
                </div>
            </div>
    </Modal>
</template>

<script>
    import { parse, files } from "tree-parse"
    import Modal from "do-vue/src/templates/modal"
    import defaultTree from "../data/default_tree"

    export default {
        name: "Tree",
        components: {
            Modal
        },
        data() {
            return {
                defaultTree,
                input: defaultTree,
                trim: './',
                parsed: [],
                error: false,
            }
        },
        watch: {
            input() {
                this.update()
            },
            trim() {
                this.update()
            }
        },
        methods: {
            update() {
                try {
                    this.$data.parsed = files(parse(this.$data.input)).map(x => {
                        const trim = this.$data.trim.trim()
                        if (x.startsWith(trim)) return x.substr(trim.length)
                        return x
                    })
                    this.$data.error = false
                } catch (_) {
                    this.$data.parsed = []
                    this.$data.error = true
                }
            },
            open() {
                this.$refs.modal.open()
                this.update() // Ensure we're showing the parsed data for what's in the textarea

                this.$nextTick(() => {
                    this.$refs.input.dispatchEvent(new Event("input")) // Convince autoresize something happened
                    this.$nextTick(() => this.$refs.input.focus())
                })
            },
            save() {
                this.$emit("save", this.$data.parsed)
                this.$refs.modal.close()
            },
        }
    }
</script>
