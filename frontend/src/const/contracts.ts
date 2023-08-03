import LittleMartiansContract from "../contract/LittleMartians.json";
import Broadcast from "../contract/run-latest.json";

const getContractAddress = (contractName: string) => {
  const contract = Broadcast.transactions.find(
    (contract: any) => contract.contractName === contractName
  );
  if (!contract) {
    throw new Error(`Contract ${contractName} not found`);
  }
  return contract.contractAddress;
};

export const contracts = {
  LittleMartians: {
    address: getContractAddress("LittleMartians"),
    abi: LittleMartiansContract.abi,
  },
};
