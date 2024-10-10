/**
 * @private
 * @typedef {Object} info
 * @property {string} name
 * @property {string} desc
 * @property {string} auth
 * @property {string} uuid1
 * @property {string} uuid2
 * @property {string} uuid3
 * @property {string} uuid4
 * @property {[number, number, number]} min_engine_version
 * @property {`{number}.{number}.{number}`} minecraft_server_version
 * @property {`{number}.{number}.{number}`} minecraft_server_ui_version
 */

/**
 * @public
 * @function createManifest
 * @param {Map<string, string>} processArgs
 * @param {Info} info
 * @returns {Promise<[Object, Object]>}
 */
export default async function createManifest(info) {
    const res = {
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
                uuid: "14e467b4-e3aa-49d3-8352-f8439fd7b2ee",
                version: [1, 0, 0],
            },
        ],
    }

    const beh = {
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
                version: info.minecraft_server_version,
            },
            {
                module_name: "@minecraft/server-ui",
                version: info.minecraft_server_ui_version,
            },
            {
                uuid: "2d7ed858-97eb-48a0-b180-7c80d1ce9a48",
                version: [1, 0, 0],
            },
        ],
    }

    return [res, beh]
}
