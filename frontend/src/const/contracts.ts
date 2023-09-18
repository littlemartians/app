import LittleMartiansContract from "../contract/LittleMartians.json";
// import Broadcast from "../contract/run-latest.json";

// const getContractAddress = (contractName: string) => {
//   const contract = Broadcast.transactions.find(
//     (contract: any) => contract.contractName === contractName
//   );
//   if (!contract) {
//     throw new Error(`Contract ${contractName} not found`);
//   }
//   return contract.contractAddress;
// };

export const contracts = {
  LittleMartians: {
    address: "0x1147a355b706120d34cdd90e471572fde8e70e93",
    abi: LittleMartiansContract.abi,
  },
};
