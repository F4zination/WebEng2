// App.jsx

import { App, NavRight, Panel, View, Page, Navbar, Block, Row, Col, Button, Popup, Link } from 'framework7-react';

export default () => (
    /* Main Framework7 App component where we pass Framework7 params */
    <App theme="auto" name="My App">

        {/* Left Panel with "cover" effect */}
        <Panel left cover>
            <View>
                <Page>
                    <Navbar title="Left Panel"></Navbar>
                    <Block>
                        <p>Here comes the left panel text</p>
                    </Block>
                </Page>
            </View>
        </Panel>

        {/* Right Panel with "reveal" effect */}
        <Panel right reveal>
            <View>
                <Page>
                    <Navbar title="Right Panel"></Navbar>
                    <Block>
                        <p>Here comes the right panel text</p>
                    </Block>
                </Page>
            </View>
        </Panel>

    </App>
)