import Link from 'next/link';
const Header = ({ currentUser }) => {
    const links = [
        currentUser && { label: 'My Orders', href: '/orders' },
        currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
        currentUser && { label: 'Sign out', href: '/auth/signout' },
        !currentUser && { label: 'Sign in', href: '/auth/signin' },
        !currentUser && { label: 'Sign up', href: '/auth/signup' }
    ]
        .filter(linkConfig => linkConfig)
        .map(({ label, href }) => {
            return <li key={href} className="nav-item">
                <Link href={href} className='nav-link'>
                    {label}
                </Link>
            </li>
        })
    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/">
                HBS
            </Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    {links}
                </ul>
            </div>
        </nav>
    );
}

export default Header;