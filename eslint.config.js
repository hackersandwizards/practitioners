import base from "@hackersandwizards/scaffolding/eslint/astro";

// .preview/ is the gate's preview build (package.json, check:preview), output like dist/.
export default [...base, { ignores: [".preview/**"] }];
