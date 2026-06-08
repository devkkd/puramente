import React from "react";
import { LOCALES, DEFAULT_LOCALE } from "@/middleware";
import { LocaleProvider } from "@/context/LocaleContext";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const validLocale = LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;

  return (
    <LocaleProvider locale={validLocale}>
      {children}
    </LocaleProvider>
  );
}
