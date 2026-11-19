# Editing the site by hand

There's a private **✎ Edit** button at the bottom of every page. It lets you mark
up the real site directly — rewrite text, move things, resize text, delete
elements, replace photos, pin notes — and **Save changes** publishes what it
can straight into the site.

Until you save, edits are a draft in your own browser and change nothing else.

## Opening it

| Where | How |
|---|---|
| Running locally (`npm run dev`) | The button is always there. |
| The live site | Visit any page with `?xochi-edit` on the end, e.g. `xochiface.com/?xochi-edit`. This browser remembers it from then on. |
| Turning it off again | Visit with `?xochi-edit=off`. |

Visitors never see the button. Someone who knew the link could switch it on in
*their* browser, but the tools can only change their own view and download a
file — there's nothing on the live site for them to change.

## Using it

Click **✎ Edit**. The bar at the bottom grows into the edit tools.

- **Click** anything to select it. A gold outline and a small toolbar appear.
- **Double-click** text (or press **✎ Text**) to rewrite it. **Enter** keeps the
  change, **Shift+Enter** adds a line break, **Esc** cancels.
- **⠿ Move** — drag to reposition. **Hold Shift while dragging** to keep the
  move perfectly straight — across or up-and-down, whichever way you've moved
  further — with a gold guide line to show it. Or use the **arrow keys** to
  nudge by 1px (**Shift + arrow** for 10px).
- **A− / A+** — make the text smaller or larger.
- **Delete** — removes the element from the page. **↺ Undo delete** in the
  bottom bar brings back the most recent one.
- **Note** — pins a note beside the selection. **+ Note** in the bottom bar lets
  you click anywhere on the page to place one. Notes can be dragged.
- **↑ Parent** — selects the block around the current selection. Use it to move
  a whole card or section rather than one line.
- **Reset** — undoes every change to the selected element.
- **Home / About / Letter / Book** — switch pages without leaving edit mode.
  In edit mode, clicking the site's own links selects them instead of following them.

Your draft is kept in this browser. Refreshing, switching pages, or closing the
tab loses nothing.

## Replacing photos and video

Click any photo on the site — even the hero, through its colour wash — and press
**⇪ Replace**. Pick a photo or video from the computer, or on a phone from the
photo library or camera. It appears in place straight away.

What happens to a photo when it's uploaded:

- **iPhone HEIC photos are converted to JPEG.** (Uploading straight from the
  iPhone usually arrives as JPEG already — iOS converts on the way out.)
- **It's turned the right way up**, so portrait shots don't arrive sideways.
- **It's scaled down, never up.** Phone photos are 12–48 megapixels, several
  times what the site needs, so they're reduced to at most 3200px on the long
  side. You won't need to upscale phone photos; you'd only lose sharpness by
  cropping very tightly.
- **Location data is removed.** iPhones record where every photo was taken.
  That never reaches the website. The untouched original, location included,
  is kept only on this computer (in `edits/media/originals/`, never committed)
  for the final crop.

You'll get a plain warning if a photo is smaller than its spot needs (it may
look soft) or a different shape (it'll be cropped — the preview shows roughly
what stays).

**Video** is accepted and previewed, but kept exactly as uploaded. Making it
web-ready — compressing, trimming, converting from the iPhone's format — needs
a tool called ffmpeg, which isn't installed yet. That happens when the edits are
applied. Keep clips short; a few seconds of slow movement works best.

**Uploads only work while running the site locally.** On the live site, the
Replace button will tell you so — send the photos along with your saved edits.

## Editing from your phone

Handy for using photos straight from the camera roll.

1. Have the phone and this computer on the **same Wi-Fi**, or this computer on
   the phone's **Personal Hotspot**.
2. On this computer, run `npm run dev`.
3. Find this computer's address: run `ipconfig` and look for **IPv4 Address**
   (something like `172.20.10.13` or `192.168.1.24`).
4. On the phone, open `http://THAT-ADDRESS:3000` — e.g. `http://172.20.10.13:3000`.
   The ✎ Edit button is already there.

If the phone can't connect, Windows Firewall is the usual cause: the first time,
Windows may ask whether Node.js can use the network — allow it on **Private**
networks. If you're on a network Windows calls *Public*, it'll block the phone.

While the dev site runs, anyone on the same network could open it. That's fine
at home or on your own hotspot; don't run it on café or hotel Wi-Fi.

## Saving

When the site is running on this computer (including from your phone over the
hotspot), **Save changes** publishes immediately:

- **Text** — your wording replaces the original in the site's code, exactly.
- **Photos** — cropped to the shape of their spot and swapped in.
- **Deletions** — removed, when the element is written out on its own in a page.

The page updates in place, those edits leave the draft, and the change is
saved as a step in the project's history — any save can be undone.

Everything else is saved to `edits/` and waits for Claude: **moves, text size,
notes, video**, and anything that couldn't be pinned to exactly one place —
wording used in several spots (a button label, say), text assembled from
pieces (like "Austin, Texas, by appointment"), or something deleted out of a
list of cards. The message after saving says how many are waiting; just tell
Claude they're there. They stay in your draft until they're applied.

**On the live site** nothing publishes: Save downloads a file to send over.

**Discard** throws the whole draft away; it asks you to click twice.

## What to expect

- **Text** comes through word for word, and is applied exactly.
- **Capitals** — small labels on the site are *styled* in capitals. Type them
  the way you'd write them ("A note from Nicole"); they'll still show in caps.
- **Moves and size changes** are nudges at the screen size you made them on.
  They're read as design intent ("this sits lower", "this is bigger") and
  rebuilt properly so they also work on phones — not pasted in as pixel offsets.
- **Text with mixed styling** — a heading with one italic word, say — shows as
  plain text while you edit it. The styling is restored when the change is applied.
- **The Square booking calendar** can't be edited; it's Square's own page inside a
  frame. Pin a note next to it instead.

## For developers

Code: `components/edit-mode/` (toolbar, store, DOM helpers),
`lib/edits/apply.ts` (publishing on save), and three development-only routes,
all returning 404 in production:

- `app/api/edits/route.ts` — publishes what it can via `lib/edits/apply.ts`,
  then writes the whole package, with a `result` listing what was applied and
  what is left, to `edits/`. Text is matched with the TypeScript parser against
  string literals and JSX text; it must match exactly once (or once in the
  edited page's own file). Touched files are committed unless they already
  held uncommitted work. Anyone on the same network as the dev server can
  reach this route — another reason not to run it on public Wi-Fi.
- `app/api/edits/media/route.ts` — receives uploads; HEIC → JPEG via
  `heic-convert`, then `sharp` to orient, cap at 3200px (no enlargement) and
  strip all metadata
- `app/api/edits/media/[file]/route.ts` — serves uploads back for preview, with
  byte ranges (Safari won't play video without them)

Packages and media land in `edits/`, which is git-ignored. Photo slots are
tagged with `photoAttrs()` from `content/photos.ts`, so a replacement names its
slot, its target file in `assets/photos/`, and the size it needs. Phone access
comes from `allowedDevOrigins` in `next.config.ts`, which trusts this machine's
own network addresses, read at dev-server start.

Next.js must stay at **16.3.8 or later**: 16.3.2 had unauthenticated
remote-code-execution flaws, one specific to Windows hosts — worth knowing
before ever exposing a dev server to a network.

Each entry in a package carries the element's tag, its **original** source
wording, and the heading of its section, so it can be found in code by text
search. Selectors are included but are tied to the build the edits were made
on — prefer the text.
