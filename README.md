# Variant Copy

Variant Copy is a small Chrome/Edge extension that adds a one-click copy action to [Variant Community](https://variant.com/community) cards.

Hover a community card, click the copy button next to Variant's bookmark and like controls, and the card's HTML source is copied to your clipboard.

## Demo

<video src="assets/varientcopy.mp4" controls width="900"></video>

## Features

- Adds a copy button directly inside Variant community cards.
- Copies the selected card's HTML source with one click.
- Shows a success state after the copy finishes.
- Keeps working as new cards load during infinite scroll.
- Includes a small toolbar popup showing whether the current tab is ready.
- Runs only on `https://variant.com/community*`.

## Install From GitHub Release

1. Open the latest release on GitHub.
2. Download `variant-copy-v0.1.0.zip`.
3. Unzip the file.
4. Open `chrome://extensions` or `edge://extensions`.
5. Enable Developer mode.
6. Click "Load unpacked".
7. Select the unzipped folder.
8. Reload [variant.com/community](https://variant.com/community).

## Install From Source

```bash
git clone https://github.com/Ryan-yang125/variant-copy.git
cd variant-copy
npm run icons
npm run check
```

Then load the repository folder from `chrome://extensions` with Developer mode enabled.

## Privacy

Variant Copy does not collect, store, sell, or share personal information.

It does not use analytics, tracking pixels, advertising identifiers, remote logging, or a developer-operated backend.

Privacy details are documented in [PRIVACY.md](PRIVACY.md).

## License

MIT
