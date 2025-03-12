#!/bin/bash

# Create chains directory if it doesn't exist
mkdir -p public/chains

# Download chain icons
curl -o public/chains/btc.svg "https://cryptologos.cc/logos/bitcoin-btc-logo.svg"
curl -o public/chains/eth.svg "https://cryptologos.cc/logos/ethereum-eth-logo.svg"
curl -o public/chains/zksync.svg "https://raw.githubusercontent.com/matter-labs/zksync-web-v2-docs/main/docs/assets/images/logo.svg"
curl -o public/chains/base.svg "https://raw.githubusercontent.com/base-org/node/main/docs/base.svg"
curl -o public/chains/solana.svg "https://cryptologos.cc/logos/solana-sol-logo.svg"
curl -o public/chains/aptos.svg "https://raw.githubusercontent.com/aptos-labs/aptos-core/main/ecosystem/typescript/sdk/src/generated/logo.svg"
curl -o public/chains/sui.svg "https://raw.githubusercontent.com/MystenLabs/sui/main/apps/icons/src/sui.svg"
curl -o public/chains/cosmos.svg "https://cryptologos.cc/logos/cosmos-atom-logo.svg"
curl -o public/chains/celestia.svg "https://raw.githubusercontent.com/celestiaorg/celestia-app/main/docs/static/celestia.svg"

# Note: Some icons might not be available in SVG format, you may need to manually download them:
# - Zircuit
# - CKB
# - Sonic
