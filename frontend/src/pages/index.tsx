import { ConnectButton } from "@rainbow-me/rainbowkit";
import Balance from "../components/MintButton";
import AudioInterface from "../components/AudioInterface";
import LittleMartian from "../components/LittleMartian";
import nebulana from "../martians/nebulana";

export default function Home() {
  return (
    <div>
      {/* <h1 className="text-3xl font-bold underline">Hello world!</h1> */}
      {/* <ConnectButton /> */}
      {/* <Balance /> */}
      <AudioInterface />
      {/* <LittleMartian martian={nebulana} /> */}
    </div>
  );
}
