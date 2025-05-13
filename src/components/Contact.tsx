type IconMap = Record<string, string>;

const icons: IconMap = {
  whatsapp: "/whatsapp-square.svg",
  telegram: "/telegram-square.svg",
  phone: "/phone.svg",
  email: "/email.svg",
};

type ContactData = {
  contactService: string | null;
  contactAddress: string | null;
  title: string | null; // title of the post to prefill the contact message
};

export default async function Profile({ data }: { data: ContactData }) {
  function className(service: string) {
    return "brightness-0 invert";
  }
  function getLink(service: string, address: string) {
    console.log(service, address);
    switch (service) {
      case "whatsapp":
        return `https://wa.me/${data.contactAddress?.replace(
          /^00|\+|\s|\./g,
          ""
        )}?text=${encodeURIComponent(data.title || "")}`;
      case "telegram":
        return `https://t.me/${data.contactAddress?.replace(/@/, "")}`;
      case "email":
        return `mailto:${address}?subject=${encodeURIComponent(
          data.title || ""
        )}`;
      case "phone":
        return `tel:${address}`;
    }
    return "#";
  }

  return (
    <div className="my-2 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 cursor-pointer">
      <a
        href={getLink(data.contactService ?? "", data.contactAddress ?? "")}
        target="_blank"
      >
        <div className="h-[24px] flex text-center align-center justify-center w-full gap-2">
          <div className="h-[24px] flex items-center justify-center text-sm text-white">
            {data.contactAddress}
          </div>
          <img
            className={`${className(data.contactService ?? "")}`}
            src={icons[data.contactService ?? ""]}
            width={24}
            height={24}
            alt={data.contactService ?? ""}
          />
        </div>
      </a>
    </div>
  );
}
