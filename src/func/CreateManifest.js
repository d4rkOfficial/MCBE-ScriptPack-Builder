/**
 * @private
 * @typedef {Object} ManifestInfo
 * @property {string} name - The name of the pack.
 * @property {string} desc - A description of the pack.
 * @property {string} auth - The author's name or identifier.
 * @property {string} uuid1 - The unique UUID for the pack (r).
 * @property {string} uuid2 - The unique UUID for the pack (m).
 * @property {string} uuid3 - The unique UUID for the pack (b).
 * @property {string} uuid4 - The unique UUID for the pack (s).
 * @property {[number, number, number]} min_engine_version - The minimum engine version required.
 * @property {`${number}.${number}.${number}`} minecraft_server_version - The version of minecraft/server.
 * @property {`${number}.${number}.${number}`} minecraft_server_ui_version - The version of the minecraft/server-ui.
 * @property {`${number}.${number}.${number}`} minecraft_server_gametest_version - The version of the minecraft/server-gametest.
 */

/**
 * @typedef {Object} ResourceModule
 * @property {string} description
 * @property {string} type
 * @property {string} uuid
 * @property {[number, number, number]} version
 */

/**
 * @typedef {Object} ResourceDependency
 * @property {string} uuid
 * @property {[number, number, number]} version
 */

/**
 * @typedef {Object} ResourceHeader
 * @property {string} name
 * @property {string} description
 * @property {string} uuid
 * @property {[number, number, number]} version
 * @property {[number, number, number]} min_engine_version
 */

/**
 * @typedef {Object} ResourceManifest
 * @property {number} format_version
 * @property {ResourceHeader} header
 * @property {Array<ResourceModule>} modules
 * @property {Array<ResourceDependency>} dependencies
 */

/**
 * @typedef {Object} BehaviorModule
 * @property {string} description
 * @property {'javascript'} language
 * @property {'script'} type
 * @property {string} uuid
 * @property {[number, number, number]} version
 * @property {string} entry
 */

/**
 * @typedef {Object} BehaviorDependency
 * @property {string} module_name
 * @property {string | [number, number, number]} version
 */

/**
 * @typedef {Object} BehaviorHeader
 * @property {string} name
 * @property {string} description
 * @property {string} uuid
 * @property {[number, number, number]} version
 * @property {[number, number, number]} min_engine_version
 */

/**
 * @typedef {Object} BehaviorManifest
 * @property {number} format_version
 * @property {BehaviorHeader} header
 * @property {Array<BehaviorModule>} modules
 * @property {Array<BehaviorDependency>} dependencies
 */

/**
 * Creates a manifest for both resource and behavior packs.
 * @public
 * @function createManifest
 * @param {Map<string, string>} processArgs - Arguments processed from the command line.
 * @param {ManifestInfo} info - Information about the manifest to be created.
 * @returns {Promise<[ResourceManifest, BehaviorManifest]>} A promise that resolves to an array containing the resource and behavior manifests.
 */
export default async function createManifest(info) {
    /** @type {ResourceManifest} */
    const resourceManifest = {
        format_version: 2,
        header: {
            name: info.name,
            description: info.desc,
            uuid: info.uuid1,
            version: [1, 0, 0],
            min_engine_version: info.min_engine_version,
        },
        modules: [
            {
                description: info.desc,
                type: "resources",
                uuid: info.uuid2,
                version: [1, 0, 0],
            },
        ],
        dependencies: [
            {
                uuid: info.uuid3,
                version: [1, 0, 0],
            },
        ],
    }

    /** @type {BehaviorManifest} */
    const behaviorManifest = {
        format_version: 2,
        header: {
            name: info.name,
            description: info.desc,
            uuid: info.uuid3,
            version: [1, 0, 0],
            min_engine_version: info.min_engine_version,
        },
        modules: [
            {
                description: "Script resources",
                language: "javascript",
                type: "script",
                uuid: info.uuid4,
                version: [1, 0, 0],
                entry: "scripts/main.js",
            },
        ],
        dependencies: [
            {
                module_name: "@minecraft/server",
                version: info.minecraft_server_version.split("-")[0],
            },
            {
                module_name: "@minecraft/server-ui",
                version: info.minecraft_server_ui_version.split("-")[0],
            },
            {
                module_name: "@minecraft/server-gametest",
                version: info.minecraft_server_gametest_version.split("-")[0],
            },
            {
                uuid: info.uuid1,
                version: [1, 0, 0],
            },
        ],
    }

    return [resourceManifest, behaviorManifest]
}
