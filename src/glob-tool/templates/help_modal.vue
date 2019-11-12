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
    <Modal ref="Modal" title="A brief globs explainer" class="help-modal">
        <h3>What are globs?</h3>
        <p>
            Globs are the patterns you use when you run commands such as <code class="slim">ls src/*.js</code>, or you
            might see them used in config files such as a <code class="slim">.gitignore</code> where you might see
            <code class="slim">.cache/*</code>, for example.
        </p>

        <h3>What can you use in them?</h3>
        <p>
            Alongside plaintext, globs have a set of control (or special) characters that allow them to become far more
            powerful that just some boring old text.
            <br/>
            <i>Note: we have examples for all of these in the header of the glob tool!</i>
        </p>

        <ul>
            <li>
                The <code class="slim">*</code> character matches zero or more characters.
            </li>
            <li>
                <code class="slim">?</code> matches exactly one character.
            </li>
            <li>
                The use of <code class="slim">[abc]</code> matches a range of characters.
                <br/>
                <i>
                    If the first character of the range is <code class="slim">!</code> or <code class="slim">^</code>
                    then it matches any character not in the range.
                </i>
            </li>
            <li>
                <code class="slim">!(ab|cd|ef)</code> matches anything that does not directly match any of the patterns
                in the brackets (separated by the pipe character <code class="slim">|</code>).
            </li>
            <li>
                <code class="slim">?(ab|cd|ef)</code> matches zero or one occurrence of the patterns given.
            </li>
            <li>
                <code class="slim">+(ab|cd|ef)</code> allows for one or more occurrences of the patterns to be matched.
            </li>
            <li>
                <code class="slim">*(ab|cd|ef)</code> matches zero or more occurrences of the patterns listed.
            </li>
            <li>
                <code class="slim">@(ab|cd|ef)</code> ensures that exactly one of the patterns provided matches.
            </li>
            <li>
                When <code class="slim">**</code>, the "globstar", is used it matches zero or more directories and
                subdirectories. This allows for recursive directory searching easily.
            </li>
        </ul>
    </Modal>
</template>

<script>
    import i18n from "../i18n"
    import Modal from "do-vue/src/templates/modal"

    export default {
        name: "HelpModal",
        data() {
            return {
                i18n,
            }
        },
        components: {
            Modal,
        },
        methods: {
            toggle() {
                this.$refs.Modal.toggle()
            },
        },
    }
</script>
