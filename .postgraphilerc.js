const isProd = process.env.NODE_ENV === "production";

module.exports = {
  options: {
    plugins: ["@graphile/operation-hooks", "@graphile/pg-pubsub"],
    appendPlugins: ["@graphile-contrib/pg-simplify-inflector"],
    connection: "postgres://postgres:postgres@localhost:5435/courier",
    bodySizeLimit: "5KB", // 5000 chars max, per graphql request body
    schema: ["public"],
    simpleSubscriptions: !isProd,
    retyOnInitFail: true,
    cors: !isProd,
    watch: !isProd,
    dynamicJson: true,
    showErrorStack: "json",
    extendedErrors: !isProd
      ? ["hint", "detail", "errcode"]
      : ["hint", "errcode"],
    showErrorStack: !isProd,
    exportSchemaGraphql: !isProd ? "schema.graphql" : undefined,
    enhanceGraphiql: true,
    allowExplain: !isProd,
    enableQueryBatching: !isProd,
  },
};
