# Dolphin Team website

Static website for the **Dolphin Team** at the Neural Circuit dynamics & Behaviour laboratory, IBENS. It presents the team, its publications and affiliations, alongside dedicated pages for its research projects.

The website currently includes **OpenWhistle**, a large-scale longitudinal dataset and benchmark of bottlenose dolphin vocalizations. The OpenWhistle paper is a NeurIPS 2026 Spotlight.

## Pages

- `index.html` — Dolphin Team, publications, and affiliations
- `openwhistle/index.html` — OpenWhistle project page

## Run locally

No build step or package installation is required. From the repository root, run:

```bash
python -m http.server 8000
```

Then open:

- <http://localhost:8000/> — Dolphin Team
- <http://localhost:8000/openwhistle/> — OpenWhistle

## Project structure

```text
.
├── index.html
├── openwhistle/
│   └── index.html
├── styles.css
├── script.js
└── assets/
    ├── fonts/
    ├── images/
    │   ├── dataset/
    │   ├── pipeline/
    │   ├── team/
    │   └── whistles/
    └── papers/
```

## Resources

- [OpenWhistle dataset collection](https://huggingface.co/collections/dolphinteam/neurips26-openwhistle)
- [Dolphin Team laboratory](https://www.zebrain.biologie.ens.fr/)

## Deployment

The website is dependency-free and can be deployed directly with GitHub Pages. Configure Pages to publish from the repository root of the selected branch; no build workflow is needed.
