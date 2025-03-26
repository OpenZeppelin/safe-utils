"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { FileText, Home } from "lucide-react";

interface NavItem {
  id: string;
  title: string;
  href: string;
  target?: string;
  description?: string;
  icon?: {
    light: string;
    dark: string;
  };
}

interface NavSection {
  title: string;
  href?: string;
  items: NavItem[];
}

interface NavMenu {
  name: string;
  sections: NavSection[];
}

// Import the logo with no SSR
const OZLogo = dynamic(() => import('@/components/ui/oz-logo').then(mod => mod.OZLogo), {
  ssr: false
});

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const pathname = usePathname();
  const isHowItWorksPage = pathname === "/how-it-works";

  // Define navigation structure
  const navMenus: Record<string, NavMenu> = {
    products: {
      name: 'Products',
      sections: [
        {
          title: 'Open Source Tools',
          items: [
            {
              id: 'contracts_library-navbar',
              title: 'Contracts Library',
              href: 'https://www.openzeppelin.com/solidity-contracts',
              description: 'Secure smart contract templates',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/contracts-library-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/contracts-library-dark.svg'
              }
            },
            {
              id: 'contracts_wizard-navbar',
              title: 'Contracts Wizard',
              href: 'https://wizard.openzeppelin.com/',
              target: '_blank',
              description: 'Interactive smart contract generator',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/contracts-wizard-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/wizard-dark.svg'
              }
            },
            {
              id: 'upgrades_plugin-navbar',
              title: 'Upgrades Plugin',
              href: 'https://docs.openzeppelin.com/upgrades-plugins/1.x/',
              target: '_blank',
              description: 'Safe and easy smart contract upgrades',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/upgrade-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/upgrades-dark.svg'
              }
            },
            {
              id: 'safe_utils-navbar',
              title: 'Safe Utils',
              href: 'https://safeutils.openzeppelin.com/',
              target: '_blank',
              description: 'Verify Safe transactions before signing',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/safe-utils-1.svg',
                dark: 'https://www.openzeppelin.com/hubfs/safe-utils-dark-1.svg'
              }
            },

          ]
        },
        {
          title: 'Defender Cloud Services',
          href: 'https://www.openzeppelin.com/defender',
          items: [
            {
              id: 'relayers-navbar',
              title: 'Relayers',
              href: 'https://www.openzeppelin.com/defender#secure-operations',
              description: 'Send reliable transactions via API',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/relayers-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/relayers-dark.svg'
              }
            },
            {
              id: 'monitor-navbar',
              title: 'Monitor',
              href: 'https://www.openzeppelin.com/defender#secure-operations',
              description: 'Gain visibility into your smart contracts',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/monitor-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/monitor-dark.svg'
              }
            },
            {
              id: 'actions-navbar',
              title: 'Actions',
              href: 'https://www.openzeppelin.com/defender#actions',
              description: 'Automate smart contract operations',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/actions-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/actions-dark.svg'
              }
            },
            {
              id: 'access_control-navbar',
              title: 'Access Control',
              href: 'https://access-manager.openzeppelin.com/explorer/11155111',
              target: '_blank',
              description: 'Manage contract roles and permissions',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/access-control-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/acces-control-dark.svg'
              }
            }
          ]
        },
        {
          title: '',
          items: [
            {
              id: 'code_inspector-navbar',
              title: 'Code Inspector',
              href: 'https://www.openzeppelin.com/defender#secure-code',
              description: 'Find and resolve smart contract vulnerabilities',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/code-inspector-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/code-inspector-dark.svg'
              }
            },
            {
              id: 'deploy-navbar',
              title: 'Deploy',
              href: 'https://www.openzeppelin.com/defender#secure-deploy',
              description: 'Launch and upgrade smart contracts safely',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/deploy-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/deploy-dark.svg'
              }
            },
            {
              id: 'transaction_proposals-navbar',
              title: 'Transaction Proposals',
              href: 'https://www.openzeppelin.com/defender#secure-operations',
              description: 'Interactive transaction builder',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/transaction-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/transaction-proposals-dark.svg'
              }
            }
          ]
        }
      ]
    },
    services: {
      name: 'Services',
      sections: [
        {
          title: 'Services',
          items: [
            {
              id: 'security_audit-navbar',
              title: 'Smart Contract Security Audit',
              href: 'https://www.openzeppelin.com/security-audits',
              description: 'Industry standard for securing smart contracts',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/sa-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/sa-nav-1.svg'
              }
            },
            {
              id: 'emergency_response-navbar',
              title: 'Emergency Response',
              href: 'https://www.openzeppelin.com/emergency-response',
              description: 'React with expertise and speed',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/er-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/er-nav-1.svg'
              }
            },
            {
              id: 'zkp_practice-navbar',
              title: 'ZKP Practice',
              href: 'https://www.openzeppelin.com/zkp',
              description: 'Scalability, Privacy, and Security',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/zkp-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/zkp-nav-1.svg'
              }
            }
          ]
        },
        {
          title: 'Solutions',
          items: [
            {
              id: 'ecosystem_stack-navbar',
              title: 'Ecosystem Stack',
              href: 'https://www.openzeppelin.com/ecosystems',
              description: 'Developer acquisition, accelerated',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/es-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/es-nav-1.svg'
              }
            }
          ]
        }
      ]
    },
    resources: {
      name: 'Resources',
      sections: [
        {
          title: 'Resources',
          items: [
            {
              id: 'documentation-navbar',
              title: 'Documentation',
              href: 'https://docs.openzeppelin.com/',
              target: '_blank',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/docs-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/docs-nav-1.svg'
              }
            },
            {
              id: 'blog-navbar',
              title: 'Blog',
              href: 'https://blog.openzeppelin.com/',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/blog-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/blog-nav-1.svg'
              }
            },
            {
              id: 'forum-navbar',
              title: 'Forum',
              href: 'https://forum.openzeppelin.com/',
              target: '_blank',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/forum-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/forum-nav-1.svg'
              }
            },
            {
              id: 'ethernaut-navbar',
              title: 'Ethernaut CTF',
              href: 'https://ethernaut.openzeppelin.com/',
              target: '_blank',
              icon: {
                light: 'https://www.openzeppelin.com/hubfs/ethernaut-nav.svg',
                dark: 'https://www.openzeppelin.com/hubfs/ethernaut-nav-1.svg'
              }
            }
          ]
        },
        {
          title: 'Company',
          items: [
            {
              id: 'about-navbar',
              title: 'About us',
              href: 'https://www.openzeppelin.com/about'
            },
            {
              id: 'careers-navbar',
              title: 'Careers',
              href: 'https://www.openzeppelin.com/careers'
            },
            {
              id: 'security_center-navbar',
              title: 'Security Center',
              href: 'https://contracts.openzeppelin.com/security',
              target: '_blank'
            }
          ]
        }
      ]
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  };

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  return (
    <div className="font-inter">
      <header className={`fixed w-full z-[999999999] transition-all duration-200 bg-white dark:bg-[#01030a] border-b border-[#eaeaea] dark:border-[rgba(255,255,255,0.1)]`}>
        <div className="px-5">
          <div className="max-w-[1430px] mx-auto relative py-2 flex items-center justify-between">
            {/* Logo */}
            <div className="max-w-[160px] w-full mr-12">
              <div className="flex items-center">
                <Link
                  href="https://openzeppelin.com"
                  className="flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <OZLogo />
                </Link>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="w-full">
              <nav className="hidden lg:flex justify-between items-center">
                <div className="flex-grow">
                  <ul className="flex items-center gap-12 ml-[5px]">
                    {/* Dynamic Desktop Menus */}
                    {Object.entries(navMenus).map(([key, menu]) => (
                      <li key={key} className="relative group">
                        <a href="#" className="text-[15px] font-medium leading-[126%] tracking-[-0.01em] text-[#0a0f39] dark:text-[#fafafa] hover:text-[#4e5ee4] dark:hover:text-[#d1d1d1] transition-colors duration-300">
                          {menu.name}
                        </a>

                        <div className={`invisible opacity-0 absolute top-[40px] ${key === 'products' ? 'left-[-224px] min-w-0 max-w-[1200px] w-[calc(100vw-55px)]' :
                          key === 'services' ? 'left-[-337px] min-w-0 max-w-[790px] w-[calc(100vw-55px)]' :
                            'transform -translate-x-1/2 left-1/2 min-w-[500px]'
                          } bg-white dark:bg-[#0D0D0D] border border-[#e8e8e8] dark:border-[#292929] shadow-[0px_10px_20px_rgba(0,0,0,0.05)] rounded-[16px] p-8 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:mt-0`}>
                          <div className={`before:content-[''] before:block before:w-6 before:h-[15px] before:absolute before:top-0 ${key === 'products' ? 'before:left-[245px]' :
                            key === 'services' ? 'before:left-[354px]' :
                              'before:left-1/2 before:-translate-x-1/2'
                            } before:-translate-y-full before:bg-[url('https://7795250.fs1.hubspotusercontent-na1.net/hubfs/7795250/triangle-corner2.svg')] dark:before:bg-[url('https://7795250.fs1.hubspotusercontent-na1.net/hubfs/7795250/triangle-corner-darkest.svg')] before:bg-cover before:bg-no-repeat`}>
                            {/* Add a hidden pseudo-element to create a hover bridge */}
                            <div className="absolute -top-5 left-0 w-full h-5 bg-transparent opacity-0 group-hover:opacity-100"></div>
                            {/* <div className="absolute h-[15px] w-full top-[100%] left-0 bg-transparent"></div> */}
                            <div className="flex justify-between gap-[30px] flex-wrap">
                              {menu.sections.map((section, idx) => (
                                <div key={idx} className="flex flex-col gap-1 flex-1">
                                  {section.href ? (
                                    <a href={section.href} className="text-[rgba(108,111,136,0.8)] dark:text-[#b7b7b7] text-[15px] font-medium leading-[126%] mb-[10px] min-h-5 px-2 transition-all duration-400 hover:text-[#0a0f39] dark:hover:text-white">
                                      {section.title}
                                    </a>
                                  ) : (
                                    <div className="text-[rgba(108,111,136,0.8)] dark:text-[#b7b7b7] text-[15px] font-medium leading-[126%] mb-[10px] min-h-5 px-2 transition-all duration-400">
                                      {section.title}
                                    </div>
                                  )}

                                  {section.items.map((item) => (
                                    <a
                                      key={item.id}
                                      id={item.id}
                                      href={item.href}
                                      target={item.target}
                                      className="flex items-center gap-4 text-inherit p-[10px] rounded-[10px] transition-all duration-400 hover:bg-[#fafafa] dark:hover:bg-[#1e1e1e] hover:text-[#0a0f39] dark:hover:text-[#fafafa]"
                                    >
                                      {item.icon && (
                                        <>
                                          <Image
                                            className="w-10 grayscale transition-all duration-300 hover:grayscale-0 dark:hidden"
                                            src={item.icon.light}
                                            alt=""
                                            width={40}
                                            height={40}
                                          />
                                          <Image
                                            className="w-10 grayscale transition-all duration-300 hover:grayscale-0 hidden dark:block"
                                            src={item.icon.dark}
                                            alt=""
                                            width={40}
                                            height={40}
                                          />
                                        </>
                                      )}
                                      <div>
                                        <span className="block text-[#0a0f39] dark:text-[#fafafa] text-[15px] font-medium leading-[126%] mb-[2px]">
                                          {item.title}
                                        </span>
                                        {item.description && (
                                          <p className="m-0 text-[#818998] dark:text-[#a7a7a7] text-[13px] font-normal leading-[126%] tracking-[-0.01em] transition-all duration-400">
                                            {item.description}
                                          </p>
                                        )}
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              ))}

                              {/* Bottom row for pricing (only in products menu) */}
                              {key === 'products' && (
                                <div className="grid grid-cols-3 gap-[35px] w-full">
                                  <div className="col-span-1"></div>
                                  <div className="col-span-2 pt-5 border-t border-[rgba(229,229,229,0.8)] dark:border-[#292929]">
                                    <a id="pricing-navbar" href="https://www.openzeppelin.com/pricing" className="inline-block p-0 mb-0 transition-all duration-200 hover:text-[#4f56fa] dark:text-[#fafafa] dark:hover:text-[#4F56FA]">
                                      <span className="text-[15px] font-medium">Defender Pricing -&gt;</span>
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nav Buttons */}
                <div className="flex items-center gap-2">

                  <div>
                    <a id="talk_to_an_expert-navbar" className="inline-block py-[7px] px-4 text-[14px] tracking-[-0.02em] rounded-[100px] font-medium leading-[120%] 
                    text-[#0a0f39] bg-[#fafafa] border border-[#efefef] 
                    dark:text-[#D8D8D8] dark:bg-transparent 
                    transition-all duration-200 
                    hover:bg-[#ededed] hover:text-[rgba(10,15,57,0.8)] 
                    dark:hover:bg-transparent 
                    active:bg-[#e1e1e1] whitespace-nowrap text-center"
                      href="https://www.openzeppelin.com/request?id=talk_to_an_expert-navbar">Request an Audit</a>
                  </div>
                  <Button variant="ghost" asChild className="text-sm font-medium">
                    {isHowItWorksPage ? (
                      <Link href="/" className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                      </Link>
                    ) : (
                      <Link href="/how-it-works" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Docs</span>
                      </Link>
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <a
                      href="https://github.com/openzeppelin/safe-utils"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                    >
                      <Image
                        src="/github.svg"
                        alt="GitHub"
                        width={20}
                        height={20}
                        className="dark:invert"
                      />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <a
                      href="https://x.com/OpenZeppelin"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X"
                    >
                      <Image
                        src="/x-logo.svg"
                        alt="X"
                        width={20}
                        height={20}
                        className="dark:invert"
                      />
                    </a>
                  </Button>
                  <ModeToggle />
                </div>
              </nav>

              {/* Mobile Menu */}
              <nav id="menu-mobile" className={`lg:hidden relative ${isMenuOpen ? 'open' : ''}`}>
                <div className="flex items-center gap-2 justify-end">
                  <ModeToggle />
                  <div className="h-icon min-h-[44px] min-w-[44px] p-2.5 cursor-pointer rounded-[6px] flex items-center justify-center border border-[#efefef] dark:border-[#292929]" onClick={toggleMenu}>
                    <div className={`relative w-5 h-5 flex flex-col justify-center items-center`}>
                      {isMenuOpen ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#51516a] dark:text-[#EFEFEF]" />
                          <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#51516a] dark:text-[#EFEFEF]" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#51516a] dark:text-[#EFEFEF]" />
                          <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#51516a] dark:text-[#EFEFEF]" />
                          <path d="M4 16H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#51516a] dark:text-[#EFEFEF]" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                <ul className={`p-main-nav-mobile-list ${isMenuOpen ? 'block fixed left-0 right-0 bottom-0 overflow-y-auto top-[52px] w-full pt-5 pb-[120px] bg-white dark:bg-[#01030a] z-100' : 'hidden'}`}>
                  <li className="button-item px-4 max-w-[600px] mx-auto">
                    <a id="talk_to_an_expert-navbar" className="inline-block w-full py-[10px] px-4 text-[16px] text-center rounded-[100px] font-medium leading-[120%] text-[#0a0f39] bg-[#fafafa] border border-[#efefef] dark:bg-transparent dark:text-[#D8D8D8] transition-all duration-200" href="https://www.openzeppelin.com/request?id=talk_to_an_expert-navbar">Request an Audit</a>
                  </li>
                  <div className="flex justify-center items-center gap-8 py-2">
                    {/* Docs/Home */}
                    {isHowItWorksPage ? (
                      <Link
                        href="/"
                        className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Home"
                      >
                        <Home className="h-6 w-6" />
                      </Link>
                    ) : (
                      <Link
                        href="/how-it-works"
                        className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setIsMenuOpen(false)}
                        aria-label="Docs"
                      >
                        <FileText className="h-6 w-6" />
                      </Link>
                    )}

                    {/* GitHub */}
                    <a
                      href="https://github.com/openzeppelin/safe-utils"
                      className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      aria-label="GitHub"
                    >
                      <Image
                        src="/github.svg"
                        alt="GitHub"
                        width={24}
                        height={24}
                        className="dark:invert"
                      />
                    </a>

                    {/* X */}
                    <a
                      href="https://x.com/OpenZeppelin"
                      className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMenuOpen(false)}
                      aria-label="X"
                    >
                      <Image
                        src="/x-logo.svg"
                        alt="X"
                        width={24}
                        height={24}
                        className="dark:invert"
                      />
                    </a>
                  </div>

                  {/* Dynamic Mobile Menus */}
                  {Object.entries(navMenus).map(([key, menu]) => (
                    <li key={key} className={`p-main-nav-item px-4 py-4 relative ${openSubmenu === key ? 'open pb-0' : ''}`}>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); toggleSubmenu(key); }}
                        className="block text-[16px] font-medium text-[#0a0f39] dark:text-[#fafafa] after:content-[''] after:inline-block after:w-[10px] after:h-[10px] after:bg-[url('https://7795250.fs1.hubspotusercontent-na1.net/hubfs/7795250/raw_assets/public/oz_2022/images/homepage/arrow-dropdown.svg')] dark:after:bg-[url('https://7795250.fs1.hubspotusercontent-na1.net/hubfs/7795250/arrow-dropdown-white.svg')] after:bg-center after:bg-contain after:bg-no-repeat after:absolute after:right-[25px] after:top-[20px] after:transition-all after:duration-300 after:ease-in-out after:transform after:rotate-90 after:origin-center"
                      >
                        {menu.name}
                      </a>
                      <ul className={`p-main-submenu grid transition-[grid-template-rows] duration-300 ${openSubmenu === key ? 'grid-rows-[1fr] open' : 'grid-rows-[0fr]'}`}>
                        <div className="overflow-clip row-span-2">
                          {menu.sections.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                              {/* Show section titles for Products menu and Solutions under Services */}
                              {(key === 'products' || (key === 'services' && section.title === 'Solutions')) && (
                                <li className="p-main-submenu-item subtitle pt-4 text-[#818998bf] dark:text-[#b7b7b7] text-[16px] font-normal leading-normal tracking-[-0.01em]">
                                  {section.href ? (
                                    <a href={section.href}>{section.title}</a>
                                  ) : (
                                    section.title
                                  )}
                                </li>
                              )}

                              {/* For Resources, only show items from the first section (exclude Company items) */}
                              {!(key === 'resources' && sectionIdx === 1) && section.items.map((item) => (
                                <li key={item.id} className="p-main-submenu-item py-2">
                                  <a
                                    id={item.id}
                                    href={item.href}
                                    target={item.target}
                                    className="flex items-center gap-[5px] text-[#818998] dark:text-[#a7a7a7] text-[16px] font-normal leading-normal tracking-[-0.01em]"
                                  >
                                    {item.icon && (
                                      <>
                                        <Image
                                          className="w-[26px] h-[26px] grayscale dark:hidden"
                                          src={item.icon.light}
                                          alt=""
                                          width={26}
                                          height={26}
                                        />
                                        <Image
                                          className="w-[26px] h-[26px] grayscale hidden dark:block "
                                          src={item.icon.dark}
                                          alt=""
                                          width={26}
                                          height={26}
                                        />
                                      </>
                                    )}
                                    {item.title}
                                  </a>
                                </li>
                              ))}
                            </div>
                          ))}

                          {/* Pricing link for products menu */}
                          {key === 'products' && (
                            <li className="p-main-submenu-item subtitle pt-4 text-[#818998bf] dark:text-[#b7b7b7] text-[16px] font-normal leading-normal tracking-[-0.01em]">
                              <a href="https://www.openzeppelin.com/pricing">Defender Pricing</a>
                            </li>
                          )}
                        </div>
                      </ul>
                    </li>
                  ))}

                  {/* Company section (separate from Resources) */}
                  <li className={`p-main-nav-item px-4 py-4 relative ${openSubmenu === 'company' ? 'open pb-0' : ''}`}>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); toggleSubmenu('company'); }}
                      className="block text-[16px] font-medium text-[#0a0f39] dark:text-[#fafafa] after:content-[''] after:inline-block after:w-[10px] after:h-[10px] after:bg-[url('https://7795250.fs1.hubspotusercontent-na1.net/hubfs/7795250/raw_assets/public/oz_2022/images/homepage/arrow-dropdown.svg')] dark:after:bg-[url('https://7795250.fs1.hubspotusercontent-na1.net/hubfs/7795250/arrow-dropdown-white.svg')] after:bg-center after:bg-contain after:bg-no-repeat after:absolute after:right-[25px] after:top-[20px] after:transition-all after:duration-300 after:ease-in-out after:transform after:rotate-90 after:origin-center"
                    >
                      Company
                    </a>
                    <ul className={`p-main-submenu grid transition-[grid-template-rows] duration-300 ${openSubmenu === 'company' ? 'grid-rows-[1fr] open' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-clip row-span-2">
                        {navMenus.resources.sections[1].items.map((item) => (
                          <li key={item.id} className="p-main-submenu-item py-2">
                            <a
                              id={item.id}
                              href={item.href}
                              target={item.target}
                              className="text-[#818998] dark:text-[#a7a7a7] text-[16px] font-normal leading-normal tracking-[-0.01em]"
                            >
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </div>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;