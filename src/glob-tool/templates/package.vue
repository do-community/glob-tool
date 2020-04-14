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
    <Modal ref="modal" title="Import NPM package" class="tree-import">
        <div class="columns">
            <div class="column">
                <h3 class="title is-4">
                    NPM package name:
                </h3>
                <input ref="package" v-model.trim="package" class="input" type="text" placeholder="vue" />
            </div>

            <div class="column">
                <h3 class="title is-4">
                    Files in package:
                </h3>
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
                package: "vue",
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
                    const files = this.walk(memFs, '/');
                    this.$data.parsed = files;
                } catch (e) {
                    console.error(e);
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
                this.$emit("save", this.$data.parsed, 'NPM package')
                this.$refs.modal.close()
            },
        }
    }
</script>
