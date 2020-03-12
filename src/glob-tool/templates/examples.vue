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
    <p>
        <b>{{ i18n.templates.examples.title }}</b>

        <a class="jump-link" @click="set('*.js', [
            '// These will match as they end with \'.js\'',
            'one.js',
            'two.js',
            'three.js',
            '// This won\'t match as it doesn\'t end with \'.js\'',
            'four.md'
        ])"
        >
            {{ i18n.templates.examples.zeroOrMoreChars }} <code class="slim">*</code>
        </a>

        <a class="jump-link" @click="set('?.js', [
            '// These will match as they are a single character ending with \'.js\'',
            'a.js',
            'b.js',
            '// This won\'t match as it is more than one character before \'.js\'',
            'file.js'
        ])"
        >
            {{ i18n.templates.examples.oneChar }} <code class="slim">?</code>
        </a>

        <a class="jump-link" @click="set('/**/*.js', [
            '// These will all match as the globstar matches zero or more directories recursively',
            '/file.js',
            '/one/file.js',
            '/one/two/file.js',
            '/one/two/three/file.js'
        ])"
        >
            {{ i18n.templates.examples.recursive }} <code class="slim">**</code>
        </a>

        <a class="jump-link" @click="set('/{static,build/public}/*.js', [
            '// These will match as their directories are included in the group',
            '/static/file.js',
            '/build/public/file.js',
            '// This won\'t match as the \'src\' directory is not in the group',
            '/src/file.js'
        ])"
        >
            {{ i18n.templates.examples.list }} <code class="slim">{a,b,c}</code>
        </a>

        <a class="jump-link" @click="set('/[abc]-xyz/*.js', [
            '// These will match as they are in the range provided',
            '/a-xyz/file.js',
            '/b-xyz/file.js',
            '/c-xyz/file.js',
            '// This won\'t match as \'d\' is not in the range \'[abc]\'',
            '/d-xyz/file.js'
        ])"
        >
            {{ i18n.templates.examples.range }} <code class="slim">[abc]</code>
        </a>

        <a class="jump-link" @click="set('/[!abc]-xyz/*.js', [
            '// These will match as they are not in the given range',
            '/d-xyz/file.js',
            '/e-xyz/file.js',
            '// This won\'t match as they are within the excluded range',
            '/a-xyz/file.js',
            '/b-xyz/file.js',
            '/c-xyz/file.js'
        ])"
        >
            {{ i18n.templates.examples.notRange }} <code class="slim">[!abc]</code>
        </a>

        <a class="jump-link" @click="set('/!(src|build)/*.js', [
            '// These will match as they are not in the excluded pattern',
            '/public/file.js',
            '/dist/file.js',
            '// This won\'t match as they are in the directories that match the pattern',
            '/src/file.js',
            '/build/file.js'
        ])"
        >
            {{ i18n.templates.examples.notPatterns }} <code class="slim">!(a|b)</code>
        </a>

        <a class="jump-link" @click="set('file?(.min|.umd).js', [
            '// These all match as they have zero or one part from the pattern',
            'file.js',
            'file.min.js',
            'file.umd.js',
            '// This won\'t match as it has more than one parts from the pattern',
            'file.min.umd.js',
            '// This won\'t match as \'.es6\' is not in the pattern',
            'file.es6.js'
        ])"
        >
            {{ i18n.templates.examples.zeroOrOnePattern }} <code class="slim">?(a|b)</code>
        </a>

        <a class="jump-link" @click="set('file*(.min|.umd).js', [
            '// These all match as they have zero or more parts from the pattern',
            'file.js',
            'file.min.js',
            'file.umd.js',
            'file.min.umd.js',
            '// This won\'t match as \'.es6\' is not in the pattern',
            'file.es6.js'
        ])"
        >
            {{ i18n.templates.examples.zeroOrMorePatterns }} <code class="slim">*(a|b)</code>
        </a>

        <a class="jump-link" @click="set('file+(.min|.umd).js', [
            '// These all match as they have one or more parts from the pattern',
            'file.min.js',
            'file.umd.js',
            'file.min.umd.js',
            '// This won\'t match as it has no part from the pattern',
            'file.js',
            '// This won\'t match as \'.es6\' is not in the pattern',
            'file.es6.js'
        ])"
        >
            {{ i18n.templates.examples.oneOrMorePatterns }} <code class="slim">+(a|b)</code>
        </a>

        <a class="jump-link" @click="set('file@(.min|.umd).js', [
            '// These match as they have exactly one part from the pattern',
            'file.min.js',
            'file.umd.js',
            '// This won\'t match as it more than one part from the pattern',
            'file.min.umd.js',
            '// This won\'t match as it has no part from the pattern',
            'file.js',
            '// This won\'t match as \'.es6\' is not in the pattern',
            'file.es6.js'
        ])"
        >
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
