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
        <b>Examples:</b>
        <a class="jump-link" @click="set('*.js', ['one.js', 'two.js', 'three.js'])">
            Zero or More Chars <code class="slim">*</code>
        </a>
        <a class="jump-link" @click="set('?.js', ['a.js', 'b.js', 'file.js'])">
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
        <a class="jump-link" @click="set('file?(.min|.umd).js', ['file.js', 'file.min.js', 'file.umd.js', 'file.es6.js'])">
            Zero or One Pattern <code class="slim">?(a|b)</code>
        </a>
        <a class="jump-link" @click="set('file*(.min|.umd).js', ['file.js', 'file.min.js', 'file.umd.js', 'file.min.umd.js'])">
            Zero or More Patterns <code class="slim">*(a|b)</code>
        </a>
        <a class="jump-link" @click="set('file+(.min|.umd).js', ['file.min.js', 'file.umd.js', 'file.min.umd.js', 'file.js'])">
            One or More Patterns <code class="slim">+(a|b)</code>
        </a>
    </p>
</template>

<script>
    export default {
        name: "Examples",
        methods: {
            set(glob, tests) {
                this.$emit("set", glob, tests)
            }
        },
    }
</script>
