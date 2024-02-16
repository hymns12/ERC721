import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";


describe("SaveEther Contract Test", function () {
  async function deploySaveERC20(){
    const ERC20 = await ethers.getContractFactory("ERC20Token");
    const erc20 = await ERC20.deploy();

    const SaveERC20 = await ethers.getContractFactory("SaveERC20");
    const saveERC20 = await SaveERC20.deploy(erc20.target);


    const [account1, account2] = await ethers.getSigners();
    const amountToDeposit = 500
    return { erc20, saveERC20, account1, account2, amountToDeposit };
  };

  async function approveERC20(address: any, amount: any){
    const { erc20, saveERC20, account1} = await loadFixture(deploySaveERC20);
    await erc20.approve(address, amount);
  };


  describe("Contract", async () => {
    it("can deposit and check savings", async () => {
      const { saveERC20, account1, amountToDeposit} = await loadFixture(deploySaveERC20);
      await approveERC20(saveERC20.target, amountToDeposit) //Approve Contract

      await saveERC20.deposit(amountToDeposit);

      const balance= await saveERC20.checkUserBalance(account1.address)
      expect(balance).to.equal(amountToDeposit);
  });

  it("can check contract balance", async () => {
    const { saveERC20, account1, amountToDeposit} = await loadFixture(deploySaveERC20);
    await approveERC20(saveERC20.target, amountToDeposit) //Approve Contract

    await saveERC20.deposit(amountToDeposit);

    const balance= await saveERC20.checkContractBalance()

    expect(balance).to.equal(amountToDeposit);
  });

  
  })            
});