<!--
Copyright 2022 DigitalOcean

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
                    <i v-if="updating" class="fas fa-circle-notch fa-spin"></i>
                    <i v-else class="fas fa-box-open"></i>
                    <input
                        ref="package"
                        v-model.trim.lazy="package"
                        class="input"
                        type="text"
                        placeholder="vue"
                        :disabled="updating"
                    />
                </div>

                <a
                    v-if="!updating && !error && package.length && parsed.length"
                    class="button is-primary"
                    @click="save"
                >
                    Import files as test strings
                </a>
            </div>

            <div class="column">
                <h3 class="title is-4">
                    Files in package:
                </h3>
                <p v-if="updating">
                    {{ updating }}
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
    import { inflate } from "pako"
    import { Readable } from "stream"
    import { extract } from "tar-stream"
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
                this.$data.updating = true
                this.update()
            },
        },
        methods: {
            untar(stream) {
                return new Promise((resolve, reject) => {
                    const paths = []
                    const extractHandler = extract()

                    extractHandler.on("entry", (header, stream, next) => {
                        if (header.type === "file")
                            paths.push(header.name)

                        stream.on("end", () => { next() })
                        stream.resume()
                    })

                    extractHandler.on("finish", () => { resolve(paths) })
                    extractHandler.on("error", (err) => { reject(err) })

                    stream.pipe(extractHandler)
                })
            },
            fetchCors(url) {
                return fetch(`https://cors.bridged.cc/${url}`, {
                    method: "GET",
                    headers: {
                        "x-cors-grida-api-key": process.env.CORS_API_KEY
                    },
                })
            },
            async update() {
                if (!this.$data.package.length) return

                try {
                    // Get the tarball URL
                    this.$data.updating = "Fetching package information from NPM..."
                    const data = await this.fetchCors(`https://registry.npmjs.com/${this.$data.package}`)
                        .then(res => res.json())
                    const tarUrl = data.versions[data["dist-tags"].latest].dist.tarball

                    // Get the tarball contents
                    this.$data.updating = "Downloading the contents of the package..."
                    const tarRes = await this.fetchCors(tarUrl)
                    const tar = inflate(await tarRes.arrayBuffer())

                    // Parse the tarball to an fs
                    this.$data.updating = "Extracting the files in the package..."
                    const tarStream = new Readable()
                    tarStream.push(tar)
                    tarStream.push(null)
                    const files = await this.untar(tarStream)

                    // We're done
                    this.$data.parsed = files.map(x => x.substr("package/".length))
                    this.$data.error = false
                } catch (e) {
                    console.error(e)
                    this.$data.parsed = []
                    this.$data.error = true
                }

                this.$data.updating = false
            },
            open() {
                this.$refs.modal.open()

                this.$nextTick(() => {
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
