import { Link, usePage } from "@inertiajs/react";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { cast } from "ts-safe-cast";

import { useLoggedInUser } from "$app/components/LoggedInUser";

import logoSrc from "$assets/images/logo.svg";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  isButton?: boolean;
  isPrimary?: boolean;
  isActive?: boolean;
};

const NavLink = ({ href, children, isButton = false, isPrimary = false, isActive = false }: NavLinkProps) => {
  if (isButton) {
    const baseClasses =
      "flex w-full items-center justify-center h-full border-black bg-black p-4 text-lg text-white no-underline transition-colors duration-200 hover:bg-pink hover:text-black lg:w-auto lg:border-l lg:py-2 lg:px-6";
    const primaryClasses = isPrimary
      ? "lg:bg-black lg:text-white lg:hover:bg-pink dark:lg:bg-pink dark:lg:text-black dark:lg:hover:bg-white"
      : "lg:border-l-black lg:bg-white lg:text-black lg:hover:bg-pink dark:lg:border-l-white/35 dark:lg:bg-black dark:lg:text-white dark:lg:hover:bg-white dark:lg:hover:text-black";

    return (
      <Link href={href} className={`${baseClasses} ${primaryClasses}`}>
        {children}
      </Link>
    );
  }

  const activeStateClass = isActive
    ? "border-black lg:bg-black lg:text-white dark:lg:bg-white dark:lg:text-black"
    : "border-transparent lg:bg-transparent lg:text-black dark:lg:text-white";

  return (
    <Link
      href={href}
      className={`flex w-full items-center justify-center border ${activeStateClass} bg-black p-4 text-lg whitespace-nowrap text-white no-underline transition-all duration-200 hover:border-black lg:w-auto lg:rounded-full lg:px-4 lg:py-2 lg:dark:hover:border-white/35`}
    >
      {children}
    </Link>
  );
};

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" className="fill-current">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      fill="currentColor"
    />
  </svg>
);

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="dark:invert">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ArrowDiagonalIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="dark:invert"
  >
    <path d="M7 17L17 7M7 7h10v10" />
  </svg>
);

export const HomeNav = () => {
  const loggedInUser = useLoggedInUser();
  const { url } = usePage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [githubStars, setGithubStars] = useState<number | null>(null);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const fetchGithubStars = async () => {
      try {
        const response = await fetch("https://api.github.com/repos/antiwork/gumroad");
        const data = cast<{ stargazers_count?: number }>(await response.json());
        if (data.stargazers_count) {
          setGithubStars(data.stargazers_count);
        }
      } catch {
        // Silently fail
      }
    };
    void fetchGithubStars();
  }, []);

  const isCurrentPath = (path: string) => {
    if (path === "/blog") {
      return url.startsWith("/blog");
    }
    return url === path;
  };

  const navLinks = (
    <div className="flex flex-col items-center justify-center lg:flex-row lg:gap-1 lg:px-6">
      <NavLink href={Routes.discover_path()} isActive={isCurrentPath("/discover")}>
        Discover
      </NavLink>
      <NavLink href={Routes.gumroad_blog_root_path()} isActive={isCurrentPath("/blog")}>
        Blog
      </NavLink>
      <NavLink href={Routes.pricing_path()} isActive={isCurrentPath("/pricing")}>
        Pricing
      </NavLink>
      <NavLink href={Routes.features_path()} isActive={isCurrentPath("/features")}>
        Features
      </NavLink>
      <NavLink href={Routes.about_path()} isActive={isCurrentPath("/") || isCurrentPath("/about")}>
        About
      </NavLink>
    </div>
  );

  const authLinks = (
    <div className="flex flex-col lg:h-full lg:flex-row">
      {loggedInUser ? (
        <NavLink href={Routes.dashboard_path()} isButton isPrimary>
          Dashboard
        </NavLink>
      ) : (
        <>
          <NavLink href={Routes.new_user_session_path()} isButton>
            Log in
          </NavLink>
          <NavLink href={Routes.new_user_registration_path()} isButton isPrimary>
            Start selling
          </NavLink>
        </>
      )}
    </div>
  );

  return (
    <>
      <div className="sticky top-0 right-0 left-0 z-50 flex h-20 justify-between border-b border-black bg-white pr-4 pl-4 lg:pr-0 lg:pl-8 dark:border-b-white/35 dark:bg-black">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <img src={logoSrc} loading="lazy" alt="Gumroad" className="h-7 lg:h-8 dark:invert" />
          </Link>

          <a
            href="https://github.com/antiwork/gumroad"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-1.5 rounded-full border border-black p-1.5 text-black no-underline transition-all duration-100 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:bg-gray-100 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:border-white/35 dark:text-white dark:hover:bg-gray-700 dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,0.35)]"
            aria-label="Visit Gumroad on GitHub"
          >
            <GitHubIcon />
            {githubStars ? (
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-base leading-none font-medium">{githubStars.toLocaleString()}</span>
                <StarIcon />
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-base leading-none font-medium">GitHub</span>
                <ArrowDiagonalIcon />
              </div>
            )}
          </a>
        </div>

        <div className="override hidden lg:flex lg:items-center">
          {navLinks}
          {authLinks}
        </div>

        <div className="flex items-center lg:hidden">
          <button
            className="relative flex h-8 w-8 flex-col items-center justify-center all-unset focus:outline-hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div
              className={`mb-1 h-0.5 w-8 origin-center bg-black transition-transform duration-200 dark:bg-white ${mobileMenuOpen ? "translate-y-[5px] rotate-45" : ""}`}
            />
            <div
              className={`mt-1 h-0.5 w-8 origin-center bg-black transition-transform duration-200 dark:bg-white ${mobileMenuOpen ? "-translate-y-[5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      <div
        className={`override ${mobileMenuOpen ? "flex" : "hidden"} fixed top-20 right-0 left-0 z-50 flex-col justify-between border-b border-black bg-black dark:border-white/35`}
      >
        {navLinks}
        {authLinks}
      </div>
    </>
  );
};
