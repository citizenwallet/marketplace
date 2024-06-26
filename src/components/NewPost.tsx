"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Author } from "@/types";
import { ChangeEventHandler, useEffect, useState, useRef } from "react";
import { db } from "@/lib/db";
import { useRouter } from "next/navigation";
import TagInput from "./TagInput";
import { useCommunity, useProfile } from "../hooks/citizenwallet";
import { getUrlFromIPFS } from "@/lib/ipfs";
import moment from "moment";

const setExpiryDate = (selector: string): Date => {
  const d = new Date();
  switch (selector) {
    case "month":
      return new Date(d.setMonth(d.getMonth() + 1));
    case "season":
      return new Date(d.setMonth(d.getMonth() + 3));
    case "year":
      return new Date(d.setFullYear(d.getFullYear() + 1));
    default:
      return new Date(d.setDate(d.getDate() + 7));
  }
};

interface Tag {
  id: string;
  text: string;
}

export default function NewPost({
  account,
  communitySlug,
}: {
  account: string;
  communitySlug: string;
}) {
  const router = useRouter();
  const [community] = useCommunity(communitySlug);
  const [profile] = useProfile(communitySlug, account);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "OFFER",
    title: "",
    text: "",
    tags: "",
    price: "",
    expiryDateSelector: "week",
    expiryDate: setExpiryDate("week"),
    contactService: "email",
    contactAddress: "",
    profile: null,
  });

  const firstInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (profile) {
      formData.profile = profile;
    }
  }, [formData, profile]);

  const handleChangeExpiryDate = (event: any) => {
    setFormData({
      ...formData,
      expiryDateSelector: event.target.value,
      expiryDate: setExpiryDate(event.target.value),
    });
  };

  const handleTagsInput = (tags: Tag[]) => {
    handleChange({ target: { id: "tags", value: tags.map((t: Tag) => t.id) } });
  };

  const handleChange = (event: any) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log("submit, data", formData);
    if (!profile) {
      console.error("User profile missing");
      return false;
    }
    const data = {
      communitySlug,
      status: "PUBLISHED",
      type: formData.type,
      title: formData.title,
      text: formData.text,
      tags: formData.tags,
      contactService: formData.contactService,
      contactAddress: formData.contactAddress.trim(),
      price: parseFloat(formData.price) * 10 ** 6,
      currency: community.token.symbol,
      authorName: profile.name,
      expiryDate: formData.expiryDate,
      authorUsername: profile.username,
      authorAccount: profile.account,
      authorAvatar: profile.image_small,
    };
    console.log(">>> insert", data);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      console.log(">>> response", json);
      router.push(`/${communitySlug}?account=${profile.account}`);
      setLoading(false);
      return false;
    } catch (e) {
      console.error("Submit new post error", e);
      setLoading(false);
    }
  };

  const labels: { [key: string]: string } = {
    email: "Email address",
    whatsapp: "WhatsApp number",
    telegram: "Telegram username",
    phone: "Phone number",
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
          ref={firstInputRef}
          onChange={handleChange}
        />
      </div>
      {profile === undefined && "loading..."}
      {profile && (
        <div className="flex items-center space-x-2 space-y-0">
          <div className="rounded-full overflow-hidden w-8 h-8">
            <img
              alt="Avatar"
              className="object-cover w-full h-full"
              height="32"
              src={getUrlFromIPFS(profile.image_small)}
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
        <TagInput communitySlug={communitySlug} onChange={handleTagsInput} />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tags help people find your {formData.type.toLowerCase()}
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
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Price for your {formData.type.toLowerCase()} (optional and always
          negotiable, rule of thumb: 1 {community?.token.symbol} = 1 hour of
          work)
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactService">Contact</Label>
        <div className="flex flex-row">
          <select
            className="w-32 mr-1"
            id="contactService"
            onChange={handleChange}
          >
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="phone">Phone</option>
          </select>
          <Input
            id="contactAddress"
            placeholder={`Enter your ${labels[
              formData.contactService
            ].toLowerCase()}`}
            onChange={handleChange}
          />
        </div>
        <>
          {formData.contactService === "whatsapp" && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Write your number using the international format
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your {labels[formData.contactService].toLowerCase()} will only be
            visible to people in the community that have{" "}
            {community?.token.symbol} tokens. It will be removed from our
            database when your post expires.
          </p>
        </>
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiryDateSelector">Expiry date</Label>
        <select id="expiryDateSelector" onChange={handleChangeExpiryDate}>
          <option value="week">one week</option>
          <option value="month">one month</option>
          <option value="season">one season</option>
          <option value="year">one year</option>
        </select>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your post will be removed on{" "}
          {moment(formData.expiryDate).format("MMMM Do YYYY")}{" "}
        </p>
      </div>
      <button type="submit" className="button w-full !py-6" disabled={loading}>
        Submit
      </button>
    </form>
  );
}
