import React from 'react';
import { Page, Navbar, Block, BlockTitle, CardContent } from 'framework7-react';

const AboutPage = () => (
  <Page>
    <Navbar title="About" backLink="Back" />
    <BlockTitle>Heroic Programmer Single-Handedly Rescues Group Project from the Brink of Disaster!</BlockTitle>
    <Block strong id="pain">
      <p>
        In the initial phase of our group project, my enthusiasm was sky-high. I envisioned a collaborative effort where each member would
        contribute their unique skills and perspectives, culminating in a project we could all be proud of. However, as deadlines loomed closer,
        it became painfully apparent that the burden of responsibility was falling squarely on my shoulders. Night after night, I found myself
        hunched over my computer, coding line after line, while the silence from my teammates was deafening. The weight of the entire project
        rested on me, and with it came a suffocating pressure. Each module, each line of code, felt like a boulder I had to carry up an endless
        hill. Sleep became a stranger as I toiled away, the glow of my screen a constant companion in the otherwise dark room.
      </p>
      <p>
        As the project progressed, the isolation of my endeavor began to take a toll on me, both mentally and physically. The constant programming,
        debugging, and testing were not just tasks; they were relentless waves crashing against my resolve. I grappled with a maelstrom of emotions -
        frustration at my team's apathy, anxiety over meeting the project's requirements, and a growing resentment that poisoned my once-enthusiastic
        attitude. My back ached from the hours spent in my chair, my eyes burned from the unending stare at the monitor, and my mind, once a fountain
        of creativity and problem-solving prowess, began to feel like a barren wasteland. The project, once a symbol of potential and learning, had
        morphed into a Sisyphean ordeal, each day blending into the next in a monotonous cycle of solitary work.
      </p>
      <p >
        In the end, the project was completed - a testament to my dedication and technical skills. But the victory was bittersweet. As I submitted the
        final piece, I couldn't help but feel a sense of loss. There was no shared triumph, no collective sigh of relief. The lessons learned were
        hard-earned and deeply personal. This experience left an indelible mark on me, teaching me the importance of communication, the value of
        teamwork, and the harsh reality that sometimes, despite one's best efforts, the weight of a group can rest on the shoulders of just one. It was
        a painful journey, one that tested my limits and reshaped my understanding of what it means to be part of a team.
      </p>
    </Block>
  </Page>
);

export default AboutPage;
