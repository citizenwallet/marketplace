import { useState, useEffect } from "react";
import { createPublicClient, http } from "viem";
import {
  celo,
  celoAlfajores,
  polygon,
  polygonMumbai,
  gnosis,
  gnosisChiado,
  base,
  baseSepolia,
} from "viem/chains";

import ProfileABI from "smartcontracts/build/contracts/profile/Profile.abi.json";

export const CONFIG_URL = "/api/getConfig";
export const IPFS_BASE_URL = "https://ipfs.internal.citizenwallet.xyz";

interface ChainMap {
  [key: number]: any;
}

const chains: ChainMap = {
  137: polygon,
  80001: polygonMumbai,
  100: gnosis,
  10200: gnosisChiado,
  8453: base,
  84532: baseSepolia,
  42220: celo,
  44787: celoAlfajores,
};

export default class CitizenWalletCommunity {
  communitySlug: string;
  config: any;
  client: any;

  constructor(communitySlug: string) {
    this.communitySlug = communitySlug;
  }

  initClient = async () => {
    if (this.client) return this.client;
    await this.loadConfig();
    const chain = chains[this.config.node.chain_id];
    chain.rpcUrls.default.http = [this.config.node.url];
    chain.rpcUrls.default.webSocket = [this.config.node.ws_url];
    this.client = createPublicClient({
      chain,
      transport: http(),
    });
    return this.client;
  };

  loadConfig = async () => {
    if (this.config) return this.config;
    const response = await fetch(CONFIG_URL, {
      mode: "no-cors",
    });
    if (!response.ok) {
      throw new Error(
        `HTTP error. Unable to fetch ${CONFIG_URL}. Response status: ${response.status}`
      );
    }
    const configs = await response.json();
    const config = configs.find(
      (config: any) => config.community.alias === this.communitySlug
    );
    this.config = config;
    return config;
  };

  getProfile = async (account: string) => {
    await this.initClient();
    const contractAddress = this.config.profile.address;

    const ipfsHash = await this.client.readContract({
      address: contractAddress,
      abi: ProfileABI,
      functionName: "get",
      args: [account],
    });

    return this.fetchJSON(ipfsHash);
  };

  fetchFromIPFS = async (ipfsHash: string) => {
    const ipfsUrl = `${IPFS_BASE_URL}/${ipfsHash.replace("ipfs://", "")}`;
    const response = await fetch(ipfsUrl);
    return await response.text();
  };

  fetchJSON = async (ipfsHash: string) => {
    const data = await this.fetchFromIPFS(ipfsHash);
    return JSON.parse(data);
  };

  getImageSrc = (ipfsHash: string) => {
    const ipfsUrl = `${IPFS_BASE_URL}/${ipfsHash.replace("ipfs://", "")}`;
    return ipfsUrl;
  };
}

export const useCommunity = (communitySlug: string) => {
  const [community, setCommunity] = useState<any>(null);
  useEffect(() => {
    const cw = new CitizenWalletCommunity(communitySlug);
    cw.loadConfig().then((community) => setCommunity(community));
  }, [communitySlug]);
  return [community];
};

export const useProfile = (communitySlug: string, account: string) => {
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    const community = new CitizenWalletCommunity(communitySlug);
    community.getProfile(account).then((profile) => setProfile(profile));
  }, [communitySlug, account]);
  return [profile];
};
