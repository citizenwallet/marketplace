import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const resources = {
  en: {
    translation: {
      Welcome: "Welcome",
      Language: "Language",
      "Read More": "Read More",
      "Edit post": "Edit post",
      "Posted by": "Posted by",
      ago: "ago",
      English: "English",
      French: "French",
      "New Post": "New Post",
      "Loading your profile...": "Loading your profile...",
      "Create a Profile": "Create a Profile",
      "Create a free profile to start posting":
        "Create a free profile to start posting",
      Marketplace: "Marketplace",
      MarketplaceDescription:
        "Share what you are looking for or what you have to offer.",
      "Loading tags...": "Loading tags...",
      "Loading posts...": "Loading posts...",
      Type: "Type",
      Offer: "Offer",
      Request: "Request",
      Title: "Title",
      "Enter the title": "Enter the title",
      "Post by": "Post by",
      Text: "Text",
      "Enter the description": "Enter the description",
      Tags: "Tags",
      "Tags help people find your": "Tags help people find your",
      Price: "Price",
      "Price for your": "Price for your",
      "optional and always negotiable, rule of thumb: 1":
        "optional and always negotiable, rule of thumb: 1",
      "= 1 hour of work": "= 1 hour of work",
      Contact: "Contact",
      Email: "Email",
      WhatsApp: "WhatsApp",
      Telegram: "Telegram",
      Phone: "Phone",
      "Enter your": "Enter your",
      "Write your number using the international format":
        "Write your number using the international format",
      Your: "Your",
      "will only be visible to people in the community that have":
        "will only be visible to people in the community that have",
      "tokens. It will be removed from our database when your post expires.":
        "tokens. It will be removed from our database when your post expires.",
      "Expiry date": "Expiry date",
      "one week": "one week",
      "one month": "one month",
      "one season": "one season",
      "one year": "one year",
      "Your post will be removed on": "Your post will be removed on",
      Submit: "Submit",
    },
  },
  fr: {
    translation: {
      Welcome: "Bienvenue",
      Language: "Langue",
      "Read More": "Lire la suite",
      "Edit post": "Modifier le post",
      "Posted by": "Posté par",
      ago: "il y a",
      English: "Anglais",
      French: "Français",
      "New Post": "Nouveau post",
      "Loading your profile...": "Chargement de votre profil...",
      "Create a Profile": "Créer un profil",
      "Create a free profile to start posting":
        "Créez un profil gratuit pour commencer à poster",
      Marketplace: "Marché",
      MarketplaceDescription:
        "Partagez ce que vous cherchez ou ce que vous avez à offrir.",
      "Loading tags...": "Chargement des tags...",
      "Loading posts...": "Chargement des posts...",
      Type: "Type",
      Offer: "Offre",
      Request: "Demande",
      Title: "Titre",
      "Enter the title": "Entrez le titre",
      "Post by": "Posté par",
      Text: "Texte",
      "Enter the description": "Entrez la description",
      Tags: "Tags",
      "Tags help people find your": "Les tags aident les gens à trouver votre",
      Price: "Prix",
      "Price for your": "Prix pour votre",
      offer: "offre",
      request: "demande",
      "optional and always negotiable, rule of thumb: 1":
        "optionnel et toujours négociable, règle générale : 1",
      "= 1 hour of work": "= 1 heure de travail",
      Contact: "Contact",
      Email: "Email",
      WhatsApp: "WhatsApp",
      Telegram: "Telegram",
      Phone: "Téléphone",
      "Enter your": "Entrez votre",
      "Write your number using the international format":
        "Écrivez votre numéro en utilisant le format international",
      Your: "Votre",
      "will only be visible to people in the community that have":
        "ne sera visible qu'aux personnes de la communauté qui ont des",
      "tokens. It will be removed from our database when your post expires.":
        "jetons. Il sera supprimé de notre base de données à l'expiration de votre post.",
      "Expiry date": "Date d'expiration",
      "one week": "une semaine",
      "one month": "un mois",
      "one season": "une saison",
      "one year": "un an",
      "Your post will be removed on": "Votre post sera supprimé le",
      Submit: "Soumettre",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  supportedLngs: ["en", "fr"], // Add this line
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
