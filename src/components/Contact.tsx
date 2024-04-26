import Link from "next/link";

type IconMap = Record<string, string>;

const icons: IconMap = {
  whatsapp: "/whatsapp-square.svg",
  telegram: "/telegram-square.svg",
  phone: "/phone.svg",
  email: "/email.svg",
};

export default async function Profile({ data }: { data: any }) {
  function className(service: string) {
    if (["phone", "email"].includes(service)) return "dark:invert";
    return "";
  }
  function getLink(service: string, address: string) {
    switch (service) {
      case "whatsapp":
        return `https://wa.me/${data.contactAddress.replace(
          /^00|\+|\s|\./g,
          ""
        )}?text=${encodeURIComponent(data.title)}`;
      case "telegram":
        return `https://t.me/${data.contactAddress.replace(/@/, "")}`;
      case "email":
        return `mailto:${address}?subject=${encodeURIComponent(data.title)}`;
      case "phone":
        return `tel:${address}`;
    }
    return "#";
  }

  return (
    <div className="my-4">
      <h3 className="text-2xl font-bold">Contact</h3>
      <a
        href={getLink(data.contactService, data.contactAddress)}
        target="_blank"
      >
        <div className="flex flex-col text-center justify-center w-32 my-4">
          <center>
            <img
              className={className(data.contactService)}
              src={icons[data.contactService]}
              width={64}
              height={64}
              alt={data.contactService}
            />
          </center>
          <div className="text-sm dark:text-white ">{data.contactAddress}</div>
        </div>
      </a>
    </div>
  );
}
