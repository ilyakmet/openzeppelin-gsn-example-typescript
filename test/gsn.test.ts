import {
  CounterInstance,
  RecipientInstance,
  IRelayHubInstance,
} from "../types/truffle-contracts";

const gsn = require("@openzeppelin/gsn-helpers");
// import { accounts, contract, web3 } from "@openzeppelin/test-environment";

const BN = require("bn.js");
const chai = require("chai");
const { expect } = require("chai");

const Counter = artifacts.require("Counter");
const Recipient = artifacts.require("Recipient");
const IRelayHub = artifacts.require("IRelayHub");

contract("GSNRecipient", ([sender]) => {
  let counterInstance: CounterInstance;
  let recipientInstance: RecipientInstance;
  let iRelayHubInstance: IRelayHubInstance;

  before(async function () {
    await gsn.deployRelayHub(web3, { from: sender });
  });

  beforeEach(async () => {
    counterInstance = await Counter.new();
    recipientInstance = await Recipient.new(counterInstance.address);
    iRelayHubInstance = await IRelayHub.at(
      "0xD216153c06E857cD7f72665E0aF1d7D82172F494",
    );

    await gsn.fundRecipient(web3, { recipient: recipientInstance.address });
  });

  context("when relay-called", function () {
    it("increase", async () => {
      const recipientPreBalance = await iRelayHubInstance.balanceOf(
        recipientInstance.address,
      );
      const senderPreBalance = await web3.eth.getBalance(sender);

      // @ts-ignore
      await recipientInstance.sendTransaction({
        from: sender,
        data: "0xe8927fbc",
        useGSN: true,
      });

      const v = await counterInstance.value();
      const recipientPostBalance = await iRelayHubInstance.balanceOf(
        recipientInstance.address,
      );
      const senderPostBalance = await web3.eth.getBalance(sender);
      console.log({
        recipientPreBalance: recipientPreBalance.toString(),
        recipientPostBalance: recipientPostBalance.toString(),
        senderPreBalance: senderPreBalance.toString(),
        senderPostBalance: senderPostBalance.toString(),
        v: v.toString(),
      });
    });
  });
});
