"use client";
import { useState } from "react";
import SuperfluidWidget from "@superfluid-finance/widget";
import superTokenList from "@superfluid-finance/tokenlist";
import productDetails from "../components/productDetails";
import paymentDetails from "../components/paymentDetails";
import { WagmiConfig } from "wagmi";

import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig, chains } from "../components/wagmi";

import { client, getOwnedBy } from "../components/utils";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [existingLensWallet, setExistingLensWallet] = useState("");
  const [nonExistingLensWallet, setNonExistingLensWallet] = useState("");
  const [lensHandleExists, setLensHandleExists] = useState("");

  async function fetchProfile() {
    try {
      const response = await client.query({
        query: getOwnedBy,
        variables: {
          address: walletAddress,
        },
      });

      if (response.data.defaultProfile == null) {
        setLensHandleExists("false");
        setNonExistingLensWallet(walletAddress);
        setExistingLensWallet("");
      } else {
        setLensHandleExists("true");
        setExistingLensWallet(walletAddress);
        setNonExistingLensWallet("");
      }
    } catch (e) {
      console.log("Error:", e);
    }
  }

  const handleChange = (e) => {
    setWalletAddress(e.target.value);
  };

  const handleSubmit = async () => {
    document.querySelector("#inputField").value = "";

    fetchProfile();
  };

  const customPaymentDetails = paymentDetails.paymentOptions.map((option) => {
    return {
      ...option,
      receiverAddress: existingLensWallet,
    };
  });

  return (
    <main className="bg-white w-screen h-screen flex flex-col">
      <section className="w-screen h-16 flex justify-between items-center border-[#96c687] border-b">
        <section className="w-1/2 ml-10">
          <input
            className="w-2/3 h-10 mr-4 pl-2 text-black outline-none border-[#54b840] border-2 rounded-lg"
            type="text"
            id="inputField"
            name="inputField"
            maxLength="120"
            required
            onChange={handleChange}
          />
          <button
            className="bg-[#54b840] hover:bg-[#52aa41] w-1/8 h-10 px-10 outline-none border-none rounded-lg cursor-pointer"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </section>
        <section className="w-1/2 text-black pr-10">
          <section className="text-black">
            {lensHandleExists == "true" && (
              <section className="text-black">
                <h2>
                  <span className="font-medium">{existingLensWallet}</span> has
                  a Lens handle. You can start a stream
                </h2>
              </section>
            )}
            {lensHandleExists == "false" && (
              <section>
                {nonExistingLensWallet} doesn't have a Lens handle
              </section>
            )}
          </section>
        </section>
      </section>
      <section className="h-20 flex justify-center items-center mt-6 mx-10">
        {lensHandleExists == "true" && (
          <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
              <ConnectButton.Custom>
                {({ openConnectModal, connectModalOpen }) => {
                  const walletManager = {
                    open: async () => openConnectModal(),
                    isOpen: connectModalOpen,
                  };
                  return (
                    <section>
                      <SuperfluidWidget
                        productDetails={productDetails}
                        paymentDetails={{
                          paymentOptions: customPaymentDetails,
                        }}
                        tokenList={superTokenList}
                        type="dialog"
                        walletManager={walletManager}
                      >
                        {({ openModal }) => (
                          <button
                            onClick={() => openModal()}
                            className="bg-[#54b840] hover:bg-[#52aa41] h-16 px-12 font-medium outline-none border-none rounded-full cursor-pointer"
                          >
                            Start Stream
                          </button>
                        )}
                      </SuperfluidWidget>
                    </section>
                  );
                }}
              </ConnectButton.Custom>
            </RainbowKitProvider>
          </WagmiConfig>
        )}
      </section>
    </main>
  );
}
