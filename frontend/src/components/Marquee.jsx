import Marquee from 'react-fast-marquee';

const ITEMS = [
    'Laser Cutting',
    'Tube & Section',
    'Waterjet',
    'Flame Cutting',
    'Plasma',
    'Bevel & Weld Prep',
    'Press Brake',
    'Welding',
    'Fabrication',
    'Deburring',
    'Shot Blasting',
    'Laser Etching',
    'Countersinking',
    'Tapping',
    'Powder Coating',
    'Painting',
    'Polishing',
    'Plating',
    'Material Sourcing',
];

export default function EditorialMarquee() {
    return (
        <section
            data-testid="marquee-band"
            className="relative py-14 border-y border-line bg-bg-0 overflow-hidden z-10"
        >
            <Marquee gradient={false} speed={45} pauseOnHover={false}>
                {ITEMS.map((item, i) => (
                    <span key={`${item}-${i}`} className="marquee-item">
                        <span
                            className="font-display text-[7vw] leading-none uppercase tracking-tight text-outline"
                        >
                            {item}
                        </span>
                        <span className="marquee-dot" />
                    </span>
                ))}
            </Marquee>
        </section>
    );
}
