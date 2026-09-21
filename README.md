# Practitioners | hackers&wizards

The people on [hackersandwizards.dev/practitioners](https://www.hackersandwizards.dev/practitioners/),
one directory each: an English bio, a German bio, a portrait and the profile links they maintain.
The website reads this repo as a git submodule, so a change here is what a client reads there.

Who appears on that page, in which group and with which title is the website's roster and stays
there. This repo holds what each person says about themselves.

## Your entry

```bash
git clone https://github.com/hackersandwizards/practitioners.git
cd practitioners
bun install
bun run dev
```

Open Claude Code in the repo and say "create my bio". It asks for your links and a portrait,
interviews you for a few minutes, drafts the English and the German text, shows both at
http://localhost:4325 and commits when you approve. Ask Stefan or Bene for write access, then
push to main.

## Local URLs with Caddy on macOS

This is the shared setup guide for our local apps. Caddy gives each app a URL without a port.
The app still runs separately with `bun run dev`. Caddy starts automatically at boot.
This setup is optional: the apps also work through their direct localhost ports.

| App           | Local URL                      | App port |
| ------------- | ------------------------------ | -------- |
| OS            | http://os.localhost            | 4321     |
| Website       | http://website.localhost       | 4322     |
| Trainer Hub   | http://trainer-hub.localhost   | 4323     |
| Talks         | http://talks.localhost         | 4324     |
| Practitioners | http://practitioners.localhost | 4325     |

### Install Caddy

Install [Homebrew](https://brew.sh/) first if `brew --version` does not work. Then run:

```sh
brew install caddy
```

### Configure the local URLs

Open the configuration file:

```sh
nano "$(brew --prefix)/etc/Caddyfile"
```

For a new installation, paste the configuration below. If you already use Caddy, preserve your
existing sites and merge these entries. A Caddyfile can have only one global options block.

```caddyfile
{
    admin off
}

http://os.localhost {
    bind 127.0.0.1
    reverse_proxy 127.0.0.1:4321
}

http://website.localhost {
    bind 127.0.0.1
    reverse_proxy 127.0.0.1:4322
}

http://trainer-hub.localhost {
    bind 127.0.0.1
    reverse_proxy 127.0.0.1:4323
}

http://talks.localhost {
    bind 127.0.0.1
    reverse_proxy 127.0.0.1:4324
}

http://practitioners.localhost {
    bind 127.0.0.1
    reverse_proxy 127.0.0.1:4325
}
```

Save with Ctrl+O, Enter, then exit with Ctrl+X. You can keep all five entries even if you only
use Practitioners. They do not start or install the other apps.

`bind 127.0.0.1` keeps the proxy local to your Mac. Explicit `http://` avoids certificate setup.
The admin API is disabled, so configuration changes require a service restart.
Saving the file or running `caddy validate` does not update a running Caddy process.
After adding an app, follow [First aid](#first-aid) to load the new route.

### Make the names work in Safari and other macOS apps

Chrome resolves `.localhost` names itself. Safari and apps using the macOS system resolver may
not resolve these names automatically. Add explicit entries so the URLs also work there.

For a fresh setup, run this single-line command once. It appends the names without replacing
existing hosts entries and asks for your Mac password:

```sh
printf '\n127.0.0.1 os.localhost website.localhost trainer-hub.localhost talks.localhost practitioners.localhost\n' | sudo tee -a /etc/hosts
```

If you already added these names, skip this command. To correct existing entries, use
`sudo nano /etc/hosts` instead of appending duplicates.

If the terminal shows `heredoc>` or `>` after pasting an earlier multiline command, it is waiting
for the closing marker. Press Ctrl+C to cancel, then paste the single-line command above.
For a command beginning with `<<'EOF'`, typing `EOF` alone on a new line also ends the input.

Refresh the macOS resolver cache:

```sh
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

Quit and reopen a browser that still reports an unknown server. Verify system name resolution:

```sh
dscacheutil -q host -a name website.localhost
```

The result should include `127.0.0.1`. These entries match Caddy's IPv4 loopback binding;
no public DNS records are needed. See the [WebKit localhost subdomain issue](https://bugs.webkit.org/show_bug.cgi?id=160504).

### Start Caddy automatically

Validate the configuration before starting the service:

```sh
caddy validate --config "$(brew --prefix)/etc/Caddyfile"
```

If you previously started Caddy without `sudo`, stop that login service first:

```sh
brew services stop caddy
```

Start the system service with your Mac password. This also registers Caddy to start at boot:

```sh
sudo "$(command -v brew)" services start caddy
```

The system service can bind port 80, which a login service may lack permission to use.
Another server already using port 80 must be stopped or reconfigured first.

### Start an app and open its URL

In a current checkout of the app, install its dependencies and start it:

```sh
bun install
bun run dev
```

The console prints its Caddy URL. For this repo, open http://practitioners.localhost.
The repositories set their own ports; Caddy does not choose them or launch the apps.
Use the URL only after the app reports that it is running.

### First aid

For a blank page after adding an app, validate and restart Caddy. This loads the current
Caddyfile. The restart briefly interrupts all local Caddy URLs:

```sh
caddy validate --config "$(brew --prefix)/etc/Caddyfile" && sudo "$(command -v brew)" services restart caddy
```

Only restart if validation succeeds. Then reload the page. A Caddy process using an old
configuration can answer an unknown hostname with HTTP 200 and an empty body.
HTTP 200 alone does not prove the app is being served.

Check both status and downloaded content, using Practitioners as an example:

```sh
curl --noproxy '*' -sS -o /dev/null -w 'HTTP %{http_code}, body %{size_download} bytes\n' http://practitioners.localhost
curl --noproxy '*' -sS -o /dev/null -w 'HTTP %{http_code}, body %{size_download} bytes\n' http://127.0.0.1:4325
```

Both should return HTTP 200 with a nonempty body. For another app, use its hostname and port
from the table above.

| Symptom                                                            | First action                                                                                                                                                      |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Blank page, HTTP 200 with 0 bytes, but the direct port serves HTML | Run the validate-and-restart command above.                                                                                                                       |
| `502 Bad Gateway` or the direct port refuses the connection        | Run `bun run dev` in the app's repo and check its port. Caddy does not start apps.                                                                                |
| Browser cannot find the server                                     | Check `/etc/hosts`: every line containing hostnames must begin with `127.0.0.1`. Follow the Safari setup above, flush the resolver cache, and reopen the browser. |
| Terminal waits at `heredoc>`                                       | Press Ctrl+C and use the single-line hosts command above.                                                                                                         |

If the page is still blank despite a nonempty HTML response, check browser console errors;
restarting Caddy does not repair app rendering errors.

### Further diagnostics

Check the service and its log:

```sh
sudo "$(command -v brew)" services list
tail -n 50 "$(brew --prefix)/var/log/caddy.log"
```

A `502 Bad Gateway` usually means the app is stopped or listening on the wrong address or port.
Check its startup output. Practitioners should listen on `127.0.0.1:4325`.
If that port works directly but the hostname does not, check Caddy's status and restart after configuration changes.
If the log reports `address already in use`, identify the listener with `sudo lsof -nP -iTCP:80 -sTCP:LISTEN`.
Use `http://`, not `https://`, with this configuration.

To stop Caddy and remove its automatic startup registration:

```sh
sudo "$(command -v brew)" services stop caddy
```

References: [Homebrew services](https://docs.brew.sh/Manpage#services-subcommand),
[Caddy reverse proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy),
[local binding](https://caddyserver.com/docs/caddyfile/directives/bind), and
[HTTP and automatic HTTPS](https://caddyserver.com/docs/automatic-https).

## How it is checked

There is no CI. `src/lib/schema.ts` says what an entry is; the pre-commit hook in `.githooks/`
checks every staged bio against it on your machine, and the website build checks it again when it
pulls the submodule. `bun install` enables the hook.

## Layout

```
src/content/practitioners/<slug>/   bio.md, bio.de.md, photo.webp
src/lib/schema.ts                   the contract every bio.md meets
src/pages/index.astro               the preview, alphabetical
.claude/skills/practitioner-bio/    the interview
.githooks/                          the gate
```
