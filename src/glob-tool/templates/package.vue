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
    <Modal ref="modal" title="Import NPM package" class="import-modal">
        <div class="columns">
            <div class="column">
                <h3 class="title is-4">
                    NPM package name:
                </h3>
                <div class="input-container">
                    <i class="fas fa-circle-notch fa-spin" v-if="updating"></i>
                    <i class="fas fa-box-open" v-else></i>
                    <input ref="package"
                           v-model.trim.lazy="package"
                           class="input"
                           type="text"
                           placeholder="vue"
                           :disabled="updating" />
                </div>

                <a class="button is-primary"
                   @click="save"
                   v-if="!updating && !error && package.length && parsed.length">
                    Import files as test strings
                </a>
            </div>

            <div class="column">
                <h3 class="title is-4">
                    Files in package:
                </h3>
                <p v-if="updating">
                    Loading files from NPM package...
                </p>
                <p v-else-if="error">
                    Sorry, an error occurred when trying to load files from the NPM package.
                </p>
                <p v-else-if="!package.length">
                    Please provide an NPM package name to begin.
                </p>
                <p v-else-if="!parsed.length">
                    No files could be found in the NPM package provided.
                </p>
                <template v-else>
                    <ul>
                        <li v-for="file in parsed">
                            {{ file }}
                        </li>
                    </ul>
                </template>
            </div>
        </div>
    </Modal>
</template>

<script>
    import { inflate } from "pako";
    import { Readable } from "stream";
    import fetch from "node-fetch";
    import untarToMemory from "untar-memory";
    import Modal from "do-vue/src/templates/modal"

    export default {
        name: "Package",
        components: {
            Modal
        },
        data() {
            return {
                package: "",
                parsed: [],
                error: false,
                updating: false,
            }
        },
        watch: {
            package() {
                this.$data.updating = true;
                this.update()
            },
        },
        methods: {
            walk(fs, dir) {
                const files = fs.readdirSync(dir);
                const results = [];
                files.forEach(file => {
                    if (fs.statSync(dir + file).isDirectory()) {
                        results.push(...this.walk(fs, dir + file + '/'))
                    } else {
                        results.push(dir + file);
                    }
                });
                return results;
            },
            async update() {
                if (!this.$data.package.length) return;

                try {
                    // Get the tarball URL
                    const data = await (await fetch(`https://cors-anywhere.herokuapp.com/https://registry.npmjs.com/${this.$data.package}`)).json();
                    const tarUrl = data.versions[data['dist-tags'].latest].dist.tarball;

                    // Get the tarball contents
                    const tarRes = await fetch(`https://cors-anywhere.herokuapp.com/${tarUrl}`);
                    const tar = inflate(await tarRes.arrayBuffer());

                    // Parse the tarball to an fs
                    const tarStream = new Readable();
                    tarStream.push(tar);
                    tarStream.push(null);
                    const memFs = await untarToMemory(tarStream);

                    // Get all files in fs
                    this.$data.parsed = this.walk(memFs, '/').map(x => x.substr('/package/'.length));
                    this.$data.error = false
                } catch (e) {
                    console.error(e);
                    this.$data.parsed = []
                    this.$data.error = true
                }

                this.$data.updating = false
            },
            open() {
                this.$refs.modal.open()
                this.update() // Ensure we're showing the parsed data for what's in the textarea

                this.$nextTick(() => {
                    this.$refs.package.dispatchEvent(new Event("input")) // Convince autoresize something happened
                    this.$nextTick(() => this.$refs.package.focus())
                })
            },
            save() {
                this.$emit("save", this.$data.parsed, `${this.$data.package} NPM package`)
                this.$refs.modal.close()
            },
        }
    }
</script>
