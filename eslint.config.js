import base from "@hackersandwizards/scaffolding/eslint/astro";

// .preview/ is the gate's preview build (package.json, check:preview), output like dist/.
// src/content/ is the practitioners' own: a config file there would run as code in the gate.
export default [...base, { ignores: [".preview/**", "src/content/**"] }];
