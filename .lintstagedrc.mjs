export default {
  "packages/namesky-sdk/**/*.ts": [
    "npm run build",
    "prettier --write",
    "eslint --fix"
  ]
};
