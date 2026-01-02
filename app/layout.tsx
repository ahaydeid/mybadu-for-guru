import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyBadu - For Guru",
  description: "Aplikasi manajemen absensi guru",
};

export const viewport: Viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning={true}>
      <head>
        {/* Anti-Extension Injection Scrub Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const scrub = (node) => {
                  const target = node || document.documentElement;
                  const attributes = ['bis_skin_checked', 'data-bis-skin-checked'];
                  const walk = (el) => {
                    attributes.forEach(attr => el.removeAttribute(attr));
                    for (let i = 0; i < el.children.length; i++) walk(el.children[i]);
                  };
                  walk(target);
                };
                
                // Initial scrub
                scrub();

                // Mutation observer to keep it clean
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach(mutation => {
                    if (mutation.type === 'attributes') {
                      if (mutation.attributeName.includes('bis_') || mutation.attributeName.includes('gramm')) {
                        mutation.target.removeAttribute(mutation.attributeName);
                      }
                    } else if (mutation.type === 'childList') {
                      mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) scrub(node);
                      });
                    }
                  });
                });

                observer.observe(document.documentElement, { 
                  attributes: true, 
                  childList: true, 
                  subtree: true 
                });

                window.addEventListener('load', () => scrub());
              })();
            `,
          }}
        />
      </head>
      <body 
        suppressHydrationWarning={true} 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100`}
      >
        <div suppressHydrationWarning={true}>{children}</div>
      </body>
    </html>
  );
}
