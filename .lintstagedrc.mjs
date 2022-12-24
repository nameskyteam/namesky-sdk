export default {
  "packages/namesky-sdk/**/*.ts": [
    () => "tsc --project tsconfig.json --alwaysStrict",
    "npm run build",
    "prettier --write",
    "eslint --fix"
  ],
  "packages/example/**/*.ts": [
    () => "tsc --project tsconfig.json --alwaysStrict",
    "prettier --write",
    "eslint --fix"
  ],
};
