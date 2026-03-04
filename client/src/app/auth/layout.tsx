export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Footer is hidden on /auth/* routes via FooterConditional in root layout
  return <>{children}</>;
}
