# Editing the site by hand

There's a private **✎ Edit** button at the bottom of every page. It lets you mark
up the real site directly — rewrite text, nudge things, resize text, hide
elements, pin notes — then package every change into one file for a developer
to apply properly.

**Nothing you do in edit mode changes the live site.** Edits only alter your own
browser's view, as a draft. They become real when someone applies the package.

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
- **⠿ Move** — drag to reposition. Or use the **arrow keys** to nudge by 1px
  (**Shift + arrow** for 10px).
- **A− / A+** — make the text smaller or larger.
- **Hide** — fades the element out to mean "remove this". Press again to bring it back.
- **Note** — pins a note beside the selection. **+ Note** in the bottom bar lets
  you click anywhere on the page to place one. Notes can be dragged.
- **↑ Parent** — selects the block around the current selection. Use it to move
  a whole card or section rather than one line.
- **Reset** — undoes every change to the selected element.
- **Home / Practice / Letter / Book** — switch pages without leaving edit mode.
  In edit mode, clicking the site's own links selects them instead of following them.

Your draft is kept in this browser. Refreshing, switching pages, or closing the
tab loses nothing.

## Saving and handing off

**Save changes** packages every edit on every page into one file:

- **Locally:** it's written straight into the project at `edits/`. Just tell
  the developer it's there.
- **On the live site:** it downloads to your computer. Send the file over.

Saving doesn't clear the draft, so you can keep going and save again. **Discard**
throws the whole draft away; it asks you to click twice.

Once a package has been applied to the site, press **Discard** to start fresh —
the draft refers to the old version of the page.

## What to expect

- **Text** comes through word for word, and is applied exactly.
- **Moves and size changes** are nudges at the screen size you made them on.
  They're read as design intent ("this sits lower", "this is bigger") and
  rebuilt properly so they also work on phones — not pasted in as pixel offsets.
- **Text with mixed styling** — a heading with one italic word, say — shows as
  plain text while you edit it. The styling is restored when the change is applied.
- **The Square booking calendar** can't be edited; it's Square's own page inside a
  frame. Pin a note next to it instead.

## For developers

Code: `components/edit-mode/` (toolbar, store, DOM helpers) and
`app/api/edits/route.ts` (the local writer — development only, returns 404 in
production). Packages land in `edits/`, which is git-ignored.

Each entry in a package carries the element's tag, its **original** source
wording, and the heading of its section, so it can be found in code by text
search. Selectors are included but are tied to the build the edits were made
on — prefer the text.
