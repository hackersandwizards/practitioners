# Practitioners | hackers&wizards

The people on [hackersandwizards.dev/team](https://www.hackersandwizards.dev/team/), one folder
each: an English bio, a German bio, a portrait and the profile links they maintain. The website
renders each profile from this repository, so the text you write here is the text a client reads
there. Who appears on that page, and in which group, the website decides.

| You want                           | Go to                                                                |
| ---------------------------------- | -------------------------------------------------------------------- |
| Read the published profiles        | [The team page](https://www.hackersandwizards.dev/team/)             |
| Change your entry in the browser   | [In the browser](CONTRIBUTING.md#in-the-browser)                     |
| Change your entry with Claude Code | [With Claude Code](CONTRIBUTING.md#with-claude-code)                 |
| Change your entry without GitHub   | [CONTRIBUTING.md](CONTRIBUTING.md)                                   |
| Know what your entry needs         | [What goes in your folder](CONTRIBUTING.md#what-goes-in-your-folder) |
| See your page before you send it   | [Preview](#preview)                                                  |
| Know what checks your pull request | [How it is checked](#how-it-is-checked)                              |
| Work on this repository            | [CLAUDE.md](CLAUDE.md)                                               |
| Open our local apps without a port | [docs/local-urls.md](docs/local-urls.md)                             |

## Preview

In the browser, the **Preview** tab shows how your text reads. To see your page as the website lays
it out, with [Bun](https://bun.sh) installed, in your copy of this repository:

```sh
bun install
bun run dev
```

Then open http://localhost:4325/ for every entry, or http://localhost:4325/your-folder/ for yours.

## How it is checked

`src/lib/schema.ts` says what an entry is, and the pre-commit hook in `.githooks/` checks every
staged bio against it on your machine. `bun install` enables the hook. Your pull request gets the
schema check on GitHub, a check that it changes only the bios, `entry.json` and images of one
folder, and a scan for leaked secrets; h&w runs the rest of the hook's checks before the merge.

## Licence and contact

The code is under the [PolyForm Strict License 1.0.0](LICENSE). Your text and portrait stay
yours, and a photographer keeps the rights in their portrait. Questions about your entry go in your
pull request, or in a reply to the mail from h&w.

## Local URLs with Caddy on macOS

Moved to [docs/local-urls.md](docs/local-urls.md). This heading stays for links from other
repositories.
