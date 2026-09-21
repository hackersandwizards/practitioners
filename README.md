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

### Make the names work in Safari and other macOS apps

Chrome resolves `.localhost` names itself. Safari and apps using the macOS system resolver may
not resolve these names automatically. Add explicit entries so the URLs also work there.

Open the hosts file with administrator privileges:

```sh
sudo nano /etc/hosts
```

Keep the existing contents. Add any missing entries below, once each:

```text
127.0.0.1 os.localhost
127.0.0.1 website.localhost
127.0.0.1 trainer-hub.localhost
127.0.0.1 talks.localhost
127.0.0.1 practitioners.localhost
```

Save with Ctrl+O, Enter, then exit with Ctrl+X. Refresh the macOS resolver cache:

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

### Apply changes and troubleshoot

After editing the Caddyfile:

```sh
caddy validate --config "$(brew --prefix)/etc/Caddyfile"
sudo "$(command -v brew)" services restart caddy
```

Check the service and its log:

```sh
sudo "$(command -v brew)" services list
tail -n 50 "$(brew --prefix)/var/log/caddy.log"
curl --noproxy '*' -I http://practitioners.localhost
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
