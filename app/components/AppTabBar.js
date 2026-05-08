"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Shift" },
  { href: "/context", label: "ธูติ" },
  { href: "/preview", label: "Preview" },
  { href: "/plans", label: "Plans" },
  { href: "/progress", label: "Progress", disabled: true }
];

function getTabClassName({ active, disabled }) {
  return [
    "app-tabbar__item",
    active ? "app-tabbar__item--active" : "",
    disabled ? "app-tabbar__item--disabled" : ""
  ]
    .filter(Boolean)
    .join(" ");
}

export default function AppTabBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="app-tabbar">
      <div className="app-tabbar__row">
        {tabs.map((tab) => {
          const active = pathname === tab.href;

          if (tab.disabled) {
            return (
              <span
                key={tab.label}
                aria-disabled="true"
                className={getTabClassName({ active: false, disabled: true })}
                title="Coming next slice"
              >
                {tab.label}
              </span>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={getTabClassName({ active, disabled: false })}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
