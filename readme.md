# JWKS Aggregator

This project aggregates JSON Web Keys (JWKs) from multiple partners into a single JSON Web Key Set (JWKS) file, which can be deployed on GitHub Pages.

## Project Structure

```
.
├── .github
│   └── workflows
│       └── deploy.yml
├── .well-known
│   └── jwks.json
├── pub_keys
│   ├── partenaire1
│   │   └── key.json
│   └── partenaire2
│       └── key.json
├── scripts
│   └── aggregate.js
└── package.json

```

## Requirements

- Node.js (v16 or later)
- Install dependencies with `npm install` (including [jose](https://github.com/panva/jose))

## Usage

1. Place partner JWK files under `pub_keys/<partner_name>/`.
2. Run `npm run build` to aggregate and validate keys.
3. The resulting JWKS file will be generated at `.well-known/jwks.json`.
4. The GitHub Actions workflow deploys the repository to GitHub Pages on every push to the `main` branch.

## License

This project is licensed under the MIT License.
