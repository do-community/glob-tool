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
    <div class="help">
        <h3 id="what-are-globs">
            What are globs?
        </h3>
        <p>
            Globs are the patterns you use when you run commands such as <code class="slim">ls src/*.js</code>, or you
            might see them used in config files such as a <code class="slim">.gitignore</code> where you might see
            <code class="slim">.cache/*</code>, for example.
        </p>

        <h3 id="what-can-you-use">
            What can you use in them?
        </h3>
        <p>
            Alongside plaintext, globs have a set of control (or special) characters that allow them to become far more
            powerful that just some boring old text.
            <br />
            <i>Note: we have examples for all of these at the top of this page!</i>
        </p>

        <ul>
            <li>
                The <code class="slim">*</code> character matches zero or more characters.
            </li>
            <li>
                <code class="slim">?</code> matches exactly one character.
            </li>
            <li>
                <code class="slim">{ab,cd,ef}</code> matches exactly one of the "parts" provided.
                <br />
                <i>
                    These "parts" can also span multiple "sections" of the glob, so you can include directory separators
                    in them.
                    <br />
                    For example, <code class="slim">{ab,cd/ef}/*.js</code> is valid and would match
                    <code class="slim">ab/file.js</code> as well as <code class="slim">cd/ef/file.js</code>.
                </i>
            </li>
            <li>
                The use of <code class="slim">[abc]</code> matches a range of characters.
                <br />
                <i>
                    If the first character of the range is <code class="slim">!</code> or <code class="slim">^</code>
                    then it matches any character not in the range.
                </i>
            </li>
            <li>
                <code class="slim">!(ab|cd|ef)</code> matches anything that does not directly match any of the patterns
                in the parentheses.
                <br />
                <i>
                    Patterns in the group are separated by the pipe character
                    <code class="slim" style="font-style: normal;">|</code>.
                </i>
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

        <h3 id="using-the-tool-programatically">
            Using the tool programatically
        </h3>
        <p>
            All options for the tool are stored in URL query parameters, which allows for easy programmatic generation
            of a glob test page. The glob string is stored in the <code class="slim">glob</code> query parameter. The
            test strings are stored in the <code class="slim">tests</code> query parameter, with one parameter per test
            string.
        </p>
        <p>
            The settings are also stored in the query parameters, with the comments enabled setting being controlled via
            the <code class="slim">comments</code> query parameter (<code class="slim">true</code> or
            <code class="slim">false</code>). Similarly, the show matches only setting is set with the
            <code class="slim">matches</code> query parameter.
        </p>
        <p>
            If you're generating a long URI (> 2000 chars), it may be advisable to compress it to avoid a 414 request
            URI too long error. We support compressed URL parameters using the following technique:
        </p>
        <ol>
            <li>
                Generate your initial URL parameters as normal (without the leading ?), eg.
                <code class="slim">glob=*.js&tests=hello.js&tests=hello.md</code>.
            </li>
            <li>
                Use the <a href="https://www.npmjs.com/package/lzutf8" target="_blank" rel="noopener">lzutf8</a> library
                to compress that string to a new base64 string, eg.
                <code class="slim">lzutf8.compress('glob=*.js&tests=hello.js&tests=hello.md', { outputEncoding: 'Base64' })</code>
                <i class="fas fa-long-arrow-alt-right"></i>
                <code class="slim">Z2xvYj0qLmpzJnRlc3RzPWhlbGxv0A9tZA==</code>
            </li>
            <li>
                Set the URL query parameter <code class="slim">c</code> to this compressed string, eg.
                <code class="slim">`?c=${encodeURIComponent('Z2xvYj0qLmpzJnRlc3RzPWhlbGxv0A9tZA==')}`</code>
                <i class="fas fa-long-arrow-alt-right"></i>
                <code class="slim">?c=Z2xvYj0qLmpzJnRlc3RzPWhlbGxv0A9tZA%3D%3D</code>
            </li>
        </ol>
    </div>
</template>

<script>

    export default {
        name: "Help",
    }
</script>
