// import "../globals.css";
import React from "react";
import ProviderRedux from "@/provider/provider";
import { Metadata } from "next";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Toaster_Notify from "@/components/toaster/toaster";


export const metadata: Metadata = {
  title: "Go Tour",
  description: "Get special price here!",
  icons: { icon: '/gotour.svg' }
}

export default async function LocaleLayout({
  children, 
  params: {locale}
}: 
  Readonly<{
    children: React.ReactNode; 
    params: {locale: string};
  }>) {
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();


  return (
    // <html lang={locale}>
      // <body>
        <NextIntlClientProvider messages={messages}>
          <ProviderRedux> 
            <Toaster_Notify></Toaster_Notify>
            {children}
          </ProviderRedux>
        </NextIntlClientProvider>
      // </body>
    // </html>
  );
}
