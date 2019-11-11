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
        <Landing background-top=""
                 background-bottom=""
                 title="title"
                 description="desc"
                 github="https://github.com/do-community/glob-tool"
        >
            <div class="input-container">
                <label for="globInput" class="hidden"></label>
                <i class="fas fa-search"></i>
                <input id="globInput"
                       class="input"
                       type="text"
                       placeholder=""
                />
            </div>
            <div class="input-container">
                <div class="textarea" contenteditable="true">
                    test
                </div>
            </div>
        </Landing>
    </div>
</template>

<script>
    import i18n from "../i18n"
    import Landing from "do-vue/src/templates/landing"

    export default {
        name: "App",
        components: {
            Landing,
        },
        data() {
            return {
                i18n,
            }
        },
    }
</script>
