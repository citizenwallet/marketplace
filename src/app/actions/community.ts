"use server";

import { Config } from "@citizenwallet/sdk";

export async function getCommunityConfig(
  communitySlug: string
): Promise<Config | null> {
  const response = await fetch(
    "https://config.internal.citizenwallet.xyz/v4/communities.json"
  );
  const data = await response.json();

  const config = data.find(
    (config: Config) => config.community.alias === communitySlug
  );

  return config ? config : null;
}
