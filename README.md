# Safe Multisig Transaction Hashes

This repository contains a web interface for calculating Safe transaction hashes. It helps users verify transaction hashes before signing them on hardware wallets by retrieving transaction details from the Safe Transaction Service API and computing the domain and message hashes using the EIP‑712 standard.

The UI also offers a second method to manually input transaction details instead of recovering them from Safe’s API.

All processing happens in your browser. When using the API method, your browser fetches read‑only transaction data directly from the Safe Transaction Service. For increased security, we recommend running the app locally on a trusted device.

This project is inspired by the `safe-tx-hashes-util` bash script developed by [@pcaversaccio](https://x.com/pcaversaccio). Full details can be found in its original repository: [github.com/pcaversaccio/safe-tx-hashes-util](https://github.com/pcaversaccio/safe-tx-hashes-util/blob/main/README.md).


## Disclaimer

Safe Utils has not been subject to any security assessment and is therefore not suitable for production use. Any use of the tool is at your own risk in accordance with our [Terms of Service](https://www.openzeppelin.com/tos).

This tool is intended to be used as a proof of concept, and feedback and contributions are welcome. While there are few dependencies, you should always do your own investigation and [run the tool locally](https://github.com/openzeppelin/safe-utils?tab=readme-ov-file#run-locally) where possible.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.17+ (20+ recommended)
- npm (usually comes with Node.js)

## Run locally

1. Clone the repository:

   ```bash
   git clone https://github.com/openzeppelin/safe-utils.git
   cd safe-utils
   ```

2. Install dependencies:

   ```bash
   cd app/
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

5. Safe API Key usage (Optional)
   If you have a Safe Transaction Service API key, you can use it to reduce the time between requests and improve reliability. This is optional — the app works without a key.

   Steps:

   - Copy the `.env.example` file to `.env` inside the `app/` directory.
   - Set `SAFE_API_KEY` using a key obtained by following [Safe’s guide](https://docs.safe.global/core-api/how-to-use-api-keys).

   Notes:
   - Requests are made from your browser and include the header `Authorization: Bearer <token>`.
   - Without a key, the app automatically throttles requests to lower the chance of hitting rate limits, but may still encounter 429 responses.
## Usage

For quick and easy access, you can use the hosted version of Safe Hash Preview at [https://safeutils.openzeppelin.com/](https://safeutils.openzeppelin.com/). This version is ready to use without any setup required.

How to use the application:

- Choose the calculation method, defaults to Manual Input. Alternatively, you can use Safe’s API which requires less input.
- Select a network from the dropdown menu.
- Enter the Safe address.
- Fill the rest of the data according to your selected method.
- Click "Calculate Hashes" to view the results.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [React Documentation](https://reactjs.org/) - learn about React.
- [Tailwind CSS](https://tailwindcss.com/) - learn about the utility-first CSS framework used in this project.

## Copyright and Contributing

© 2025 Zeppelin Group Ltd.

Contributions are welcome! Please feel free to submit a Pull Request (you'll be required to sign our standard Contribution License Agreement).
