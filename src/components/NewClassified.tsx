"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Author } from "@/types";
import { ChangeEventHandler, useEffect, useState } from "react";
import { db } from "@/lib/db";
import { useRouter } from "next/navigation";

import CitizenWalletCommunity, {
  useCommunity,
  useProfile,
} from "../lib/citizenwallet";

export default function NewClassified({
  account,
  communitySlug,
}: {
  account: string;
  communitySlug: string;
}) {
  const router = useRouter();
  const cw = new CitizenWalletCommunity(communitySlug);
  const [community] = useCommunity(communitySlug);
  const [profile] = useProfile(communitySlug, account);

  const [formData, setFormData] = useState({
    type: "OFFER",
    title: "",
    text: "",
    tags: "",
    price: "",
    profile: null,
  });

  useEffect(() => {
    if (profile) {
      formData.profile = profile;
    }
  }, [formData, profile]);

  const handleChange = (event: any) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit, data", formData);
    const data = {
      communitySlug,
      status: "PUBLISHED",
      type: formData.type,
      title: formData.title,
      text: formData.text,
      tags: formData.tags,
      price: parseFloat(formData.price) * 10 ** 6,
      currency: community.token.symbol,
      authorName: profile.name,
      authorUsername: profile.username,
      authorAccount: profile.account,
      authorAvatar: profile.image_small,
    };
    console.log(">>> insert", data);
    const res = await fetch("/api/classifieds/new", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    console.log(">>> response", json);
    router.push(`/${communitySlug}`);
    return false;
  };

  return (
    <form className="w-full max-w-96 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <select id="type" onChange={handleChange}>
          <option value="OFFER">Offer</option>
          <option value="REQUEST">Request</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter the title"
          required
          onChange={handleChange}
        />
      </div>
      {!profile ? (
        "loading..."
      ) : (
        <div className="flex items-center space-x-2 space-y-0">
          <div className="rounded-full overflow-hidden w-8 h-8">
            <img
              alt="Avatar"
              className="object-cover w-full h-full"
              height="32"
              src={cw.getImageSrc(profile.image_small)}
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Post by {profile.name} (@{profile.username})
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="text">Text</Label>
        <Textarea
          id="text"
          rows={20}
          placeholder="Enter the description"
          required
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input id="tags" placeholder="Enter tags" onChange={handleChange} />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Comma-separated list of tags
        </p>
      </div>
      <div className="space-y-2">
        <Label>Price</Label>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            step={0.01}
            className="mr-2"
            id="price"
            placeholder="Price"
            onChange={handleChange}
          />
          {community?.token && community.token.symbol}
        </div>
      </div>
      <Button type="submit" variant="default">
        Submit
      </Button>
    </form>
  );
}
