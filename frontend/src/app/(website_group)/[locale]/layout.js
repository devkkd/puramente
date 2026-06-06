import React from "react";
import { LOCALES, DEFAULT_LOCALE } from "@/middleware";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuestionsBanner from "@/components/QuestionsBanner";
import FloatingActions from "@/components/FloatingActions";
import { LocaleProvider } from "@/context/LocaleContext";

// Tell Next.js which locale slugs to pre-render at build time
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const validLocale = LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;

  return (
    <LocaleProvider locale={validLocale}>
      <div className="flex flex-col min-h-screen w-full relative">
        <Header locale={validLocale} />
        <div className="grow">
          {children}
        </div>
        <QuestionsBanner />
        <Footer locale={validLocale} />
        <FloatingActions />
      </div>
    </LocaleProvider>
  );
}
