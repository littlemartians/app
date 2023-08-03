import { useState, useEffect } from 'react';
import { usePrepareContractWrite, useContractWrite, useAccount } from "wagmi";
import { contracts } from "../const/contracts";

interface ContractError extends Error {
  reason: string;
}

const useMint = (to: string, tokenId: number) => {
  const { address } = useAccount();
  const [writeError, setWriteError] = useState<ContractError | null>(null);
  
  const { config, error } = usePrepareContractWrite({
    address: contracts.LittleMartians.address as `0x${string}`,
    abi: contracts.LittleMartians.abi,
    functionName: "mint",
    args: [to, tokenId], // Provide the required arguments
  });


  useEffect(() => {
    if (error) {
      setWriteError(error as ContractError);
    } else {
      setWriteError(null);
    }
  }, [error]);

  return { ...useContractWrite(config), error: writeError };
};

export default useMint;
