import React from "react";
import { useWaitForTransaction } from "wagmi";
import useMint from "../hooks/useMint";

const Balance = () => {

  const toAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with the actual address you want to mint to
  const tokenId = 31; // Replace with the actual token ID you want to mint

  const { data, write, error } = useMint(toAddress, tokenId);

  
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const onMintButtonClicked = () => {
    write?.();
  };

  return (
    <>
      <h4>Little Martians</h4>
      {error ? (
        <p>Cannot mint: {error.reason}</p>
      ) : (
        <button onClick={onMintButtonClicked} disabled={isLoading}>
          Claim Token
        </button>
      )}
    </>
  );
};

export default Balance;
