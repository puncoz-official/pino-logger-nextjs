declare module "eslint-plugin-import" {
  const plugin: {
    rules: Record<string, unknown>
    configs: Record<string, unknown>
    flatConfigs: {
      recommended: Record<string, unknown>
    }
  }

  export = plugin
}
