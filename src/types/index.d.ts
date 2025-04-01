/**
 * @fileoverview 类型定义
 */

export interface ManifestInfo {
    name: string
    desc: string
    auth: string
    uuid1: string
    uuid2: string
    uuid3: string
    uuid4: string
    min_engine_version: [number, number, number]
    minecraft_server_version: string
    minecraft_server_ui_version: string
    minecraft_server_gametest_version: string
}

export interface ResourceModule {
    description: string
    type: string
    uuid: string
    version: [number, number, number]
}

export interface ResourceDependency {
    uuid: string
    version: [number, number, number]
}

export interface ResourceHeader {
    name: string
    description: string
    uuid: string
    version: [number, number, number]
    min_engine_version: [number, number, number]
}

export interface ResourceManifest {
    format_version: number
    header: ResourceHeader
    modules: ResourceModule[]
    dependencies: ResourceDependency[]
}

export interface BehaviorModule {
    description: string
    language: 'javascript'
    type: 'script'
    uuid: string
    version: [number, number, number]
    entry: string
}

export interface BehaviorDependency {
    module_name?: string
    uuid?: string
    version: string | [number, number, number]
}

export interface BehaviorHeader {
    name: string
    description: string
    uuid: string
    version: [number, number, number]
    min_engine_version: [number, number, number]
}

export interface BehaviorManifest {
    format_version: number
    header: BehaviorHeader
    modules: BehaviorModule[]
    dependencies: BehaviorDependency[]
}

export interface ProjectConfig {
    name: string
    description: string
    resourceManifest: ResourceManifest
    behaviorManifest: BehaviorManifest
    serverVersion: string
    uiVersion: string
    gametestVersion: string
    dataVersion: string
}

export interface DependencyVersions {
    server: string[]
    ui: string[]
    test: string[]
    data: string[]
}
