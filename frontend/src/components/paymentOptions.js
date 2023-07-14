// import { PaymentOption } from "@superfluid-finance/widget";

const paymentOptions = [
  {
    chainId: 80001,
    receiverAddress: "0x0000000000000000000000000000000000000000",
    superToken: {
      address: "0x42bb40bf79730451b11f6de1cba222f17b87afd7",
    },
    flowRate: {
      amountEther: "1",
      period: "month",
    },
  },
];

export default paymentOptions;
