export default function Error({
  msg,
  children,
}: {
  msg?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen p-12">
      <h1>Error</h1>
      <p>{msg}</p>
      {children}
    </div>
  );
}
