"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Select } from "@/components/ui/select";
// import * as Select from "@radix-ui/react-select";
import { useEffect, useState, useRef } from "react";
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

import type { Post } from "@/types";

export default function EditPost({
  account,
  communitySlug,
  data,
}: {
  account: string;
  communitySlug: string;
  data: Post;
}) {
  const router = useRouter();
  const [community] = useCommunity(communitySlug);
  const [profile] = useProfile(communitySlug, account);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState((data as any) || {});

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

  if (!data) return null;

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

  const handleSelectChange = (
    selectedOption: {
      value: string;
      label: string;
    } | null
  ) => {
    console.log(">>> selectedOption", selectedOption);
    if (!selectedOption) return;
    handleChange({
      target: { id: "contactService", value: selectedOption.value },
    });
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
    const updatedData = {
      id: formData.id,
      communitySlug,
      status: "PUBLISHED",
      type: formData.type,
      title: formData.title,
      text: formData.text,
      tags: formData.tags,
      contactService: formData.contactService,
      contactAddress: formData.contactAddress.trim(),
      price: parseFloat(formData.displayPrice) * 10 ** 6,
      currency: community.token.symbol,
      authorName: profile.name,
      expiryDate: formData.expiryDate,
      authorUsername: profile.username,
      authorAccount: profile.account,
      authorAvatar: profile.image_medium,
    };
    console.log(">>> update", updatedData);
    const res = await fetch("/api/posts", {
      method: "PATCH",
      body: JSON.stringify(updatedData),
    });
    const json = await res.json();
    console.log(">>> response", json);
    router.push(`/${communitySlug}/${formData.id}?account=${profile.account}`);
    setLoading(false);
    return false;
  };

  const labels: { [key: string]: string } = {
    email: "Email address",
    whatsapp: "WhatsApp number",
    telegram: "Telegram username",
    phone: "Phone number",
  };

  const contactServiceOptions = [
    { value: "email", label: "Email" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "telegram", label: "Telegram" },
    { value: "phone", label: "Phone" },
  ];

  return (
    <form className="w-full max-w-96 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <select id="type" onChange={handleChange}>
          <option value="OFFER" selected={data.type === "OFFER"}>
            Offer
          </option>
          <option value="REQUEST" selected={data.type === "REQUEST"}>
            Request
          </option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          defaultValue={data.title}
          placeholder="Enter the title"
          required
          ref={firstInputRef}
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
          defaultValue={data.text}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <TagInput
          communitySlug={communitySlug}
          onChange={handleTagsInput}
          defaultValue={data.tags?.map((t: string) => ({ id: t, text: t }))}
        />
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
            id="displayPrice"
            defaultValue={
              data.displayPrice || (data.price && data.price / 10 ** 6)
            }
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
            <option value="email" selected={data.contactService === "email"}>
              Email
            </option>
            <option
              value="whatsapp"
              selected={data.contactService === "whatsapp"}
            >
              WhatsApp
            </option>
            <option
              value="telegram"
              selected={data.contactService === "telegram"}
            >
              Telegram
            </option>
            <option value="phone" selected={data.contactService === "phone"}>
              Phone
            </option>
          </select>
          <Input
            id="contactAddress"
            defaultValue={data.contactAddress}
            placeholder={`Enter your ${labels[
              formData.contactService
            ].toLowerCase()}`}
            onChange={handleChange}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your {labels[formData.contactService].toLowerCase()} will only be
          visible to people in the community that have {community?.token.symbol}{" "}
          tokens and will be removed definitely from our database when your post
          expires.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiryDateSelector">Expiry date</Label>
        <select id="expiryDateSelector" onChange={handleChangeExpiryDate}>
          <option value={data.expiryDate.toString()}>
            {moment(formData.expiryDate).format("MMMM Do YYYY")}
          </option>
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
        Save
      </button>
    </form>
  );
}
