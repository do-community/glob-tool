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
    <p>
        <b>{{ i18n.templates.examples.title }}</b>
        <a class="jump-link" @click="set('*.js', ['one.js', 'two.js', 'three.js'])">
            {{ i18n.templates.examples.zeroOrMoreChars }} <code class="slim">*</code>
        </a>
        <a class="jump-link" @click="set('?.js', ['a.js', 'b.js', 'file.js'])">
            {{ i18n.templates.examples.oneChar }} <code class="slim">?</code>
        </a>
        <a class="jump-link" @click="set('/**/*.js', ['/file.js', '/one/file.js', '/one/two/file.js', '/one/two/three/file.js'])">
            {{ i18n.templates.examples.recursive }} <code class="slim">**/*</code>
        </a>
        <a class="jump-link" @click="set('/{ab,cd,ef}/*.js', ['/ab/file.js', '/cd/file.js', '/ef/file.js', '/gh/file.js'])">
            {{ i18n.templates.examples.list }} <code class="slim">{a,b,c}</code>
        </a>
        <a class="jump-link" @click="set('/[abc]-xyz/*.js', ['/a-xyz/file.js', '/b-xyz/file.js', '/c-xyz/file.js', '/d-xyz/file.js'])">
            {{ i18n.templates.examples.range }} <code class="slim">[abc]</code>
        </a>
        <a class="jump-link" @click="set('/[!abc]-xyz/*.js', ['/d-xyz/file.js', '/e-xyz/file.js', '/a-xyz/file.js', '/b-xyz/file.js', '/c-xyz/file.js'])">
            {{ i18n.templates.examples.notRange }} <code class="slim">[!abc]</code>
        </a>
        <a class="jump-link" @click="set('/!(src|build)/*.js', ['/public/file.js', '/dist/file.js', '/src/file.js', '/build/file.js'])">
            {{ i18n.templates.examples.notPatterns }} <code class="slim">!(a|b)</code>
        </a>
        <a class="jump-link" @click="set('file?(.min|.umd).js', ['file.js', 'file.min.js', 'file.umd.js', 'file.es6.js'])">
            {{ i18n.templates.examples.zeroOrOnePattern }} <code class="slim">?(a|b)</code>
        </a>
        <a class="jump-link" @click="set('file*(.min|.umd).js', ['file.js', 'file.min.js', 'file.umd.js', 'file.min.umd.js'])">
            {{ i18n.templates.examples.zeroOrMorePatterns }} <code class="slim">*(a|b)</code>
        </a>
        <a class="jump-link" @click="set('file+(.min|.umd).js', ['file.min.js', 'file.umd.js', 'file.min.umd.js', 'file.js'])">
            {{ i18n.templates.examples.oneOrMorePatterns }} <code class="slim">+(a|b)</code>
        </a>
        <a class="jump-link" @click="set('file@(.min|.umd).js', ['file.min.js', 'file.umd.js', 'file.min.umd.js', 'file.js'])">
            {{ i18n.templates.examples.exactlyOnePattern }} <code class="slim">@(a|b)</code>
        </a>
    </p>
</template>

<script>
    import i18n from "../i18n"

    export default {
        name: "Examples",
        data() {
            return {
                i18n,
            }
        },
        methods: {
            set(glob, tests) {
                this.$emit("set", glob, tests)
            }
        },
    }
</script>
