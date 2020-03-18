<template>
    <Modal ref="modal" title="Import tree command">
        <pre class="tree-input"><textarea ref="input" v-model="input"></textarea></pre>

        <p v-if="error">
            Sorry, an error occurred when trying to parse your input.
        </p>
        <p v-else-if="!parsed.length">
            No files could be found in your provided input.
        </p>
        <ul v-else>
            <li v-for="file in parsed">
                {{ file }}
            </li>
        </ul>
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
                input: defaultTree,
                parsed: [],
                error: false,
            }
        },
        watch: {
            input() {
                this.update()
            }
        },
        methods: {
            update() {
                try {
                    this.$data.parsed = files(parse(this.$data.input))
                    this.$data.error = false
                } catch (_) {
                    this.$data.parsed = []
                    this.$data.error = true
                }
            },
            open() {
                this.$refs.modal.open()

                this.update() // Ensure we're showing the parsed data for what's in the textarea
                this.$refs.input.dispatchEvent(new Event("input")) // Convince autoresize something happened

                this.$nextTick(() => this.$refs.input.focus())
            },
            close() {
                this.$refs.modal.close()
            },
        }
    }
</script>
