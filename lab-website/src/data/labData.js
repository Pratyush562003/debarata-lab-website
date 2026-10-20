// ── CHANGE ALL THIS TO YOUR LAB'S REAL DATA ──

export const labInfo = {
  name: "XYZ Lab",                           // ← your lab name
  fullName: "XYZ Research Laboratory",
  university: "Your University Name",        // ← your university
  department: "Department of Chemistry",
  tagline: "Supramolecular & Biomolecular Chemistry",
  description:
    "We explore the design, synthesis, and function of complex molecular systems at the interface of chemistry and biology. Our interdisciplinary approach pushes the boundaries of molecular science.",
  email: "pi@university.edu",               // ← PI email
  alternateEmail: "",                       // ← Alternate email (optional)
  phone: "+91 33 XXXX XXXX",
  alternatePhone: "",                       // ← Alternate phone (optional)
  address: "Room 301, Chemistry Building, Your University, City - 700032",
  twitter: "https://twitter.com/yourlab",
  googleScholar: "https://scholar.google.com/",
  researchgate: "https://www.researchgate.net/",
  mission: "The DB Research Laboratory is dedicated to advancing the frontiers of supramolecular & biomolecular chemistry. We believe in rigorous science, collaborative discovery, and training the next generation of researchers. Our lab is committed to creating an inclusive and stimulating environment where creativity and scientific excellence thrive together.",
  values: [
    { icon: "🔭", title: "Curiosity", text: "We ask bold questions at the edge of known science." },
    { icon: "🤝", title: "Collaboration", text: "Chemistry thrives at disciplinary intersections." },
    { icon: "🌱", title: "Mentorship", text: "Nurturing scientists at every stage of their career." },
    { icon: "🌍", title: "Impact", text: "Our work addresses real challenges in health and environment." }
  ]
}

export const piInfo = {
  name: "Prof. Your Name",                  // ← PI name
  title: "Professor & Principal Investigator",
  photo: "/pi-photo.png",                   // ← URL to PI photo
  bio: `Prof. Your Name is a Professor in the Department of Chemistry at Your University. 
  After completing doctoral studies at [Institute] and postdoctoral work at [Lab], 
  they joined the faculty in [year]. Their research focuses on supramolecular chemistry, 
  self-assembly, and biomolecular interactions.`,
  education: [
    { degree: "PhD in Chemistry", institution: "IIT Bombay", year: "2005" },
    { degree: "Postdoctoral Fellow", institution: "MIT, USA", year: "2005–2008" },
    { degree: "BTech in Chemical Engineering", institution: "IIT Kharagpur", year: "2001" },
  ],
  awards: [
    "SERB National Science Chair, 2022",
    "Shanti Swarup Bhatnagar Prize, 2019",
    "DST INSPIRE Faculty Award, 2010",
  ],
}

export const members = [
  {
    id: 1,
    name: "Dr. Ananya Sen",
    role: "Research Scholar",
    photo: null,
    project: "Self-assembling peptide hydrogels",
    email: "ananya@uni.edu",
    linkedin: "#",
  },
  {
    id: 2,
    name: "Rahul Chatterjee",
    role: "Research Scholar",
    photo: null,
    project: "Metal-organic cages for drug delivery",
    email: "rahul@uni.edu",
    linkedin: "#",
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Research Scholar",
    photo: null,
    project: "G-quadruplex interactions in cancer biology",
    email: "priya@uni.edu",
    linkedin: "#",
  },
  {
    id: 4,
    name: "Aditya Kumar",
    role: "Masters Student",
    photo: null,
    project: "Fluorescent sensors for heavy metal detection",
    email: "aditya@uni.edu",
    linkedin: "#",
  },
  {
    id: 5,
    name: "Sneha Das",
    role: "Bachelor Student",
    photo: null,
    project: "Supramolecular catalysis",
    email: "sneha@uni.edu",
    linkedin: "#",
  },
]

export const research = [
  {
    id: 1,
    title: "Supramolecular Self-Assembly",
    icon: "🔬",
    color: "#dbeafe",
    description:
      "We design molecular building blocks that spontaneously organize into complex, functional architectures through non-covalent interactions including hydrogen bonding, π-π stacking, and hydrophobic effects.",
    keywords: ["Self-assembly", "Hydrogen bonding", "Host-guest chemistry"],
  },
  {
    id: 2,
    title: "Biomolecular Recognition",
    icon: "🧬",
    color: "#dcfce7",
    description:
      "Understanding and mimicking the precise molecular recognition events that govern biological processes. We develop synthetic receptors that selectively bind to biomolecules of therapeutic relevance.",
    keywords: ["DNA binding", "Protein-ligand", "Aptamers"],
  },
  {
    id: 3,
    title: "Drug Delivery Systems",
    icon: "💊",
    color: "#fef3c7",
    description:
      "Engineering supramolecular containers and responsive materials for controlled drug release, targeting cancer cells and inflammatory tissues with unprecedented precision.",
    keywords: ["Nanocarriers", "Stimuli-responsive", "Cancer therapeutics"],
  },
  {
    id: 4,
    title: "Chemical Sensors",
    icon: "⚡",
    color: "#fce7f3",
    description:
      "Developing highly selective fluorescent and colorimetric sensors for the detection of biologically and environmentally relevant analytes, from metal ions to disease biomarkers.",
    keywords: ["Fluorescence", "Heavy metals", "Biomarkers"],
  },
]

export const publications = [
  {
    id: 1,
    title: "A Supramolecular Cage for Enantioselective Recognition of Amino Acids",
    authors: "Sen, A.; Chatterjee, R.; Your Name, Y.",
    journal: "Journal of the American Chemical Society",
    year: 2024,
    volume: "146",
    pages: "12345–12356",
    doi: "10.1021/jacs.4b01234",
    type: "Research Article",
  },
  {
    id: 2,
    title: "G-Quadruplex Stabilization by Small Molecule Ligands: Implications for Cancer Biology",
    authors: "Sharma, P.; Kumar, A.; Your Name, Y.",
    journal: "Angewandte Chemie International Edition",
    year: 2024,
    volume: "63",
    pages: "e202312345",
    doi: "10.1002/anie.202312345",
    type: "Research Article",
  },
  {
    id: 3,
    title: "Self-Assembled Peptide Hydrogels as Extracellular Matrix Mimics",
    authors: "Sen, A.; Das, S.; Your Name, Y.",
    journal: "ACS Nano",
    year: 2023,
    volume: "17",
    pages: "8901–8912",
    doi: "10.1021/acsnano.3c02345",
    type: "Research Article",
  },
  {
    id: 4,
    title: "Recent Advances in Supramolecular Drug Delivery: A Comprehensive Review",
    authors: "Your Name, Y.; Chatterjee, R.",
    journal: "Chemical Reviews",
    year: 2023,
    volume: "123",
    pages: "5678–5720",
    doi: "10.1021/acs.chemrev.3c00123",
    type: "Review",
  },
  {
    id: 5,
    title: "Fluorescent Chemosensors for the Detection of Pb²⁺ in Aqueous Media",
    authors: "Kumar, A.; Das, S.; Your Name, Y.",
    journal: "Analytical Chemistry",
    year: 2022,
    volume: "94",
    pages: "3456–3464",
    doi: "10.1021/acs.analchem.2c00789",
    type: "Research Article",
  },
]

export const news = [
  {
    id: 1,
    date: "March 2025",
    title: "Lab receives SERB CRG grant for supramolecular drug delivery project",
    type: "Grant",
  },
  {
    id: 2,
    date: "January 2025",
    title: "Rahul's paper accepted in JACS — congratulations!",
    type: "Publication",
  },
  {
    id: 3,
    date: "December 2024",
    title: "PhD positions available — applications now open",
    type: "Opportunity",
  },
  {
    id: 4,
    date: "November 2024",
    title: "Lab hosts International Symposium on Supramolecular Chemistry",
    type: "Event",
  },
]

export const facilities = [
  { id: '1', name: 'NMR Spectrometer (400 MHz)', icon: '⚙️' },
  { id: '2', name: 'Fluorescence Spectrophotometer', icon: '⚙️' },
  { id: '3', name: 'HPLC System', icon: '⚙️' },
  { id: '4', name: 'Mass Spectrometer (ESI-MS)', icon: '⚙️' },
  { id: '5', name: 'UV-Vis Spectrophotometer', icon: '⚙️' },
  { id: '6', name: 'Circular Dichroism', icon: '⚙️' },
  { id: '7', name: 'Dynamic Light Scattering', icon: '⚙️' },
  { id: '8', name: 'Confocal Microscope', icon: '⚙️' },
]
