import Error from "./Error";

export default function AccountRequiredError() {
  return (
    <Error>
      <p>
        Make sure you are opening this page from the Citizen Wallet app
        (available on the{" "}
        <a href="https://apps.apple.com/app/citizen-wallet/id6460822891">
          App Store
        </a>{" "}
        and{" "}
        <a href="https://play.google.com/store/apps/details?id=xyz.citizenwallet.wallet">
          Google Play Store
        </a>
        )
      </p>
    </Error>
  );
}
