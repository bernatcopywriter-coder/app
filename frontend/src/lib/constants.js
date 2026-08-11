export const NAV_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Capabilities', to: '/services' },
    { label: 'Industries', to: '/industries' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
];

/**
 * Five service categories that group the full metalwork capability.
 * Each category page lists the specific processes it covers.
 */
export const SERVICES = [
    {
        slug: 'laser-cutting',
        n: '01',
        title: 'Laser Cutting',
        strap: 'Flat Sheet · Mild · Stainless · Aluminium',
        blurb:
            'Precision flat laser cutting across mild steel, stainless steel, aluminium and other materials. Suitable for brackets, plates, panels, guards, profiles, components and repeat batch production.',
        details: [
            'Fibre laser cutting on flat sheet',
            'Mild steel, stainless, aluminium, copper, brass',
            'Brackets, plates, panels, guards, profiles',
            'One-offs, prototypes and repeat batches',
            'Nested for material efficiency',
            'PDF, DXF, DWG, STEP and images accepted',
        ],
        image: '/services/laser-flat.jpg',
        imageAlt: 'Flat sheet laser cutting steel components',
    },
    {
        slug: 'tube-section-cutting',
        n: '02',
        title: 'Tube & Section Cutting',
        strap: 'Tube · Box · Angle · Channel',
        blurb:
            'Laser cutting and processing of tube, box section, angle, channel and open-section profiles. Ideal for frames, structures and fabricated assemblies that need accurate cut-outs, mitres, holes or complex profiles.',
        details: [
            'Round tube, square and rectangular box section',
            'Angle, channel and open-section profiles',
            'Accurate mitres, cope cuts and end profiles',
            'Cut-outs, slots and threaded holes on request',
            'Frames, chassis and structural assemblies',
            'Cut-to-length and kitted deliveries',
        ],
        image: '/services/tube-laser.jpg',
        imageAlt: 'Tube laser cutting metal section',
    },
    {
        slug: 'heavy-plate-profiling',
        n: '03',
        title: 'Heavy Plate Profiling',
        strap: 'Flame · Plasma · Waterjet · Bevel',
        blurb:
            'Profiling of thicker materials using the process best suited to the job — flame, high-definition plasma or waterjet — including bevel cutting and weld preparation.',
        details: [
            'Flame cutting for heavy mild and carbon steel plate',
            'High-definition plasma for medium to heavy plate',
            'Waterjet for cold cutting and heat-sensitive materials',
            'Bevel cutting and weld-prep to reduce grinding',
            'Structural steel, base plates, wear plate, boiler plate',
            'Large-format profiles and one-off components',
        ],
        image: '/services/waterjet.jpg',
        imageAlt: 'Heavy plate profiling with waterjet cutting',
    },
    {
        slug: 'folding-fabrication',
        n: '04',
        title: 'Fabrication & Welding',
        strap: 'Press Brake · Welding · Assembly',
        blurb:
            'CNC press brake folding, welded fabrication and assembly. From simple folded brackets to complex structural assemblies — quoted and delivered as a single piece of work.',
        details: [
            'CNC press brake folding on sheet and plate',
            'Trays, channels, brackets, guards, enclosures',
            'MIG, TIG and MMA welding — coded where required',
            'Fabricated frames, chassis, guards and supports',
            'Structural steelwork and custom metalwork',
            'Post-weld dressing and prep for finishing',
        ],
        image: '/services/folding.jpg',
        imageAlt: 'Press brake folding sheet metal',
        secondaryImage: 'https://images.pexels.com/photos/12475054/pexels-photo-12475054.jpeg',
        secondaryImageAlt: 'Steel fabrication and welding',
    },
    {
        slug: 'finishing-secondary',
        n: '05',
        title: 'Finishing & Secondary Ops',
        strap: 'Powder Coating · Galvanising · Machining',
        blurb:
            'The operations that turn cut and folded parts into finished, assembly-ready components — deburring, blasting, powder coating, painting, galvanising, plating, tapping, countersinking and machining.',
        details: [
            'Powder coating and wet painting',
            'Galvanising, zinc plating and passivation',
            'Deburring, vibro-deburring and edge finishing',
            'Shot blasting for surface prep and cleaning',
            'Countersinking, flow drilling and tapping',
            'Laser etching, engraving and part marking',
        ],
        image: '/services/powder-coating.jpg',
        imageAlt: 'Powder coating finished steel components',
    },
];

/**
 * Full capability list — appears on the homepage capabilities strip.
 */
export const CAPABILITIES = [
    { g: 'Cutting & Profiling', items: [
        'Laser cutting',
        'Tube & section laser cutting',
        'Waterjet cutting',
        'Flame cutting',
        'Plasma cutting',
        'Bevel cutting & weld prep',
    ]},
    { g: 'Forming & Fabrication', items: [
        'Folding / press brake',
        'Welding',
        'Fabrication & assembly',
    ]},
    { g: 'Secondary Operations', items: [
        'Deburring & edge finishing',
        'Countersinking',
        'Flow drilling & tapping',
        'Laser etching & engraving',
    ]},
    { g: 'Coatings & Sourcing', items: [
        'Shot blasting',
        'Powder coating',
        'Painting',
        'Polishing',
        'Plating & galvanising',
        'Material sourcing',
    ]},
];

/**
 * Materials list for the materials strip on the homepage.
 */
export const MATERIALS = [
    'Mild steel',
    'Carbon steel',
    'S275',
    'S355',
    'Stainless steel',
    'Aluminium',
    'Copper',
    'Brass',
    'Bronze',
    'Titanium',
    'Galvanised sheet',
    'Zintec',
    'Durbar / floor plate',
    'Wear plate',
    'Boiler plate',
    'High-yield structural steel',
];

export const BENEFITS = [
    {
        n: '01',
        title: 'Less Chasing',
        text: 'Clear communication from enquiry to delivery. One point of contact who owns the job and gives you a straight answer when you ask.',
    },
    {
        n: '02',
        title: 'More Capability',
        text: 'Laser cutting, folding, fabrication, welding and finishing all handled under one supplier — matched to the job.',
    },
    {
        n: '03',
        title: 'The Right Process',
        text: 'Jobs are matched to the most suitable process and material for the requirement — not forced through the wrong route.',
    },
    {
        n: '04',
        title: 'Main or Backup Supplier',
        text: 'Suitable as your main metalwork supplier, or as a dependable backup when your usual shop is at capacity.',
    },
    {
        n: '05',
        title: 'Drawing-Led Support',
        text: 'Send PDFs, DXFs, DWGs, STEP files, images or basic job information. We read shopfloor drawings properly and quote against real intent.',
    },
    {
        n: '06',
        title: 'Flexible for One-Offs & Batches',
        text: 'Urgent one-off jobs, repeat production batches, subcontract overflow — sized and priced to suit the volume.',
    },
];

export const INDUSTRIES = [
    'Engineering companies',
    'Construction companies',
    'Manufacturers',
    'Agricultural businesses',
    'Motorsport suppliers',
    'Signage companies',
    'Maintenance teams',
    'Fabricators',
    'Steel stockholders',
    'Machinery builders',
    'Contractors',
    'Commercial fit-out',
];

export const AREAS = [
    'Mansfield',
    'Nottingham',
    'Chesterfield',
    'Sheffield',
    'Doncaster',
    'Derby',
    'Worksop',
    'Newark',
    'Nottinghamshire',
    'Derbyshire',
    'South Yorkshire',
    'UK-wide',
];

export const PROCESS_STEPS = [
    {
        n: '01',
        title: 'Send Your Drawings',
        text: 'Upload PDFs, DXFs, DWGs, STEP files, images or a ZIP pack. If you only have a sketch and a delivery date — that works too.',
    },
    {
        n: '02',
        title: 'We Review the Job',
        text: 'We read the drawings, check materials, quantities and processes, and confirm the right approach.',
    },
    {
        n: '03',
        title: 'You Receive a Quote',
        text: 'Clear pricing, lead time and any questions explained upfront. No mystery pricing, no hidden extras — a straight number you can decide on.',
    },
    {
        n: '04',
        title: 'We Manage the Work',
        text: 'Once approved, we coordinate cutting, folding, fabrication, welding, finishing and delivery — and keep you informed at every stage.',
    },
];

export const CONTACT = {
    email: 'alex@bernatsolutions.com',
    phone: '07737 563 812',
    phoneRaw: '+447737563812',
    location: 'Nottinghamshire, United Kingdom',
};

/**
 * Full process list for the quote form — matches the wider capability list.
 */
export const PROCESS_OPTIONS = [
    'Laser cutting',
    'Tube / section laser cutting',
    'Waterjet cutting',
    'Flame cutting',
    'Plasma cutting',
    'Bevel cutting / weld prep',
    'Folding / press brake',
    'Welding',
    'Fabrication',
    'Deburring',
    'Shot blasting',
    'Laser etching / engraving',
    'Countersinking',
    'Tapping',
    'Powder coating',
    'Painting',
    'Polishing',
    'Plating',
    'Material supply',
    'Other',
];

export const MATERIAL_OPTIONS = [
    'Mild steel',
    'Carbon steel (S275)',
    'Carbon steel (S355)',
    'Stainless steel',
    'Aluminium',
    'Copper',
    'Brass',
    'Bronze',
    'Titanium',
    'Galvanised sheet',
    'Zintec',
    'Durbar / floor plate',
    'Wear plate',
    'Boiler plate',
    'Other / specialist',
];
