export default {
  "packages/namesky-sdk/**/*.ts": [
    "npm run build",
    "prettier --write",
    "eslint --fix"
  ],
  "packages/example/**/*.ts": [
    "prettier --write",
    "eslint --fix"
  ],
};
