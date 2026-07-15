// app/map/page.js
// A route to test the map without touching your live homepage.
// Once you're happy, move <FragilityMap /> into app/page.js.

import FragilityMap from '../../components/FragilityMap';

export const metadata = {
  title: 'Fragility map — Energy Transition Supply-Chain Atlas',
};

export default function MapPage() {
  return (
    <main style={{ maxWidth: 1340, margin: '0 auto', padding: '2rem 1rem' }}>
      <p
        style={{
          font: "600 10px/1 var(--font-archivo), sans-serif",
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          color: '#708392',
          margin: '0 0 .6rem',
        }}
      >
        Energy Transition Supply-Chain Atlas
      </p>
      <h1
        style={{
          font: "600 30px/1.15 var(--font-inter), system-ui, sans-serif",
          letterSpacing: '-0.02em',
          margin: '0 0 .5rem',
        }}
      >
        Where the transition actually breaks
      </h1>
      <p style={{ maxWidth: '58ch', margin: '0 0 1.4rem', color: '#708392', fontSize: 14, lineHeight: 1.65 }}>
        Fragility is dependency: how concentrated a stage is, whether it can be engineered around,
        and how long a replacement takes. It is deliberately blind to cost and to politics — those
        are separate axes, because a cheap part you cannot buy stops the line just as dead as an
        expensive one, and an ally can be a chokepoint too.
      </p>

      <FragilityMap />
    </main>
  );
}
