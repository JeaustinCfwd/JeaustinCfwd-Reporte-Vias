import React, { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import ShinyText from './ShinyText';
import "../styles/Navbar.css";

const NavbarLayout = ({
    position,
    accentColor,
    open,
    preLayersRef,
    colors,
    toggleBtnRef,
    toggleMenu,
    textWrapRef,
    textInnerRef,
    textLines,
    iconRef,
    plusHRef,
    plusVRef,
    panelRef,
    displayItemNumbering,
    menuItems,
    handleProtectedClick,
    closeMenu,
    userItems
}) => {
    return (
        <>
            <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true" data-position={position}>
                {(() => {
                    const raw = colors && colors.length ? colors.slice(0, 4) : ['#667eea', '#764ba2'];
                    let arr = [...raw];
                    if (arr.length >= 3) {
                        const mid = Math.floor(arr.length / 2);
                        arr.splice(mid, 1);
                    }
                    return arr.map((c, i) => <div key={i} className="sm-prelayer" style={{ '--prelayer-color': c }} />);
                })()}
            </div>
            <header className="staggered-menu-header" aria-label="Main navigation header">
                <div className="sm-logo" aria-label="Logo">
                    <NavLink to="/" className="nav-logo-link">
                        <ShinyText text="ReporteVías CR" speed={3} />
                    </NavLink>
                </div>
                <button
                    ref={toggleBtnRef}
                    className="sm-toggle"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    aria-expanded={open}
                    aria-controls="staggered-menu-panel"
                    onClick={toggleMenu}
                    type="button"
                    style={accentColor ? { '--sm-accent': accentColor } : undefined}
                >
                    <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
                        <span ref={textInnerRef} className="sm-toggle-textInner">
                            {textLines.map((l, i) => (
                                <span className="sm-toggle-line" key={i}>
                                    {l}
                                </span>
                            ))}
                        </span>
                    </span>
                    <span ref={iconRef} className="sm-icon" aria-hidden="true">
                        <span ref={plusHRef} className="sm-icon-line" />
                        <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
                    </span>
                </button>
            </header>

            <aside
                id="staggered-menu-panel"
                ref={panelRef}
                className={`staggered-menu-panel ${open ? 'panel-open' : 'panel-closed'} ${accentColor ? 'panel-accent' : ''}`}
                data-position={position}
                inert={!open ? "" : undefined}
            >
                <div className="sm-panel-inner">
                    <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
                        {menuItems.map((it, idx) => (
                            <li className="sm-panel-itemWrap" key={it.label + idx}>
                                <NavLink
                                    className="sm-panel-item"
                                    to={it.link}
                                    data-index={idx + 1}
                                    onClick={(e) => {
                                        if (it.protected) {
                                            handleProtectedClick(e, it.link);
                                        } else {
                                            closeMenu();
                                        }
                                    }}
                                >
                                    <span className="sm-panel-itemLabel">{it.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <div className="sm-socials" aria-label="User menu">
                        <h3 className="sm-socials-title">Cuenta</h3>
                        <ul className="sm-socials-list" role="list">
                            {userItems.map((s, i) => (
                                <li key={s.label + i} className="sm-socials-item">
                                    {s.onClick ? (
                                        <button onClick={s.onClick} className="sm-socials-link sm-socials-button">
                                            {s.label}
                                        </button>
                                    ) : (
                                        <NavLink to={s.link} className="sm-socials-link" onClick={closeMenu}>
                                            {s.label}
                                        </NavLink>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default NavbarLayout;
