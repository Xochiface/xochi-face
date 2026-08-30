# Xochi Face — photo shot list

Every image on the site is currently a **placeholder**: free-licence stock from
Unsplash, chosen to match the tone and crop of the real photography rather than
to stand in for it. This is the brief for replacing them.

## How to swap a photo in

1. Shoot to the aspect ratio listed. Crop to it before exporting.
2. Export JPEG, long edge ≥ 2000px, sRGB, quality 80–90.
3. Overwrite the file in `assets/photos/` **keeping the same filename**.
4. Done. Nothing else changes — no code edit, no layout reflow.

Sizes and ratios live in `content/photos.ts`, and every page reads from there,
so a correctly-cropped replacement drops straight in. If a ratio has to change,
change it in that one file.

## The look, across all of them

- **Warm.** Sienna, bone, amber, clay. The palette has no cool tones in it, and
  a cool photograph will fight every surface it sits on. Avoid white, grey,
  teal, and clinical blue — the two biggest failures during placeholder
  selection were a spa shot with a teal towel and a still life on white subway
  tile. Both were technically fine and both were unusable.
- **Low and soft.** Window light, late sun, candle. No flash, no ring light, no
  hard specular highlights.
- **Skin stays skin.** Texture, pores, fine lines, and freckles all stay. Do
  not retouch smooth — the brand's whole argument is that beauty is tended, not
  manufactured.
- **Quiet framing.** Negative space is doing work here. Leave room; the type
  will sit in it.
- **No stock-photo faces.** No posed smiling at camera, no crossed arms, no
  cucumber slices, no white robes.

---

## 1. `hero.jpg` — the opening image

**3:4 vertical · highest priority**

A face at rest, eyes closed, three-quarter or profile. Warm low sun or window
light — sienna and amber. The subject sits to one side of frame with generous
negative space on the opposite side.

That negative space is not optional: the wordmark, headline, and both buttons
sit on the left third of this image on desktop. Shoot it deliberately with the
subject right-of-centre.

It is the first thing anyone sees, it is full-bleed at full viewport height,
and it is the image the whole homepage scrolls up over.

## 2. `stillness.jpg` — the intimacy shot

**4:5 vertical**

A very close crop: jaw, neck, collarbone — or hands at the face mid-treatment.
Shallow depth of field, warm bokeh. Should feel like being in the room rather
than observing it.

Used twice: on the homepage beside the anatomy list, and on `/practice` beside
"what happens".

## 3. `still-life.jpg` — the texture break

**1:1 square**

Still life on bone-toned linen: facial oil, gua sha stone, dried marigold,
folded cloth. Overhead or raking side light. Everything in the bone family.

This one carries the pause between sections, so it should be genuinely quiet —
one or two objects, not a flat-lay of everything you own.

## 4. `founder.jpg` — Nicole

**4:5 vertical**

Nicole, calm, direct to camera, warm ground behind her — ochre, clay, or a bone
wall. Natural light. Not a headshot: shoulders in, room around her.

It needs to read as a person, not a business. It sits beside the letter, which
is written in first person, so the photograph has to be able to hold that.

Worth noting: the current placeholder happens to have dark curly hair against
warm ochre, which rhymes with the portrait mark. That rhyme is a real asset if
it can be repeated — a warm ground and loose dark hair will echo the logo.

## 5. `garden.jpg` — the flower

**4:5 vertical · replace first**

Cempasúchil / marigold — the brand's own flower, and the source of the marigold
ornament and the border chain.

**This is the weakest placeholder of the set.** The current image is a marigold
against saturated cool green, which is the one thing the palette cannot absorb.
Shoot it against a warm ground — clay, bone, a terracotta pot, dry earth — or
close enough that the orange fills the frame.

---

## Still needed alongside the photography

- **Booking platform** — Square, Vagaro, Boulevard, Acuity? `/book` is built and
  waiting; set `bookingUrl` in `content/site.ts` and the page switches over.
- **Address, hours, email, Instagram** — the footer renders visible "to come"
  markers for each of these rather than inventing them.
- **Ornament vectors** — the twelve motifs are currently 180px rasters from the
  PDF. Fine as small accents, too small for display use. The kit links a Drive
  folder for the source files.
- **The twelfth ornament's name** — the deck names eleven of twelve; the fourth
  flower is filed as `flower-04.png`.
