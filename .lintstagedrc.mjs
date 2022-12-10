export default {
  "packages/nnn-sdk/**/*.ts": [
    () => "tsc --project tsconfig.json --alwaysStrict",
    "npm run build",
    "prettier --write",
    "eslint --fix"
  ],
};
