module.exports = {
  apps: [{
    name: "uberuberapi",
    script: "bun",
    args: "src/index.ts",
    env: {
      PORT: process.env.PORT || 3001,
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME
    }
  }]
}
