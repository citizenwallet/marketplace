"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import TagInput from "./TagInput";
import { useCommunity, useProfile } from "../hooks/citizenwallet";
import { getUrlFromIPFS } from "@/lib/ipfs";
import moment from "moment";
import "moment/locale/fr";
import "moment/locale/en-gb";
import { Translator } from "@/lib/i18n.client";
import { InsertPostData } from "@/db/posts";
import { insertPostAction } from "@/app/[communitySlug]/new/actions";

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
  lang,
}: {
  account: string;
  communitySlug: string;
  lang: string;
}) {
  const t = Translator(lang);
  moment.locale(lang);
  const router = useRouter();
  const [community] = useCommunity(communitySlug);
  const [profile] = useProfile(communitySlug, account);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "OFFER",
    title: "",
    text: "",
    tags: [],
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

    const data: InsertPostData = {
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
      await insertPostAction(communitySlug, data);
      router.push(`/${communitySlug}?account=${profile.account}`);
      setLoading(false);
      return false;
    } catch (e) {
      console.error("Submit new post error", e);
      setLoading(false);
    }
  };

  const labels: { [key: string]: string } = {
    email: t("Email address"),
    whatsapp: t("WhatsApp number"),
    telegram: t("Telegram username"),
    phone: t("Phone number"),
  };

  return (
    <form className="w-full max-w-96 space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="type">{t("Type")}</Label>
        <select id="type" onChange={handleChange}>
          <option value="OFFER">{t("Offer")}</option>
          <option value="REQUEST">{t("Request")}</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">{t("Title")}</Label>
        <Input
          id="title"
          placeholder={t("Enter the title")}
          required
          ref={firstInputRef}
          onChange={handleChange}
        />
      </div>
      {profile === undefined && t("Loading your profile...")}
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
            {t("Post by")} {profile.name} (@{profile.username})
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="text">{t("Text")}</Label>
        <Textarea
          id="text"
          rows={20}
          placeholder={t("Enter the description")}
          required
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">{t("Tags")}</Label>
        <TagInput
          communitySlug={communitySlug}
          onChange={handleTagsInput}
          lang={lang}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 lowercase first-letter:uppercase">
          {t("Tags help people find your")}{" "}
          {formData.type === "OFFER" ? t("Offer") : t("Request")}
        </p>
      </div>
      <div className="space-y-2">
        <Label>{t("Price")}</Label>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            step={0.01}
            className="mr-2"
            id="price"
            placeholder={t("Price")}
            onChange={handleChange}
          />
          {community?.token && community.token.symbol}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 lowercasefirst-letter:uppercase">
          {t("Price for your")}{" "}
          {formData.type === "OFFER" ? t("Offer") : t("Request")} (
          {t("optional and always negotiable, rule of thumb: 1")}{" "}
          {community?.token.symbol} {t("= 1 hour of work")})
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactService">{t("Contact")}</Label>
        <div className="flex flex-row">
          <select
            className="w-32 mr-1"
            id="contactService"
            onChange={handleChange}
          >
            <option value="email">{t("Email")}</option>
            <option value="whatsapp">{t("WhatsApp")}</option>
            <option value="telegram">{t("Telegram")}</option>
            <option value="phone">{t("Phone")}</option>
          </select>
          <Input
            id="contactAddress"
            placeholder={`${t("Enter your")} ${
              labels[formData.contactService]
            }`}
            onChange={handleChange}
          />
        </div>
        <>
          {formData.contactService === "whatsapp" && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("Write your number using the international format")}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("Your")} {labels[formData.contactService]}{" "}
            {t("will only be visible to people in the community that have")}{" "}
            {community?.token.symbol}{" "}
            {t(
              "tokens. It will be removed from our database when your post expires."
            )}
          </p>
        </>
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiryDateSelector">{t("Expiry date")}</Label>
        <select id="expiryDateSelector" onChange={handleChangeExpiryDate}>
          <option value="week">{t("one week")}</option>
          <option value="month">{t("one month")}</option>
          <option value="season">{t("one season")}</option>
          <option value="year">{t("one year")}</option>
        </select>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("Your post will be removed on")}{" "}
          {moment(formData.expiryDate).format("MMMM Do YYYY")}
        </p>
      </div>
      <button type="submit" className="button w-full !py-6" disabled={loading}>
        {t("Submit")}
      </button>
    </form>
  );
}
