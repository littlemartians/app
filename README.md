# Installation

Clone with all subpackages.

    git clone --recursive https://github.com/littlemartians/app

# Setup contracts

```
cd contracts
foundryup
pnpm i
forge install
forge test
```


# Setup graph node

From root:

```
git clone https://github.com/abraham-ai/graph-node.git
cd graph-node/docker
export MNEMONIC="test test test test test test test test test test test junk"
docker compose up
```

There should now be a local anvil blockchain running on localhost:8547, and a local graph node.



To deploy the contract, run:

```
cd contracts
pnpm deploy-local
```



# Subgraph

Make sure contract address in `/src/networks` matches the deployed address in the previous step. Then run:

```
cd subgraph
yarn
yarn refresh-local && yarn prep 1337 && yarn create-local && yarn deploy-local
```

Subgraph will be available [here](http://localhost:8000/subgraphs/name/eden-subgraph-local/graphql?query=query+%7B%0A++mintEvents+%7B%0A++++id%0A++%7D%0A%7D).