import { Page, Navbar, Link } from 'framework7-react';

// home.jsx
export default () => (
    <Page name="home">
        <Navbar title="Home Page" />
        ...
        <Link href="/about/">About Page</Link>
        <Link href="/login/">Login Page</Link>
    </Page>
)