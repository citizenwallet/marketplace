export default function Error({ msg }: { msg: string }) {
  return (
    <div className="min-h-screen p-12">
      <h1>Error</h1>
      <p>{msg}</p>
    </div>
  );
}
