# Safe Multisig Transaction Hashes

This repository contains both a Bash script and a web interface for calculating Safe transaction hashes. It helps users verify transaction hashes before signing them on hardware wallets by retrieving transaction details from the Safe transaction service API and computing the domain and message hashes using the EIP-712 standard.

The project is a fork of [@pcaversaccio](https://x.com/pcaversaccio) bash script, full details of such bash script README can be found at [its original reository](https://github.com/pcaversaccio/safe-tx-hashes-util/blob/main/README.md).

The UI also offers a second methodo to manually input transaction details instead of recovering them from Safe's API.

## Disclaimer

This is a fork of a script by [@pcaversaccio](https://github.com/pcaversaccio/safe-tx-hashes-util) that adds a user interface. It has not been subject to any security assessment and is therefore not suitable for production use. Any use of the tool is at your own risk in accordance with our [Terms of Service](https://www.openzeppelin.com/tos).

This tool is intended to be used as a proof of concept and feedback and contributions are welcome. While there are few dependencies, you should always do your own investigation and [run the tool locally](https://github.com/openzeppelin/safe-utils?tab=readme-ov-file#run-locally) where possible.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or later)
- npm (usually comes with Node.js)

## Run locally

1. Clone the repository:
   ```bash
   git clone https://github.com/openzeppelin/safe-utils.git
   cd safe-utils
   ```

2. Set up the `safe_hashes.sh` script:
   - Ensure the `safe_hashes.sh` script is located in the parent directory of the app.
   - Make the script executable:
     ```bash
     chmod +x ../safe_hashes.sh
     ```

3. Install dependencies:
   ```bash
   cd app/
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

For quick and easy access, you can use the hosted version of Safe Hash Preview at [https://safeutils.openzeppelin.com/](https://safeutils.openzeppelin.com/). This version is ready to use without any setup required.

How to use the application:
   - Choose the calculation method, defaults to Manual Input. Alternative you can use Safe's API which requires less input.
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
