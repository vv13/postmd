# PostMD

PostMD is a web-based Markdown-to-poster editor. Write Markdown on the left, preview the rendered poster on the right, and export it as a high-quality image.

Live demo: https://vv13.github.io/postmd

## Features

- Split-pane layout with resizable panels (drag to adjust editor/preview ratio)
- 9 built-in color themes with one-click switching
- Adjustable poster width (320px–1200px) and export scale (1x/2x/3x)
- KaTeX math formula rendering (inline & block)
- GFM support (tables, strikethrough, task lists)
- Copy poster to clipboard or download as PNG
- Built with React + Vite + Tailwind CSS

## Getting Started

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:5173` in your browser.

### Build

```bash
pnpm run build
```

Output goes to `dist/`.

### Deploy

```bash
pnpm run deploy
```

Deploys to GitHub Pages with base path `/postmd/`.

## Contributing

1. Fork and Submit Pull Requests
2. Open Issues for suggestions and bug reports
3. Spread the Word — star the repo or recommend it to others

## License

Apache 2.0

## Questions, Suggestions, Issues, or Bugs?

We use GitHub Issues to manage feedback. Feel free to open an issue.
