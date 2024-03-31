export default function Error({ msg }: { msg: string }) {
  return (
    <div>
      <h1>Error</h1>
      <p>{msg}</p>
    </div>
  );
}
