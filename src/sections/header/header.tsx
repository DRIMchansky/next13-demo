'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FocusTrap, createFocusTrap } from 'focus-trap'
import { useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'

import { InlineIconHeart } from '../../shared/components/inline-icon/heart'
import { InlineIconCart } from '../../shared/components/inline-icon/cart'
import { useWindowSize } from '@/shared/hooks/use-window-size'
import { Container } from '@/shared/components/container'
import { HEADER_CHANGE_WIDTH } from '@/shared/constants'
import { Navigation } from '../../features/navigation'
import { isTouch } from '@/shared/functions/is-touch'
import { Hamburger } from '../../features/hamburger'
import { mainNavData } from '@/app/data/main-nav'
import { HeaderTopline } from './topline'
import { HeaderPhone } from './phone'

import styles from './header.module.css'

export const Header = () => {
  const [isMobileMenuOpened, setMobileMenuOpened] = useState(false)
  const [addClosedClass, setClosedClass] = useState(true)
  const [isAnimationInProgress, setAnimationInProgress] = useState(false)

  const isMobile = useWindowSize().width < HEADER_CHANGE_WIDTH
  const path = usePathname()
  const searchParams = useSearchParams()
  const headerElement = useRef<HTMLElement | null>(null)
  const htmlElement = useRef<HTMLElement | null>(null)
  const focusTrap = useRef<FocusTrap | null>(null)

  // set property for mobile menu top inset
  const updadeHeaderHeightProperty = () => {
    headerElement.current?.style.setProperty('--header-height', `${headerElement.current?.offsetHeight}px`)
  }

  const handleTransitionEnd = () => {
    setAnimationInProgress(false)
    setClosedClass(!isMobileMenuOpened)
  }

  const toggleMobileMenu = () => {
    if (isAnimationInProgress) return

    setAnimationInProgress(true)
    setClosedClass(false)

    setTimeout(
      () =>
        setMobileMenuOpened(prev => {
          const next = !prev
          next ? focusTrap.current?.activate() : focusTrap.current?.deactivate()
          return next
        }),
      20
    )
  }

  // on mount
  useEffect(() => {
    updadeHeaderHeightProperty()
    window.addEventListener('resize', updadeHeaderHeightProperty)

    htmlElement.current = document.querySelector('html')

    focusTrap.current = createFocusTrap(headerElement.current as HTMLElement, { initialFocus: false })
  }, [])

  // close mobile menu if path or params changed
  useEffect(() => {
    setClosedClass(true)
    setMobileMenuOpened(false)
    focusTrap.current?.deactivate()
  }, [path, searchParams])

  // toggle class for prevent scroll when mobile modal is open
  useEffect(() => {
    htmlElement.current?.classList.toggle('mobile-menu-open', !addClosedClass)
  }, [addClosedClass])

  return (
    <header className={styles.header} ref={headerElement}>
      <HeaderTopline />

      <Container className={styles.container}>
        <Hamburger
          isMobileMenuOpened={isMobileMenuOpened}
          onClick={() => toggleMobileMenu()}
          disabled={isAnimationInProgress}
        />

        <div
          className={clsx(styles.contentWrapper, isMobileMenuOpened && styles.open, addClosedClass && styles.closed)}
          onTransitionEnd={handleTransitionEnd}
        >
          <Navigation
            data={mainNavData}
            isMobileBehaviour={isMobile || isTouch()}
            path={path}
            searchParams={searchParams}
            className={styles.navigation}
          />
          <HeaderPhone className={styles.phone} />
        </div>

        <Link href="/" className={styles.icon} aria-label="Favorite goods">
          <InlineIconHeart />
        </Link>
        <Link href="/" className={styles.icon} aria-label="Shopping cart">
          <InlineIconCart />
        </Link>
      </Container>
    </header>
  )
}
