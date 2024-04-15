import { before } from "node:test";
import CitizenWalletCommunity from "../src/lib/citizenwallet";

const username = "x";
const ipfsHash = "bafybeic54w2ed3ahou3do25li32vqgidttusvguwjefyqgtgir4dqj3fky";
const profile = {
  account: "0xabf962E0DaFa36126DB6C38F7599fe889837c320",
  username: "x",
  name: "Xavier",
  description: "",
  image: "ipfs://QmULwu1iQEAve58FHiMhAsQCMqMTb9M2SV5uZKmWyfdQ3D",
  image_medium: "ipfs://QmRFcEqLNbmioFbYQh5qKx1zEM8gmdD9NBtpuUNwhjJDri",
  image_small: "ipfs://QmXfLyiNVZ6ydtGLUVV438KfSGB3SJV5D6xrNmDwPWifMM",
};

describe("lib.citizenwallet", () => {
  let cw: CitizenWalletCommunity;

  beforeAll(() => {
    // setup
    cw = new CitizenWalletCommunity("zinne");
  });

  it("loads the config", async () => {
    await cw.loadConfig("zinne");
    expect(cw.config.community.alias).toBe("zinne");
    expect(cw.config.token.standard).toBe("erc20");
  });

  it("gets the profile", async () => {
    const profileData = await cw.getProfile(profile.account);
    console.log(profileData);
    expect(profileData).toEqual(profile);
  });

  it("gets the profile from username", async () => {
    const profileData = await cw.getProfileFromUsername(profile.username);
    expect(profileData).toEqual(profile);
  });

  it("returns null when username not found", async () => {
    const profileData = await cw.getProfileFromUsername("none");
    expect(profileData).toEqual(null);
  });

  it("gets latest transactions", async () => {
    const transactions = await cw.getTransactions(profile.account);
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0].from).toBe(profile.account);
  });

  it("gets the balance", async () => {
    const balance = await cw.getBalance(profile.account);
    expect(balance).toBeGreaterThan(0);
  });
});
