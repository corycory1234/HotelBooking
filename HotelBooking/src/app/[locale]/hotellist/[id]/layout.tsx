export default function Hotel_Detail_Layout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <div className="lg:min-h-screen">
      {children}
    </div>
  );
}
