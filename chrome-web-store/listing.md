# Chrome Web Store Listing

Use this file as the source material for the Chrome Web Store Developer Dashboard.

## Package

Upload:

```text
dist/variant-copy-v0.1.0.zip
```

## Store Listing

Title:

```text
Variant Copy
```

Summary:

```text
Copy HTML source from Variant community cards in one click.
```

Category:

```text
Developer Tools
```

Language:

```text
English
```

Detailed description:

```text
Variant Copy adds a small copy button to cards on variant.com/community.

Hover a community card, click the copy button next to the bookmark action, and the extension copies the matching design HTML source to your clipboard.

Features:
- Adds a copy button directly inside Variant community cards
- Copies the HTML source for the selected design
- Works with newly loaded cards during infinite scroll
- Includes a small toolbar popup showing whether the current tab is ready
- Runs only on variant.com/community

Variant Copy is useful for designers and developers who inspect Variant community designs and want a faster way to copy the generated HTML source.
```

Homepage URL:

```text
https://github.com/Ryan-yang125/variant-copy
```

Support URL:

```text
https://github.com/Ryan-yang125/variant-copy/issues
```

Privacy policy URL:

```text
https://github.com/Ryan-yang125/variant-copy/blob/main/PRIVACY.md
```

## Images

Required screenshot:

```text
chrome-web-store/assets/screenshot-1280x800.png
```

Required small promotional image:

```text
chrome-web-store/assets/promo-small-440x280.png
```

Optional marquee promotional image:

```text
chrome-web-store/assets/promo-marquee-1400x560.png
```

## Privacy Tab

Single purpose:

```text
Copy HTML source from Variant community cards when the user clicks the copy button added by the extension.
```

Data usage:

```text
Variant Copy does not collect, store, sell, or share personal information. It does not use analytics, tracking pixels, advertising identifiers, remote logging, or a developer-operated backend.
```

Permission justification for `activeTab`:

```text
Used only when the user opens the toolbar popup, so the popup can check whether the active tab is variant.com/community and display the correct status.
```

Permission justification for `clipboardWrite`:

```text
Used only after the user clicks a copy button on a Variant community card, so the selected design HTML source can be written to the clipboard.
```

Host permission justification for `https://variant.com/design/*.html`:

```text
Used only after the user clicks a copy button, so the extension can fetch the selected design HTML source from Variant.
```

Remote code:

```text
Variant Copy does not load or execute remote code. All extension JavaScript is bundled in the uploaded package.
```

## Distribution

Visibility:

```text
Public
```

Pricing:

```text
Free
```

Regions:

```text
All regions
```

## Test Instructions

```text
No test credentials are required.

1. Open https://variant.com/community.
2. Hover a community card.
3. Click the copy button to the left of the bookmark icon.
4. Confirm that the button changes to a green check state and the HTML source is copied to the clipboard.
5. Open the toolbar popup on the same page and confirm it shows the extension as ready.
```
